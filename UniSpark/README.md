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

将 `website/` 目录内容上传至任意静态托管服务或 GitHub Pages 发布目录即可。所有图片和脚本均使用相对路径，支持仓库子路径部署，不依赖外部 CDN。Sites 发布目录为 `../sites/unispark-research/`，站点身份保存在该目录的 `.openai/hosting.json`。后续更新应复用该站点。网页不再附带本地论文 PDF。`index.html` 中三个带 `data-paper-link` 的入口保留原样式，暂不可点击；后续为它们填写 `href` 外链，并移除 `aria-disabled` 和占位 `title` 即可。

- `index.html`：标题、作者、介绍及引用。
- `style.css`：深色主题、桌面和移动端布局。
- `content.js`：图库、编辑对比和连续图像示例。
- `results-data.js`：论文实验表格数据，包括完整基线、分类得分与两类效率测量。
- `app.js`：图库过滤、对比滑块、示例切换、实验数据和引用复制。
- `assets/`：优化后的图片、字体和图标。
- `scripts/asset-map.json`：网页图片与原始论文素材的对应关系。

实验数据来自 `doc/6.exp.tex` 和 `doc/understanding-published-results.tex`。视频展示区已移除，视频素材仍保留在本地。BibTeX 标注为 manuscript，未虚构 arXiv 编号、代码仓库或模型下载地址。

## 更新素材（macOS）

从论文项目根目录运行：

```sh
swift -module-cache-path /private/tmp/unispark-swift-cache website/scripts/prepare-assets.swift
```

该脚本根据素材清单生成网页 JPEG，不再复制论文 PDF。脚本不会修改论文源码和原图。

布局统一使用 `style.css` 的 `--width: 1120px` 和 `--gutter` 控制所有主区块、导航及页脚。页首白色蚂蚁技术研究院 logo 存在 `assets/ant-research.png`，来自参考 AGG 页面使用的同款官方标识，链接到 https://www.antresearch.com/ 。

页面使用本地 Manrope 字体（400 / 600 / 700 字重），许可见 `assets/manrope-LICENSE.txt`；字体来自 Google Fonts，加载不依赖外部服务。图片均在页面内直接展示，不提供点击放大。导航会标记当前浏览区块。

实验区提供六个任务入口，每项包含结果解读、评测设置与来源。宽表格在手机端局部横向滚动，完整基线默认收起。所有数值来自论文表格，不将不同 ImgEdit 裁判下的分数作直接排名。

## 编辑示例来源（2026-10-26）

`Hairstyle` 和旧 `Dessert` 已替换为 `Perfume color` 和 `Dessert glaze`，保留原有滑动对比交互与布局。两组均为 CT `0095000` 的真实模型输出，分别选自本次 12 个候选中的 `perfume-s42` 与 `dessert-s20261026`。采用 50 步采样、CFG 4；原始输入和输出尺寸分别为 768×1024、1024×1024。网站图片仅转换为 JPEG，未裁剪、配准、拼贴或修补。

原始图片和完整推理记录位于 Downloads 下的 `UniBagel-CT0095000-consistency-12-20261026/`。完整指令、种子、源文件哈希及网站映射见 `scripts/editing-provenance.json`；`asset-map.json` 中这四张图片的路径相对于论文根目录指向同级下载目录。

## 文生图图库与质量复查（2026-10-26）

原有与新增样本采用相同的展示筛选标准：检查人体/动物结构、物体接触、建筑支撑、透视、倒影及常识；有明显问题的撤下，关键细节无法确认的暂缓展示。原有 22 张全部复查，保留 9 张、排除 6 张、暂缓 7 张。逐项原因与原图/网页图 SHA-256 见 `scripts/gallery-quality-review.json`。这次复查取代此前“恢复原有 22 张”的展示豁免。

原有样本中的制图师手指融合、海龟头鳍连接异常、微缩交通轨道接入外墙等已撤下。首屏同步将制图师替换为黑色高领肖像、沙漠图书馆替换为运河花市。保留所有原始文件和网页图片，不通过裁切、拼贴、修补或改画掩盖生成错误。

该次复查后，加上上一轮审核通过的 13 张 CT 0095000 新样本，形成 22 张的基础图库：People 4、Architecture 3、Nature 5、Objects 7、Art 3。以下新一批扩充保留这 22 张及其内容不变。

原有素材来自 CT 0042500 文生图输出与论文素材，未混入编辑结果；来源映射、哈希及导出信息见 `scripts/gallery-provenance.json`。

### 新增候选审核

上一轮在 PANProj4 的 0–3 卡使用 CT 0095000 推理 96 张候选，逐张检查后选入 13 张。本轮保留这 13 张及其既有审查记录，没有重新推理或修改图像。

完整新候选检查见 `scripts/gallery-new-quality-review.json`；每个入选项记录指令、种子、权重文件信息及原图/网页图 SHA-256。原图和推理记录位于 Downloads 下的 `UniSpark-CT0095000-gallery60-20261026/`、`UniSpark-CT0095000-native1k20-20261026/` 和 `UniSpark-CT0095000-scene16-20261026/`。网页仅等比例缩小与 JPEG 导出，不放大、裁切或修补。审核是逐图定性筛选，accepted 表示本轮未发现明显问题，不表示对生成图零缺陷的保证。

### 五类继续扩充（60 张真实推理候选）

