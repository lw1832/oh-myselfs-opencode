<#
.SYNOPSIS
  内网一键安装 oh-my-opencode 插件（幂等，带日志，可选 7z 解压）

.DESCRIPTION
  自动执行《内网操作安装指南》中的步骤：放置缓存、安装插件、注册 opencode.json、
  写入 oh-my-opencode.json 离线配置。多次运行结果一致（幂等）。
  若传入 -Archive，则先用 7z 解压再执行。

.PARAMETER Archive
  可选。.7z 压缩包路径；脚本会用 7z 解压到临时目录后从解压目录执行后续步骤。

.PARAMETER PackageRoot
  可选。导入包根目录（含 cache/、plugin/ 或 oh-my-opencode-*.tgz）。
  不指定且未用 -Archive 时，默认为脚本所在目录。

.EXAMPLE
  .\install-offline.ps1
  .\install-offline.ps1 -Archive "D:\offline\oh-my-opencode.7z"
  .\install-offline.ps1 -PackageRoot "D:\offline\output"
#>

param(
  [Parameter(Mandatory = $false)]
  [string] $Archive = "",
  [Parameter(Mandatory = $false)]
  [string] $PackageRoot = ""
)

$ErrorActionPreference = "Stop"
$script:LogPath = ""
$script:PackageRootResolved = ""

function Write-Log {
  param([string] $Message, [string] $Level = "INFO")
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $line = "[$timestamp] [$Level] $Message"
  Write-Host $line
  if ($script:LogPath) {
    Add-Content -Path $script:LogPath -Value $line -ErrorAction SilentlyContinue
  }
}

function Write-Step {
  param([string] $StepName, [string] $Detail = "")
  Write-Log "========== $StepName ==========" "STEP"
  if ($Detail) { Write-Log $Detail }
}

function Write-StepOk {
  param([string] $Message = "OK")
  Write-Log "  -> $Message" "OK"
}

function Write-StepFail {
  param([string] $Message)
  Write-Log "  -> FAIL: $Message" "ERROR"
  throw "Step failed: $Message"
}

function Get-ScriptDir {
  if ($PSCommandPath) {
    return (Split-Path -Parent $PSCommandPath)
  }
  return (Get-Location).Path
}

function Get-OpenCodeConfigDir {
  if ($env:OPENCODE_CONFIG_DIR) {
    return $env:OPENCODE_CONFIG_DIR.Trim()
  }
  if ($env:APPDATA) {
    $app = Join-Path $env:APPDATA "opencode"
    if (Test-Path (Join-Path $app "opencode.json")) { return $app }
    if (Test-Path (Join-Path $app "opencode.jsonc")) { return $app }
  }
  $homeDir = $env:HOME ?? $env:USERPROFILE
  $cross = Join-Path $homeDir ".config" "opencode"
  if (Test-Path (Join-Path $cross "opencode.json")) { return $cross }
  if (Test-Path (Join-Path $cross "opencode.jsonc")) { return $cross }
  if ($env:APPDATA) { return Join-Path $env:APPDATA "opencode" }
  return Join-Path $homeDir ".config" "opencode"
}

function Get-OmoCacheDir {
  $base = if ($env:LOCALAPPDATA) { $env:LOCALAPPDATA } elseif ($env:XDG_CACHE_HOME) { $env:XDG_CACHE_HOME } else { Join-Path ($env:HOME ?? $env:USERPROFILE) ".cache" }
  return Join-Path $base "oh-my-opencode"
}
function Get-OpenCodeCacheDir {
  $base = if ($env:LOCALAPPDATA) { $env:LOCALAPPDATA } elseif ($env:XDG_CACHE_HOME) { $env:XDG_CACHE_HOME } else { Join-Path ($env:HOME ?? $env:USERPROFILE) ".cache" }
  return Join-Path $base "opencode"
}

function Find-7z {
  $paths = @("7z", "7za")
  foreach ($p in $paths) {
    $exe = Get-Command $p -ErrorAction SilentlyContinue
    if ($exe) { return $exe.Source }
  }
  $prog = "C:\Program Files\7-Zip\7z.exe"
  if (Test-Path $prog) { return $prog }
  $prog64 = "C:\Program Files (x86)\7-Zip\7z.exe"
  if (Test-Path $prog64) { return $prog64 }
  return $null
}

function Expand-7zArchive {
  param([string] $ArchivePath, [string] $OutDir)
  $seven = Find-7z
  if (-not $seven) { Write-StepFail "7z not found. Install 7-Zip or add 7z to PATH." }
  if (-not (Test-Path $ArchivePath)) { Write-StepFail "Archive not found: $ArchivePath" }
  & $seven "x" "-o$OutDir" "-y" $ArchivePath
  if ($LASTEXITCODE -ne 0) { Write-StepFail "7z extract failed with exit code $LASTEXITCODE" }
}

