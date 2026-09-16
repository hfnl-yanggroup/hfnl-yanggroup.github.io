# YangGroup@HFNL HPC 集群使用文档

本仓库是 YangGroup@HFNL 的服务器与集群使用说明站点，基于
[Jekyll](https://jekyllrb.com/) 和 [Chirpy 7.6.0](https://github.com/cotes2020/jekyll-theme-chirpy) 构建。

## 内容维护

- 在 `_posts/` 新建 Markdown 文件发布说明；文件名使用 `YYYY-MM-DD-标题.md`。
- 在 `_data/announcement.yml` 维护首页公告，最新公告放在第一项。
- 静态图片、下载文件分别置于 `assets/images/`、`assets/files/`。
- 站点的标题、链接、头像和功能开关在 `_config.yml` 中配置。

## 本地预览

安装 Ruby 与 Bundler 后，在仓库根目录运行：

```powershell
bundle install
bundle exec jekyll serve
```

浏览器访问 <http://127.0.0.1:4000/>。提交到 `main` 或 `master` 分支后，GitHub Actions 会构建并发布 GitHub Pages。

## 主题来源

主题源码已随仓库保留，便于维护本地布局、样式和脚本；运行时仍固定使用 `jekyll-theme-chirpy ~> 7.6`。Chirpy 以 MIT License 发布。