在 PANProj4（59220174）的 0–3 卡以 CT 0095000、50 步采样、CFG 4 完成 30 个主题 × 2 个种子（73、219），共 60 张候选，每类 12 张。四个推理工作进程均以 0 退出；60 个唯一 ID、尺寸和本地原图 SHA-256 与远端输出逐一匹配。

检查全部候选，并对入选图以原始尺寸检查后，新增 19 张：People +5、Architecture +3、Nature +3、Objects +4、Art +4。按用户要求随后移除 “Portrait in navy” 和 “A quiet seat by the window”，该批当前展示 17 张。图库现为 **39 张：People 7、Architecture 6、Nature 8、Objects 11、Art 7**。All 默认 18 张，通过 Show more 展开至 36 张、再至 39 张；Show fewer 收起。分类计数自动更新，布局不变。

双把手咖啡杯、雌鹿生成鹿角、截断人物和帆数不符等未入选；手爪、家具连接及花型等无法确认的候选暂缓；同主题的相近版本不重复展示。完整 60 条指令、种子、决策和观察见 `scripts/gallery-expansion60-quality-review.json`。入选图只作原生尺寸 JPEG 转换，不裁剪、放大、修补。

原图及推理证据保存在 `/Users/jianchengpan/Downloads/UniSpark-CT0095000-expansion60-20261026/`；远端目录为 `Bagel_pjc/inference-results/gallery-t2i-ct95000-expansion60-20261026/`。此次仅补充图库；此前 22 张素材和元数据、首屏、编辑及连续图像演示保持不变。

## 编辑样例扩充（2026-10-26）

使用 CT0095000 在 PANProj4 的 GPU 0–3 上完成 48 个编辑候选（24 个任务，每个任务两个种子 42 / 137，50 steps、CFG 4）。逐一对照源图和完整指令审阅，再对入选结果作原尺寸并排复核，新增 9 组：添加花盆、移除勺子、移除柠檬、梨替换为苹果、浅蓝背景、雪山背景、水彩风格、提取皮包、庭院蓝调傍晚。连同原有 4 组，编辑区共 13 组；原有滑动对比交互保留。文生图 gallery 的 39 张未改动。

组合类候选存在物体遗漏、主体比例变化或水杯内容不明确，本批不展示；其他未入选结果包括残留勺头、杯把断裂、材质改变时铆钉丢失、非预期签名等。该筛选是目视展示审核，不是基准测试分数，也不宣称逐像素不变或零缺陷。

完整原图、输出和推理清单位于 `/Users/jianchengpan/Downloads/UniSpark-CT0095000-edit48-20261026/`，远端同批次为 `inference-results/imgedit-ct95000-diverse48-20261026/`。48 个候选的决定、原因、指令、种子和哈希见 `scripts/editing-diverse48-quality-review.json`；入选样本映射追加在 `scripts/editing-provenance.json` 的 `additional_batches` 中。网页图片为完整原尺寸 JPEG（quality 94，4:4:4），未裁剪、变形、拼接或修图。

## Cartoon 类别（2026-10-26）

“From words to visual worlds” 新增第六类 `Cartoon`：动漫头像、黑白漫画、彩色漫画、二维卡通场景与动物、三维机器人及黏土兔，共 7 张；文生图总计 46 张。原有 39 张与编辑区 13 组保持不变，类别数量由页面数据自动计算，All images 的 Show more 继续生效。

本次沿用 CT0095000、PANProj4 GPU 0–3、50 steps、CFG 4，分两批推理 24 + 12 = 36 个候选。所有候选先对照指令逐一审阅，入选 7 张再作原尺寸复核。分格漫画出现角色、物体或动作不连续，没有展示；尾巴断开、异常肢体连接、非预期文字等结果也未采用。这是目视展示筛选，不是基准测试，也不宣称零缺陷。

完整指令、种子、检查理由、原始与网页文件哈希见 `scripts/gallery-cartoon-quality-review.json`；来源已并入 `scripts/gallery-provenance.json` 和 `scripts/asset-map.json`。原始结果保存在 Downloads 的 `UniSpark-CT0095000-cartoon24-20261026/` 与 `UniSpark-CT0095000-cartoon12b-20261026/`。网页导出保持原分辨率，JPEG quality 94、4:4:4，无裁剪、变形、修图或拼接。

## 日式动画角色扩充（2026-10-26）

使用 CT0095000 在 PANProj4 的 GPU 0–3 推理 12 个原创日式动画/漫画角色设定，每个设定两个种子（73、219），共 24 张候选。采样 50 steps、CFG 4。全部候选完成逐项审阅，入选结果进一步以原始分辨率检查五官、肢体连接、服饰、道具和画面可读性。新增 6 张：Letters above the clouds、The forest apothecary、A pocketful of constellations、The little lantern keeper、The midnight investigator、Beyond the coral window。Cartoon 当前 13 张，图库合计 52 张；原有 46 张和编辑区 13 组均保留。新角色排在 Cartoon 类别前部。

完整指令、种子、逐图决策和哈希见 `scripts/gallery-anime-characters-quality-review.json`。原始结果保存于 `/Users/jianchengpan/Downloads/UniSpark-CT0095000-anime24-20261026/`，远端同批次为 `inference-results/gallery-t2i-ct95000-anime24-20261026/`。网页仅作完整原分辨率 JPEG 转换，quality 94、4:4:4，没有裁剪、修图、变形或拼接。审核为目视展示筛选，不是基准测试，也不保证零缺陷。