function Step-CopyCache {
  param([string] $Root)
  Write-Step "步骤 1：放置缓存" "源: $Root\cache  -> 用户缓存目录"
  $omoSrc = Join-Path $Root "cache" "oh-my-opencode"
  $ocSrc = Join-Path $Root "cache" "opencode"
  $omoDst = Get-OmoCacheDir
  $ocDst = Get-OpenCodeCacheDir

  if (Test-Path $omoSrc) {
    if (-not (Test-Path $omoDst)) { New-Item -ItemType Directory -Path $omoDst -Force | Out-Null }
    Copy-Item -Path (Join-Path $omoSrc "*") -Destination $omoDst -Recurse -Force -ErrorAction Stop
    Write-StepOk "已同步 cache/oh-my-opencode -> $omoDst"
  } else {
    Write-Log "  跳过: 未找到 cache/oh-my-opencode" "WARN"
  }

  if (Test-Path $ocSrc) {
    if (-not (Test-Path $ocDst)) { New-Item -ItemType Directory -Path $ocDst -Force | Out-Null }
    Copy-Item -Path (Join-Path $ocSrc "*") -Destination $ocDst -Recurse -Force -ErrorAction Stop
    Write-StepOk "已同步 cache/opencode -> $ocDst"
  } else {
    Write-Log "  跳过: 未找到 cache/opencode" "WARN"
  }
}

function Get-PluginFileUrl {
  param([string] $Root)
  $tgz = Get-ChildItem -Path $Root -Filter "oh-my-opencode-*.tgz" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($tgz) {
    $pluginsDir = Join-Path $Root "opencode-plugins"
    if (-not (Test-Path $pluginsDir)) {
      New-Item -ItemType Directory -Path $pluginsDir -Force | Out-Null
      Push-Location $pluginsDir
      try {
        & bun init -y 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "bun init failed" }
        & bun add (Join-Path $Root $tgz.Name) 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "bun add failed" }
      } finally { Pop-Location }
    }
    $entry = Join-Path $pluginsDir "node_modules" "oh-my-opencode" "dist" "index.js"
    if (-not (Test-Path $entry)) { throw "Plugin not found at $entry after bun add" }
    $abs = (Resolve-Path $entry).Path -replace "\\", "/"
    return "file:///$abs"
  }

  $pluginDir = Join-Path $Root "plugin"
  if (Test-Path (Join-Path $pluginDir "dist" "index.js")) {
    $pkgJson = Join-Path $pluginDir "package.json"
    if (Test-Path $pkgJson) {
      $nodeMod = Join-Path $pluginDir "node_modules"
      if (-not (Test-Path $nodeMod) -or -not (Test-Path (Join-Path $nodeMod "oh-my-opencode"))) {
        Push-Location $pluginDir
        try {
          & bun install 2>&1 | Out-Null
          if ($LASTEXITCODE -ne 0) { Write-Log "bun install in plugin dir had non-zero exit; continuing." "WARN" }
        } finally { Pop-Location }
      }
    }
    $entry = Join-Path $pluginDir "dist" "index.js"
    $abs = (Resolve-Path $entry).Path -replace "\\", "/"
    return "file:///$abs"
  }

  Write-StepFail "未找到 oh-my-opencode-*.tgz 或 plugin/dist/index.js"
}

function Step-EnsurePlugin {
  param([string] $Root)
  Write-Step "步骤 2：解析插件路径" ""
  $url = Get-PluginFileUrl -Root $Root
  Write-StepOk "插件入口: $url"
  return $url
}

function Step-RegisterOpenCode {
  param([string] $PluginFileUrl, [string] $ConfigDir)
  Write-Step "步骤 3：注册插件（opencode.json）" "配置目录: $ConfigDir"
  if (-not (Test-Path $ConfigDir)) {
    New-Item -ItemType Directory -Path $ConfigDir -Force | Out-Null
  }
  $jsonPath = Join-Path $ConfigDir "opencode.json"
  $jsoncPath = Join-Path $ConfigDir "opencode.jsonc"
  $path = $null
  $content = $null
  if (Test-Path $jsoncPath) { $path = $jsoncPath } elseif (Test-Path $jsonPath) { $path = $jsonPath } else { $path = $jsonPath }
  if (Test-Path $path) {
    $raw = Get-Content -Path $path -Raw -Encoding UTF8
    $content = $raw | ConvertFrom-Json
  } else {
    $content = [PSCustomObject]@{ plugin = @() }
  }
  if (-not $content.plugin) { $content.plugin = @() }
  $list = [System.Collections.ArrayList]@($content.plugin)
  for ($i = $list.Count - 1; $i -ge 0; $i--) {
    if ($list[$i] -like "*oh-my-opencode*dist*index.js*") { $list.RemoveAt($i); break }
  }
  if ($list -notcontains $PluginFileUrl) { $list.Add($PluginFileUrl) | Out-Null }
  $content.plugin = @($list)
  $content | ConvertTo-Json -Depth 10 | Set-Content -Path $path -Encoding UTF8 -NoNewline
  Write-StepOk "已写入 plugin 条目到 $path"
}

