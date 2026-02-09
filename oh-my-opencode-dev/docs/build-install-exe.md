# 将 install_offline.py 打包为单文件 exe

内网禁止运行脚本时，可将 Python 安装程序打包为 **install_offline.exe**，直接双击或命令行运行，无需安装 Python。

## 环境要求（仅在有网环境打包时）

- Python 3.10+（建议 3.11）
- PyInstaller：`pip install pyinstaller`

## 打包命令

在**项目根目录**（即包含 `docs/` 的目录）执行：

```bash
# 单文件 exe，带控制台窗口（便于看日志）
pyinstaller --onefile --name install-offline --console docs/install_offline.py
```

生成物在 **dist/install-offline.exe**。可将该 exe 放入导入包根目录，与 `cache/`、`plugin/`、`oh-my-opencode-*.tgz` 同级。

## 可选：无控制台窗口（仅双击运行）

若希望双击时**不弹出**黑色控制台窗口，使用：

```bash
pyinstaller --onefile --name install-offline --noconsole docs/install_offline.py
```

此时日志仍会写入包根目录下的 `install-offline.log`，出错时请查看该文件。

## 内网使用方式

- 将 **install-offline.exe** 与导入包放在同一目录（或指定 `--package-root`）。
- 直接运行：
  - `install-offline.exe`（以 exe 所在目录为包根）
  - `install-offline.exe --archive "D:\path\to\bundle.7z"`（先解压再安装）
  - `install-offline.exe --package-root "D:\path\to\output"`
- 内网机需已安装 **Bun**、**7-Zip**（仅在使用 `--archive` 时）；**无需安装 Python**。

## 依赖说明

`install_offline.py` 仅使用 Python 标准库（json、os、shutil、subprocess、argparse 等），无需额外 pip 包，打包后 exe 为单文件，便于拷贝到内网。
