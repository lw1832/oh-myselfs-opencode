#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
内网一键安装 oh-my-opencode 插件（幂等，带日志，可选 7z 解压）。
可打包为单文件 .exe（PyInstaller），内网禁止运行脚本时直接运行 exe。

用法:
  install_offline.exe
  install_offline.exe --archive "D:\\path\\to\\bundle.7z"
  install_offline.exe --package-root "D:\\path\\to\\output"
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

# 全局：日志文件路径，用于写入文件
LOG_PATH: str = ""


def _is_frozen() -> bool:
    """是否以 PyInstaller 打包的 exe 运行"""
    return getattr(sys, "frozen", False)


def _default_package_root() -> Path:
    """默认包根：exe 所在目录或脚本所在目录"""
    if _is_frozen():
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent


def _log(msg: str, level: str = "INFO") -> None:
    import datetime
    line = f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] [{level}] {msg}"
    print(line)
    global LOG_PATH
    if LOG_PATH:
        try:
            with open(LOG_PATH, "a", encoding="utf-8") as f:
                f.write(line + "\n")
        except Exception:
            pass


def _step(name: str, detail: str = "") -> None:
    _log("========== " + name + " ==========", "STEP")
    if detail:
        _log(detail)


def _step_ok(msg: str = "OK") -> None:
    _log("  -> " + msg, "OK")


def _step_fail(msg: str) -> None:
    _log("  -> FAIL: " + msg, "ERROR")
    raise RuntimeError("Step failed: " + msg)


def _get_opencode_config_dir() -> Path:
    env = os.environ.get("OPENCODE_CONFIG_DIR", "").strip()
    if env:
        return Path(env)
    home = Path.home()
    if sys.platform == "win32":
        appdata = os.environ.get("APPDATA")
        if appdata:
            app = Path(appdata) / "opencode"
            if (app / "opencode.json").exists() or (app / "opencode.jsonc").exists():
                return app
        cross = home / ".config" / "opencode"
        if (cross / "opencode.json").exists() or (cross / "opencode.jsonc").exists():
            return cross
        return Path(appdata or (home / "AppData" / "Roaming")) / "opencode"
    cross = home / ".config" / "opencode"
    if (cross / "opencode.json").exists() or (cross / "opencode.jsonc").exists():
        return cross
    return home / ".config" / "opencode"


def _get_omo_cache_dir() -> Path:
    base = os.environ.get("LOCALAPPDATA") or os.environ.get("XDG_CACHE_HOME") or str(Path.home() / ".cache")
    return Path(base) / "oh-my-opencode"


def _get_opencode_cache_dir() -> Path:
    base = os.environ.get("LOCALAPPDATA") or os.environ.get("XDG_CACHE_HOME") or str(Path.home() / ".cache")
    return Path(base) / "opencode"


def _find_7z() -> str | None:
    for name in ("7z", "7za"):
        exe = shutil.which(name)
        if exe:
            return exe
    for p in (
        Path("C:/Program Files/7-Zip/7z.exe"),
        Path("C:/Program Files (x86)/7-Zip/7z.exe"),
    ):
        if p.exists():
            return str(p)
    return None