function Step-WriteOmoConfig {
  param([string] $ConfigDir)
  Write-Step "步骤 4：启用离线配置（oh-my-opencode.json）" ""
  $omoPath = Join-Path $ConfigDir "oh-my-opencode.json"
  $defaultHooks = @("auto-update-checker")
  $defaultMcps = @("websearch", "context7", "grep_app")
  $content = $null
  if (Test-Path $omoPath) {
    try {
      $content = Get-Content -Path $omoPath -Raw -Encoding UTF8 | ConvertFrom-Json
    } catch {
      Write-Log "  读取现有 oh-my-opencode.json 时出错: $_" "WARN"
    }
  }
  if (-not $content) { $content = [PSCustomObject]@{} }
  if (-not $content.experimental) { $content | Add-Member -NotePropertyName "experimental" -NotePropertyValue ([PSCustomObject]@{}) -Force }
  $content.experimental | Add-Member -NotePropertyName "disable_model_list_fetch" -NotePropertyValue $true -Force
  $hooks = [System.Collections.ArrayList]@(if ($content.disabled_hooks) { @($content.disabled_hooks) } else { @() })
  foreach ($h in $defaultHooks) { if ($hooks -notcontains $h) { $hooks.Add($h) | Out-Null } }
  $content.disabled_hooks = @($hooks)
  $mcps = [System.Collections.ArrayList]@(if ($content.disabled_mcps) { @($content.disabled_mcps) } else { @() })
  foreach ($m in $defaultMcps) { if ($mcps -notcontains $m) { $mcps.Add($m) | Out-Null } }
  $content.disabled_mcps = @($mcps)
  $content | ConvertTo-Json -Depth 10 | Set-Content -Path $omoPath -Encoding UTF8 -NoNewline
  Write-StepOk "已写入 $omoPath"
}

try {
  $scriptDir = Get-ScriptDir
  if ($Archive) {
    Write-Step "解压归档（7z）" "源: $Archive"
    $extractDir = Join-Path $env:TEMP "oh-my-opencode-offline-$(Get-Date -Format 'yyyyMMddHHmmss')"
    New-Item -ItemType Directory -Path $extractDir -Force | Out-Null
    Expand-7zArchive -ArchivePath $Archive -OutDir $extractDir
    $dirs = Get-ChildItem -Path $extractDir -Directory
    if ($dirs.Count -eq 1) { $script:PackageRootResolved = $dirs[0].FullName } else { $script:PackageRootResolved = $extractDir }
    Write-StepOk "已解压到 $script:PackageRootResolved"
  } elseif ($PackageRoot) {
    $script:PackageRootResolved = (Resolve-Path $PackageRoot).Path
  } else {
    $script:PackageRootResolved = $scriptDir
  }

  $script:LogPath = Join-Path $script:PackageRootResolved "install-offline.log"
  Write-Log "PackageRoot = $script:PackageRootResolved" "INFO"
  Write-Log "LogPath = $script:LogPath" "INFO"

  $configDir = Get-OpenCodeConfigDir
  Write-Log "OpenCode config dir = $configDir" "INFO"

  Step-CopyCache -Root $script:PackageRootResolved
  $pluginUrl = Step-EnsurePlugin -Root $script:PackageRootResolved
  Step-RegisterOpenCode -PluginFileUrl $pluginUrl -ConfigDir $configDir
  Step-WriteOmoConfig -ConfigDir $configDir

  Write-Step "完成" "内网安装步骤已执行（幂等）。请运行 opencode 验证。"
  Write-Log "日志已写入: $script:LogPath" "INFO"
  exit 0
} catch {
  Write-Log "ERROR: $($_.Exception.Message)" "ERROR"
  Write-Log $_.ScriptStackTrace "ERROR"
  if ($script:LogPath) { Write-Log "详细日志: $script:LogPath" "ERROR" }
  exit 1
}
