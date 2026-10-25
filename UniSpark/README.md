# UniSpark 项目主页

参考 AGG 项目页的深色视觉与分组演示结构，以当前论文和本地图片为内容制作。纯 HTML / CSS / JavaScript，无需安装依赖。

## 本地预览

在论文项目根目录运行：

```sh
python3 -m http.server 8123 --bind 127.0.0.1 --directory website
```

访问 http://127.0.0.1:8123 。也可以直接打开 `index.html`；剪贴板功能可能需要 HTTP 环境。

## 部署

公开网址：https://unispark-research.jaychempan.chatgpt.site

将 `website/` 目录内容上传至任意静态托管服务或 GitHub Pages 发布目录即可。所有图片、脚本和 PDF 均使用相对路径，支持仓库子路径部署，不依赖外部 CDN。Sites 发布目录为 `../sites/unispark-research/`，站点身份保存在该目录的 `.openai/hosting.json`。后续更新应复用该站点。网页使用约 8 MB 的论文压缩副本，原始论文 PDF 保留不变。

- `index.html`：标题、作者、介绍及引用。
- `style.css`：深色主题、桌面和移动端布局。
- `content.js`：图库、编辑对比和连续图像示例。
- `results-data.js`：论文实验表格数据，包括完整基线、分类得分与两类效率测量。
- `app.js`：图库过滤、对比滑块、示例切换、实验数据和引用复制。
- `assets/`：优化后的图片及当前论文 PDF。
- `scripts/asset-map.json`：网页图片与原始论文素材的对应关系。

实验数据来自 `doc/6.exp.tex` 和 `doc/understanding-published-results.tex`。视频展示区已移除，视频素材仍保留在本地。BibTeX 标注为 manuscript，未虚构 arXiv 编号、代码仓库或模型下载地址。

## 更新素材（macOS）

从论文项目根目录运行：

```sh
swift -module-cache-path /private/tmp/unispark-swift-cache website/scripts/prepare-assets.swift
```

该脚本根据素材清单生成网页 JPEG，并复制 `build/main.pdf` 为 `assets/unispark.pdf`。目前该 PDF 保留论文中的修订标红；正式发布时可先生成不标红版本再更新素材。脚本不会修改论文源码和原图。

布局统一使用 `style.css` 的 `--width: 1120px` 和 `--gutter` 控制所有主区块、导航及页脚。页首白色蚂蚁技术研究院 logo 存在 `assets/ant-research.png`，来自参考 AGG 页面使用的同款官方标识，链接到 https://www.antresearch.com/ 。

页面使用本地 Manrope 字体（400 / 600 / 700 字重），许可见 `assets/manrope-LICENSE.txt`；字体来自 Google Fonts，加载不依赖外部服务。图片均在页面内直接展示，不提供点击放大。导航会标记当前浏览区块。

实验区提供六个任务入口，每项包含结果解读、评测设置与来源。宽表格在手机端局部横向滚动，完整基线默认收起。所有数值来自论文表格，不将不同 ImgEdit 裁判下的分数作直接排名。
