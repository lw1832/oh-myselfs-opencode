# Bun Windows 内网离线安装

本目录包含 **Bun** 的 Windows x64 离线包，供在内网（无网络）环境安装使用。

## 文件说明

- **bun-windows-x64.zip**：Bun 官方 GitHub 发布的 Windows x64 压缩包（当前为 v1.3.8）。
- 下载地址（有网时）：https://github.com/oven-sh/bun/releases/download/bun-v1.3.8/bun-windows-x64.zip

## 内网安装步骤（Windows）

1. **解压**  
   将 `bun-windows-x64.zip` 解压到任意目录，例如 `D:\tools\bun`。解压后得到 **bun.exe**。

2. **加入 PATH（任选一种）**  
   - **方式 A**：将解压目录（如 `D:\tools\bun`）加入系统或用户环境变量 **Path**。  
   - **方式 B**：不改 PATH，每次在解压目录下执行 `.\bun.exe`，或在脚本中用完整路径调用。

3. **验证**  
   打开新的命令行窗口，执行：
   ```powershell
   bun --version
   ```
   若显示版本号（如 1.3.8），则安装成功。

## 使用本 Bun 安装 oh-my-opencode

在内网机安装好 Bun 后，可按照《内网操作安装指南》用 Bun 安装插件，例如：

```powershell
cd D:\company\opencode-plugins
bun init -y
bun add .\oh-my-opencode-3.1.11.tgz
```

若 Bun 未加入 PATH，请使用完整路径，例如：  
`D:\tools\bun\bun.exe add .\oh-my-opencode-3.1.11.tgz`。