def _extract_7z(archive_path: str, out_dir: str) -> None:
    exe = _find_7z()
    if not exe:
        _step_fail("未找到 7z。请安装 7-Zip 或将 7z 加入 PATH。")
    if not os.path.isfile(archive_path):
        _step_fail("归档不存在: " + archive_path)
    out_dir = os.path.abspath(out_dir)
    archive_path = os.path.abspath(archive_path)
    r = subprocess.run([exe, "x", "-o" + out_dir, "-y", archive_path], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        _step_fail("7z 解压失败，退出码 " + str(r.returncode))


def _step_copy_cache(root: Path) -> None:
    _step("步骤 1：放置缓存", "源: " + str(root / "cache") + " -> 用户缓存目录")
    omo_src = root / "cache" / "oh-my-opencode"
    oc_src = root / "cache" / "opencode"
    omo_dst = _get_omo_cache_dir()
    oc_dst = _get_opencode_cache_dir()

    if omo_src.exists():
        omo_dst.mkdir(parents=True, exist_ok=True)
        for name in os.listdir(omo_src):
            src = omo_src / name
            dst = omo_dst / name
            if src.is_dir():
                if dst.exists():
                    shutil.rmtree(dst, ignore_errors=True)
                shutil.copytree(src, dst)
            else:
                shutil.copy2(src, dst)
        _step_ok("已同步 cache/oh-my-opencode -> " + str(omo_dst))
    else:
        _log("  跳过: 未找到 cache/oh-my-opencode", "WARN")

    if oc_src.exists():
        oc_dst.mkdir(parents=True, exist_ok=True)
        for name in os.listdir(oc_src):
            src = oc_src / name
            dst = oc_dst / name
            if src.is_dir():
                if dst.exists():
                    shutil.rmtree(dst, ignore_errors=True)
                shutil.copytree(src, dst)
            else:
                shutil.copy2(src, dst)
        _step_ok("已同步 cache/opencode -> " + str(oc_dst))
    else:
        _log("  跳过: 未找到 cache/opencode", "WARN")


def _get_plugin_file_url(root: Path) -> str:
    tgz_list = list(root.glob("oh-my-opencode-*.tgz"))
    if tgz_list:
        tgz = tgz_list[0]
        plugins_dir = root / "opencode-plugins"
        entry = plugins_dir / "node_modules" / "oh-my-opencode" / "dist" / "index.js"
        if not entry.exists():
            plugins_dir.mkdir(parents=True, exist_ok=True)
            cwd = os.getcwd()
            try:
                os.chdir(plugins_dir)
                r = subprocess.run(["bun", "init", "-y"], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=30)
                if r.returncode != 0:
                    _log("bun init stdout: " + (r.stdout or ""), "ERROR")
                    _log("bun init stderr: " + (r.stderr or ""), "ERROR")
                    raise RuntimeError("bun init 失败: " + (r.stderr or r.stdout or str(r.returncode)))
                r = subprocess.run(["bun", "add", str(tgz)], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=120)
                if r.returncode != 0:
                    _log("bun add stdout: " + (r.stdout or ""), "ERROR")
                    _log("bun add stderr: " + (r.stderr or ""), "ERROR")
                    plugin_dir = root / "plugin"
                    index_js = plugin_dir / "dist" / "index.js"
                    if index_js.exists():
                        _log("bun add 在内网可能因无法访问 registry 失败；已回退到 plugin/ 目录", "WARN")
                        pkg_json = plugin_dir / "package.json"
                        node_mod = plugin_dir / "node_modules"
                        if pkg_json.exists() and (not node_mod.exists() or not (node_mod / "oh-my-opencode").exists()):
                            cwd2 = os.getcwd()
                            try:
                                os.chdir(plugin_dir)
                                subprocess.run(["bun", "install"], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=120)
                            except Exception as e:
                                _log("plugin 目录 bun install 异常（继续）: " + str(e), "WARN")
                            finally:
                                os.chdir(cwd2)
                        abs_path = str(index_js.resolve()).replace("\\", "/")
                        return "file:///" + abs_path
                    raise RuntimeError("bun add 失败: " + (r.stderr or r.stdout or str(r.returncode)))
            finally:
                os.chdir(cwd)
        abs_path = str(entry.resolve()).replace("\\", "/")
        return "file:///" + abs_path

    plugin_dir = root / "plugin"
    index_js = plugin_dir / "dist" / "index.js"
    if index_js.exists():
        pkg_json = plugin_dir / "package.json"
        node_mod = plugin_dir / "node_modules"
        omo_in_node = node_mod / "oh-my-opencode"
        if pkg_json.exists() and (not node_mod.exists() or not omo_in_node.exists()):
            cwd = os.getcwd()
            try:
                os.chdir(plugin_dir)
                subprocess.run(["bun", "install"], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=120)
            except Exception as e:
                _log("plugin 目录 bun install 异常（继续）: " + str(e), "WARN")
            finally:
                os.chdir(cwd)
        abs_path = str(index_js.resolve()).replace("\\", "/")
        return "file:///" + abs_path

    _step_fail("未找到 oh-my-opencode-*.tgz 或 plugin/dist/index.js")


def _step_ensure_plugin(root: Path) -> str:
    _step("步骤 2：解析插件路径", "")
    url = _get_plugin_file_url(root)
    _step_ok("插件入口: " + url)
    return url


def _step_register_opencode(plugin_file_url: str, config_dir: Path) -> None:
    _step("步骤 3：注册插件（opencode.json）", "配置目录: " + str(config_dir))
    config_dir.mkdir(parents=True, exist_ok=True)
    json_path = config_dir / "opencode.json"
    jsonc_path = config_dir / "opencode.jsonc"
    path = jsonc_path if jsonc_path.exists() else json_path
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            raw = f.read()
        try:
            content = json.loads(raw)
        except json.JSONDecodeError as e:
            _step_fail("opencode.json 解析失败: " + str(e))
    else:
        content = {"plugin": []}
    if "plugin" not in content:
        content["plugin"] = []
    plugins = list(content["plugin"])
    plugins = [p for p in plugins if "oh-my-opencode" not in p or "dist" not in p or "index.js" not in p]
    if plugin_file_url not in plugins:
        plugins.append(plugin_file_url)
    content["plugin"] = plugins
    with open(path, "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    _step_ok("已写入 plugin 条目到 " + str(path))


def _step_write_omo_config(config_dir: Path) -> None:
    _step("步骤 4：启用离线配置（oh-my-opencode.json）", "")
    omo_path = config_dir / "oh-my-opencode.json"
    default_hooks = ["auto-update-checker"]
    default_mcps = ["websearch", "context7", "grep_app"]

    content = {}
    if omo_path.exists():
        try:
            with open(omo_path, "r", encoding="utf-8") as f:
                content = json.load(f)
        except Exception as e:
            _log("读取现有 oh-my-opencode.json 时出错: " + str(e), "WARN")
    if not isinstance(content, dict):
        content = {}

    content.setdefault("experimental", {})
    content["experimental"]["disable_model_list_fetch"] = True
    hooks = list(content.get("disabled_hooks") or [])
    for h in default_hooks:
        if h not in hooks:
            hooks.append(h)
    content["disabled_hooks"] = hooks
    mcps = list(content.get("disabled_mcps") or [])
    for m in default_mcps:
        if m not in mcps:
            mcps.append(m)
    content["disabled_mcps"] = mcps

    with open(omo_path, "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    _step_ok("已写入 " + str(omo_path))


def main() -> int:
    global LOG_PATH
    parser = argparse.ArgumentParser(description="内网一键安装 oh-my-opencode（幂等，可打包为 exe）")
    parser.add_argument("--archive", "-a", metavar="PATH", help=".7z 压缩包路径，将先解压再执行")
    parser.add_argument("--package-root", "-p", metavar="DIR", help="导入包根目录；不指定时默认为 exe/脚本所在目录")
    args = parser.parse_args()

    package_root: Path

    if args.archive:
        _step("解压归档（7z）", "源: " + args.archive)
        extract_dir = Path(tempfile.gettempdir()) / ("oh-my-opencode-offline-" + __import__("datetime").datetime.now().strftime("%Y%m%d%H%M%S"))
        extract_dir.mkdir(parents=True, exist_ok=True)
        _extract_7z(args.archive, str(extract_dir))
        subdirs = [d for d in extract_dir.iterdir() if d.is_dir()]
        if len(subdirs) == 1:
            package_root = subdirs[0].resolve()
        else:
            package_root = extract_dir.resolve()
        _step_ok("已解压到 " + str(package_root))
    elif args.package_root:
        package_root = Path(args.package_root).resolve()
        if not package_root.exists():
            _step_fail("包根目录不存在: " + str(package_root))
    else:
        package_root = _default_package_root()

    LOG_PATH = str(package_root / "install-offline.log")
    _log("PackageRoot = " + str(package_root), "INFO")
    _log("LogPath = " + LOG_PATH, "INFO")
    config_dir = _get_opencode_config_dir()
    _log("OpenCode config dir = " + str(config_dir), "INFO")

    _step_copy_cache(package_root)
    plugin_url = _step_ensure_plugin(package_root)
    _step_register_opencode(plugin_url, config_dir)
    _step_write_omo_config(config_dir)

    _step("完成", "内网安装步骤已执行（幂等）。请运行 opencode 验证。")
    _log("日志已写入: " + LOG_PATH, "INFO")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        _log("ERROR: " + str(e), "ERROR")
        if LOG_PATH:
            _log("详细日志: " + LOG_PATH, "ERROR")
        import traceback
        try:
            _log(traceback.format_exc(), "ERROR")
        except Exception:
            print(traceback.format_exc())
        sys.exit(1)
