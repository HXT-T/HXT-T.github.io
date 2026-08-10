# HXT / yuyuyuu 个人网站设计方向提案

> 版本：2026-08-10 · 阶段：研究、方向与首页概念 · 本阶段不进入完整开发

## 0. 结论先行

建议采用 **Rose Index / 樱色刊物** 作为主视觉方向，再把 **Living Margins / 生长页边** 的知识关系放进内容内页。**Night Bloom / 夜樱档案** 不作为全站默认风格，而用于 AI Lab、实验项目或未来深色模式。

这不是放弃现有粉色，而是让粉色从“甜美背景”升级为品牌的编辑墨色：用于编号、细线、链接、状态和少数关键动作，约占单屏视觉面积的 10–15%。大面积背景转为暖纸白、深墨色和真实图像，粉色因而更有力量。

一句话定义：

> 一份持续出版的个人刊物，也是一座能看见思考如何生长的数字花园。

建议配方：

- 70% Editorial：版式、节奏、作者身份和精选内容
- 20% Digital Garden：主题、反链、更新状态和长期档案
- 10% Experimental Web：只在关键交互中出现的惊喜

## 1. 现有网站审视

### 值得保留

- 粉色与樱花已经形成记忆点，不应换成泛化的黑白作品集。
- 猫咪标志、温柔语气、阅读与旅行内容让网站有“人”，不是简历页。
- Blog、Moments、Books、Travel 已经给出长期内容的雏形。
- 轻微动效、宋体标题和柔软影像适合继续发展为个人出版物。

### 需要转向

- 当前首页更像一个带搜索框的粉色导航页，缺少“我是谁、我在做什么、最近在想什么”的连续叙事。
- 大面积粉雾、渐变字、圆角胶囊与樱花装饰共同放大了甜感，削弱了成熟度与内容重量。
- 内容入口很多，但真实文章和项目较少；首页应先精选真实内容，而不是承诺大量空分类。
- 随机名言占据作者本人本该出现的位置。核心首屏应改为固定自述，随机句子可降级为小型趣味功能。
- About 弹窗、隐藏当前页导航和旅行页独立导航让整体不像同一本“刊物”。下一阶段应统一为一套全站壳层。

### 视觉转译原则

| 当前语言 | 新语言 |
|---|---|
| 甜粉渐变铺满 | 暖纸白 / 深墨为底，樱桃粉作编辑标记 |
| 大圆角胶囊 | 0–6px 小圆角、细分隔线、平面版式 |
| 朦胧花枝作主角 | 真实人物、工作过程、项目局部和生活碎片 |
| 随机名言首屏 | 固定个人宣言 + 当期状态 |
| 分类导航大厅 | 作品、写作、Now 共同构成的当期索引 |
| 装饰性入场动画 | 链接预览、项目图像 reveal、阅读路径等功能性动效 |

## 2. 参考站点与情绪板研究

研究不是找一套页面直接模仿，而是拆出四类可复用原则：**作者身份、出版物节奏、知识关系、实验尺度**。以下 26 个站点均在 2026-08-10 核验。

### 2.1 Editorial / Personal Publication

| 站点 | 观察 | 本项目借什么 | 不借什么 |
|---|---|---|---|
| [Sania Saleh](https://www.sania.io/) | 巨型 Serif 宣言、极小导航与杂志封面式首屏，随后进入 Projects / Essays / Talks | “封面—栏目—作品”的清晰层级；大字号与白场 | 首屏留白不能多到信息过薄 |
| [Angello Torres](https://angellotorres.com/) | 实验 Display 字、编号、标签与非对称画廊形成独立刊物感 | 灰粉 / 酒红 / 墨色的局部张力；符号编号 | 约削去 30–40% 的装饰和信息噪声 |
| [Mindy Seu](https://mindyseu.com/) | 单页持续更新，项目、写作、图像、引用与版本历史共同存在 | 更新时间、版本意识、引用和长内容模块 | 不把所有内容和 CV 都塞进首页 |
| [Laurel Schwulst](https://laurelschwulst.com/home/) | 暖纸白、朴素屏幕字体与 writing / websites / worlds / today 分类 | Today、跨内容关联和有作者感的 taxonomy | 不复制完全随机、没有主次的列表 |
| [Miranda July](https://mirandajuly.com/) | 日期像书脊，书、电影、展览、图像与文字组成个人年鉴 | 跨媒介归档和倒序时间线 | 避免没有搜索的无限长卷 |
| [Martine Syms](https://www.martinesy.ms/) | Now Playing / On View / Books 让正在发生的事直接成为首页内容 | 用“当下栏目”代替静态履历 | 不在首屏堆叠自动播放媒体 |
| [Eric Hu](https://erichu.info/) | 超大黑白字与严格网格，项目图提供瞬时色彩 | 强宣言、少导航、严格版式骨架 | 品牌粉与项目图颜色不能互相争夺 |
| [Tracy Ma](https://www.tracyma.com/) | 年份、职责、过程注释与媒体构成长篇编辑流 | Role / Year / Process note 的作者口吻 | 避免过长页面和媒体堆叠 |
| [Frank Chimero](https://frankchimero.com/) | 首页入口极少，文章归档长期连续，像一本有目录的个人出版物 | 克制入口和真正耐久的 Archive | 不简化到失去个人视觉识别 |

这一组的核心启发：**首页不是作品卡片集合，而是一期由作者编辑的出版物。** 其中 [Typewolf 的设计师个人站年度集合](https://www.typewolf.com/portfolio-sites) 也反复出现“Display Serif + 克制 Sans / Mono”的组合，可作为字体气质校准，而不是作为模板库。

### 2.2 Digital Garden / Long-lived Knowledge

| 站点 | 观察 | 本项目借什么 | 不借什么 |
|---|---|---|---|
| [Maggie Appleton](https://maggieappleton.com/garden) | Garden、Essays、Notes、Patterns、Library、Now 共存；内容有 Seedling / Budding / Evergreen 成熟度 | 成熟度、最后照料时间、Topic 过滤；温暖编辑气质 | 园艺隐喻只用一次，不铺满全部文案 |
| [Andy Matuschak’s Working Notes](https://notes.andymatuschak.org/) | 内链点击后横向堆叠笔记，保留阅读路径，底部有 backlinks | 桌面 stacked notes + 上下文反链；手机退化为单页与 breadcrumb | 不取消全站导航，不让新访客迷路 |
| [Gwern](https://gwern.net/) | Newest / Popular / Notable 与大型主题索引并存，注释、引用、反链和 hover preview 非常完整 | 先摘要、按需展开证据；相关内容显示上下文片段 | 控制元数据和浮层数量，移动端必须减负 |
| [Steph Ango](https://stephango.com/) | Latest / Topics / 年月档案；永久导航很少，写作壳层稳定 | 克制导航、Topics + Now + Archive | 不照搬纯深色与过度无装饰 |
| [Simon Willison](https://simonwillison.net/) | Entries、Links、Quotes、Notes、Guides 等多内容形态统一进一个长期知识流 | Content type + Topic + Year 三种正交索引 | 全量内容进入 Archive，首页不做 firehose |
| [Tom Critchlow](https://tomcritchlow.com/) | Library 是一等公民，书、音乐、引文和外链都有来源与标签 | 把 Library 与 Essays 分开，保留引用来源 | 外链聚合不能淹没作者自己的思想 |
| [Derek Sivers](https://sive.rs/) | 十秒介绍、Now、文章、项目、Book Notes、Search、Random、Feeds 极其耐久 | /now、书库、短 URL、Random 与 Feed | 借结构，不借过于朴素的外观 |
| [Julia Evans](https://jvns.ca/) | Recent + Popular + Topic archive 三层入口，漫画是知识媒介而非装饰 | 最近、常青、主题三种阅读起点；图解可成为个人形式 | 多年完整档案不直接铺在首页 |

这一组的核心启发：**数字花园不是“粉色 Notion”，而是能看见内容状态、关系和更新时间的阅读系统。**

### 2.3 Dark Minimal / Experimental Personal Sites

| 站点 | 观察 | 本项目借什么 | 不借什么 / 移动风险 |
|---|---|---|---|
| [Rauno Freiberg](https://rauno.me/) | 暗色极简，身份、少量入口和短宣言替代履历堆砌；反馈集中在可点击处 | 短宣言、局部预览、精确状态反馈 | 不用过低对比和圈内化术语 |
| [Pedro Duarte](https://ped.ro/) | 长段自述即首页，正文中的词本身可触发 reveal | 把个人文字变成界面 | 行内按钮在触屏上必须可发现，独白不能过长 |
| [Olivier Larose](https://www.olivierlarose.com/) | Project / Category / Client / Year 数据表式目录，悬停才露出媒体 | 作品索引、编号与延迟出现的图像 | 多列元数据在小屏需折为两层 |
| [Dennis Snellenberg](https://dennissnellenberg.com/) | 中性人像、大姓名、近期作品与深色联系区形成三段节奏 | 人像 / 大字 / 项目三层节奏 | 不复制已被大量模仿的版式；cursor 效果不是核心 |
| [Richard Ekwonye](https://www.richardekwonye.com/) | 双尺度字体、少量项目与字形拖影，实验但仍可读 | 只在一个章节使用实验排字 | 移动端提供静态版本，不让重复巨字拉长页面 |
| [Aristide Benoist](https://aristidebenoist.com/) | 项目索引、窄条影像、覆盖式 About 和历代 folio 档案 | 黑白底、编号和一个电影式转场 | 不把拖拽 / WebGL 作为唯一导航 |
| [Fons Mans](https://fonsmans.com/) | 一张低调人像、极短身份句与联系入口完成个人感 | 暗调肖像和“个人而非职业简历”的克制 | 过度精简会让 Garden / Writing 消失 |
| [Jackie Zhang](https://jackiezhang.co.za/) | 巨型角色字、三条设计信念、作品与生活拼贴 | “三条我相信的事”和个人照片章节 | 控制响应式重复内容和页面重量 |
| [Emil Kowalski](https://emilkowal.ski/) | Projects / Writing / Newsletter 是高质量个人索引；动效预算极克制 | 信息层级和“只在必要处动” | 需要加入人物与品牌色，避免工具博客感 |

这一组的核心启发：实验感不来自满屏技术效果，而来自 **一个有主张的字形动作、一次图像 reveal、一个保留上下文的阅读行为**。关于动效克制，可参考 [Codrops 对 Stefan Vitasovic 2025 作品集的案例分析](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/)，但本项目不采用重 WebGL 的实现路线。

## 3. 信息架构

### 3.1 一级结构

```text
/
├─ /work                 精选作品与案例
│  ├─ /work/kimipet      桌面 AI 宠物 / 记忆 / 专注与提醒
│  ├─ /work/personal-internet 个人刊物与数字花园的持续建设
│  ├─ /work/second-brain 第二大脑 / 知识迁移与自动化
│  └─ /work/experiments  小型实验、原型和未完成想法
│
├─ /garden               公开思考与关系式阅读
│  ├─ /garden/essays     完整文章
│  ├─ /garden/notes      可持续修订的短笔记
│  ├─ /garden/ideas      尚未长成文章的想法
│  └─ /topics/:slug      哲学、AI、技术、旅行、摄影……
│
├─ /library              书、文章、引用与参考资料
├─ /now                  正在做 / 读 / 想 / 听
├─ /archive              时间 × 类型 × 主题的全量索引
├─ /about                自述、时间线、使用的工具、联系与 Colophon
└─ /companion            未来 AI Assistant / Companion 入口；当前只预留
```

### 3.2 当前内容迁移

| 当前入口 | 新位置 | 处理 |
|---|---|---|
| Blog | Garden / Essays | 文章成为主内容类型，不再与“花园”竞争 |
| Moments | Now + Garden / Notes | 当下状态放 Now；可沉淀的短记进入 Notes |
| Books | Library | 增加评分、阅读日期、短评与关联笔记 |
| Travel | Topic / Travel + Story | 旅行不是孤立频道，而是照片、文章和地点组成的主题 |
| About 弹窗 | About 页面 + 首页短自述 | 提供稳定 URL、可访问性和更完整叙事 |
| 哲学 / 技术 / 阅读等分类 | Topics | 仅展示有真实内容的主题，并显示数量 |

### 3.3 内容模型

每一条内容至少包含：

- `type`：essay / note / idea / project / book / link
- `title`、`summary`、`publishedAt`、`updatedAt`
- `topics[]`：跨类型主题
- `status`：seed / growing / evergreen / archived
- `related[]`：作者策展的相关推荐
- `backlinks[]`：自动生成的反向引用
- 可选 `cover`、`location`、`readingTime`、`role`、`year`

关键不是把元数据全显示出来，而是按场景选择：列表只给日期、类型、主题；文章页再给更新时间、成熟度和关系。

### 3.4 全局导航与发现

- 桌面：Index / Work / Garden / Library / Now / About，当前页始终保留并用 `aria-current` 标识。
- 移动：紧凑品牌栏 + 菜单面板；不再让分类挤成 3 行固定顶栏。
- 搜索：作为次级全局能力，可用 `/` 或 `⌘K` 唤起；首页首要动作是“读最新文章”与“看精选作品”。
- Archive：支持 Type、Topic、Year 三个维度，结果数实时播报。
- Garden：桌面可采用 stacked notes；触屏回退为常规前进 / 返回与 breadcrumb，不依赖 hover。

## 4. 视觉语言定义

### 品牌母题：编辑标记，而不是樱花贴纸

粉色的来源仍然是樱花，但表达从花瓣、雾化渐变和可爱装饰，转为印刷中的批注、校样线、页码、铅字套色和书脊。猫咪标志保留为页脚签章或 favicon，不再与每个栏目争抢注意力。

### 图像

- 人物：一张克制、自然光、非职业棚拍的人像；可裁切、灰阶或低饱和，不做大面积粉色滤镜。
- 作品：界面之外同时展示草稿、流程、屏幕边缘、纸上笔记和生活环境，让项目具有作者的身体感。
- 生活：读书折角、夜晚桌面、路途、食物、窗外和相机残片，按主题进入内容，不做无意义素材图库。
- 图像比例形成编辑节奏：3:4 肖像、4:3 项目、16:9 过程、1:1 小型注释；避免所有卡片同一比例。

### 版式

- 1440px 桌面使用 12 栏；内容最大宽度约 1360px，外边距 48–72px。
- 768–1199px 使用 6 栏；320–767px 使用 4 栏和 16–20px 外边距。
- 不以卡片为默认容器。分隔优先使用留白、基线、细线和编号。
- Display 标题允许占 5–8 栏，正文阅读列控制在约 62–72 个拉丁字符或 28–34 个汉字。
- 长页形成“封面—目录—章节—页脚”的节奏，每个章节之间保留 96–160px 呼吸。

### 语气

- 主句短、具体、有作者：`我在这里写作、做东西，也记录尚未长成答案的念头。`
- 不使用“探索无限可能”“热爱创造”“欢迎来到我的数字世界”等模板化表达。
- 中英文不是重复翻译：中文负责感受和思考，英文更多承担栏目、元信息和版本标记。

## 5. 三个视觉方向

### A. Rose Index / 樱色刊物 — 推荐

**概念**：每次访问像翻开个人刊物的新一期。首页是当期封面与索引，内容页是文章、作品和注释，Archive 是历年合订本。

**视觉配方**

- 底色：Warm Paper `#F8F4F1`
- 正文：Ink `#211B1D`
- 次级：Muted Ink `#74676C`
- 主粉：Sakura Ink `#C9346C`
- 柔粉：Blush Paper `#EAD0D9`
- 深粉：Deep Plum `#4A172B`
- 中文标题 / 长文：Noto Serif SC 或思源宋体
- 英文 Display：Newsreader / Instrument Serif
- UI / 元信息：Inter Tight + IBM Plex Mono
- 12 栏非对称编辑网格；0–4px 圆角；几乎无阴影
- 一张人物图作为首期封面，项目图低饱和，粉色只作套色

**首屏**

- 左上：`yuyuyuu / hxt` 小型刊头
- 中部：超大姓名或自定义字标；不使用渐变字
- 下部：一句固定自述、角色与地点 / 年份
- 右侧：人物或工作现场竖幅裁切
- 右上：`ISSUE 01 · CN/EN · 2026`

**动效**

- 首屏文字默认可见；仅做 12px、480ms 的增强 reveal。
- 作品行 hover / focus 时，图像在相邻栏中出现，链接箭头移动 4px。
- 页面转场像翻到下一页：颜色与基线连续，不做整屏飞入。
- `prefers-reduced-motion` 下完全取消位移。

**参考组合**

- [Sania Saleh](https://www.sania.io/)：封面和栏目骨架
- [Angello Torres](https://angellotorres.com/)：局部出版物张力
- [Mindy Seu](https://mindyseu.com/)：持续出版与版本
- [Laurel Schwulst](https://laurelschwulst.com/home/)：跨内容连接
- [Miranda July](https://mirandajuly.com/)：个人年鉴

**优点**

- 最能同时承载个人品牌、项目、写作与生活。
- 保留粉色识别，同时显著提高成熟度和长期耐看度。
- 内容较少时仍可通过编辑选择显得完整，内容增长后也有扩展空间。

**风险**

- 对真实文案和真实图像要求高；占位内容会迅速暴露。
- 若大字号、留白和 Serif 使用失控，会只剩“漂亮杂志”而缺少效率。

### B. Night Bloom / 夜樱档案

**概念**：一间安静的夜间档案室，专门保存 AI Companion、系统实验与未完成研究。不是赛博空间，而是深色纸张上的一束玫瑰墨。

**视觉配方**

- 底色：Night Ink `#151113`
- 正文：Bone `#F4EDE8`
- 次级：Dust `#B5A7AC`
- 交互：Berry Light `#E25088`
- 深层：Plum `#4A172B`
- 低饱和暗调人像，大块黑场，图像在交互时显色
- 字体以 Inter Tight / IBM Plex Mono 为骨架，仅保留一组大 Serif 宣言

**动效**

- 短宣言中的少数词触发项目预览。
- 项目目录使用 Project / Type / Year 的表格式结构。
- 仅保留一个电影式页面转场；不用常驻粒子、霓虹发光或 WebGL 导航。

**参考组合**

- [Fons Mans](https://fonsmans.com/)：暗调人像与人格克制
- [Rauno Freiberg](https://rauno.me/)：排版和精确反馈
- [Richard Ekwonye](https://www.richardekwonye.com/)：一个实验字形段落
- [Olivier Larose](https://www.olivierlarose.com/)：目录式作品索引
- [Aristide Benoist](https://aristidebenoist.com/)：编号与电影式转场

**优点**

- AI Companion 和实验项目会更有神秘感与技术张力。
- 视觉记忆强，适合短页面、项目启动页与夜间模式。

**风险**

- 大量中文长文在暗底上阅读更累。
- 暗色作品集已经非常常见，若人物与文案不强，反而更模板化。
- 不适合作为书架、旅行和日常记录的唯一语境。

### C. Living Margins / 生长页边

**概念**：页面像一叠持续被批注的纸。正文、旁注、反链和更新时间共同说明“这个想法如何长成”。粉色是一支荧光笔，而不是背景。

**视觉配方**

- 底色：Pulp `#F4EEE9`
- 正文：Pencil Ink `#292021`
- 链接：Annotation Rose `#8B3C5B`
- 状态：Blush `#E9CAD5`
- 辅助：Moss `#65705B`
- Serif 正文 + Sans 导航 + Mono 元数据；正文行长严格控制
- 左侧主题 / 正文 / 右侧 backlinks 的 2–7–3 栏关系，仅桌面启用

**核心交互**

- `Seed / Growing / Evergreen` 显示内容成熟度和最后照料日期。
- 内链点击后在右侧堆叠下一张 note，保留阅读路径。
- Backlinks 不只列标题，提供包含该链接的一句上下文。
- Topic 页同时显示 Recent / Evergreen / Related Projects。

**参考组合**

- [Maggie Appleton](https://maggieappleton.com/garden)：整体气质、成熟度与 IA
- [Andy Matuschak’s Working Notes](https://notes.andymatuschak.org/)：stacked notes 与阅读路径
- [Steph Ango](https://stephango.com/)：Topics / Now / Archive 的克制壳层
- [Derek Sivers](https://sive.rs/)：耐久档案、书库和 Random
- [Julia Evans](https://jvns.ca/)：Recent / Evergreen / Topic 三层入口

**优点**

- 最能表现“思考过程”，与第二大脑项目形成内容和产品的统一。
- 长期价值高，内容之间的关系会随时间增厚。

**风险**

- 首页直接使用会显得像知识管理工具，削弱人物与作品。
- 状态、标签和反链若同时出现，移动端会变得很拥挤。
- 需要稳定写作与引用习惯，系统价值才会逐渐显现。

## 6. 推荐决策

选择 **A 作为品牌外壳，C 作为内容机制，B 作为局部语境**。

```text
Rose Index / 全站默认
├─ 首页、Work、About：编辑式、明亮、人物与作品优先
├─ Garden、Library：接入 Living Margins 的成熟度、反链和关系式阅读
└─ AI Lab / 实验项目：可进入 Night Bloom 的深色章节，但导航与字体体系保持一致
```

为什么不只选一个：网站的核心不是单一作品集，也不是单一知识库。A 负责让陌生访客在 30 秒内认识“这个人”；C 负责让老读者在几年后仍能进入她的思考；B 负责给未来 AI Companion 一个有辨识度但不吞噬全站的舞台。

## 7. 首页线框图

### 7.1 桌面内容顺序（1440px）

```text
┌──────────────────────────────────────────────────────────────────────┐
│ yuyuyuu / hxt       Index Work Garden Library Now About  ISSUE 01   │
├───────────────────────────────────────────────┬──────────────────────┤
│ PERSONAL INTERNET                             │                      │
│                                               │   人物 / 工作现场     │
│ YUYU                                          │   3:4 竖幅裁切        │
│ YUU                                           │                      │
│                                               │                      │
│ 固定自述                        角色 / 地点 / 年 │                      │
├───────────────────────────────────────────────┴──────────────────────┤
│ 01  SELECTED WORKS                                                   │
│     KimiPet              AI Companion · Desktop                 ↗   │
│     Second Brain         Knowledge System · Tooling             ↗   │
│     Personal Internet    Editorial Web · Tending                ↗   │
├──────────────────────────────────────┬───────────────────────────────┤
│ 02  RECENT THOUGHTS                  │ 03  NOW                       │
│ 日期 / 文章标题 / 主题                │ Building / Reading            │
│ 日期 / 笔记标题 / 成熟度              │ Thinking / Listening           │
├──────────────────────────────────────┴───────────────────────────────┤
│ 04  GARDEN INDEX                                                     │
│ AI / Philosophy / Reading / Travel / Photography + recently tended │
├──────────────────────────────────────────────────────────────────────┤
│ Archive · About · GitHub · Email · RSS              [cat seal]       │
└──────────────────────────────────────────────────────────────────────┘
```

### 7.2 移动内容顺序（390px）

```text
品牌栏 / Menu
→ 刊号与固定自述
→ 超大字标
→ 竖幅人物图
→ 3 个精选作品
→ 3 条最近写作
→ Now 四项
→ Garden 主题与最近照料
→ Archive / About / Contact
```

移动端不做横向堆叠笔记、不依赖 hover、不让大字被裁切，也不使用超过一行的固定顶栏。触控目标至少 44px，关键内容不依赖动画完成后才出现。

## 8. 首页视觉布局草图

### 首屏比例

- Header：约 72–80px，不浮在内容上方。
- Hero：桌面约 65–78vh，但不锁死视口高度；文字占 8 栏，图像占 4 栏。
- 大字标：`clamp(72px, 10vw, 152px)`，行高 0.82–0.9。
- 固定自述：20–24px Serif，最多两行；元信息 11–12px Mono。
- 下一章节在首屏底部露出标题或细线，暗示页面可继续阅读。

### 页面节奏

1. **封面**：人、声音和当期状态。
2. **作品目录**：先建立“我做什么”。
3. **最近思考**：再建立“我如何想”。
4. **Now**：提供可更新的当下感。
5. **Garden Index**：邀请深入关系与档案。
6. **Colophon**：承认这是一座由本人持续维护的网站。

### 首屏文案草案

刊头：`PERSONAL INTERNET · ISSUE 01`

主句：

> 我在这里写作、做东西，也记录那些尚未长成答案的念头。

角色元信息：

`AI COMPANION DESIGNER / WRITER / GARDENER · SHANGHAI · 2026`

第一动作：`读最近一篇文章 →`

第二动作：`查看精选作品 ↗`

## 9. Design System Draft v0.1

### 9.1 颜色

| Token | 值 | 用途 |
|---|---:|---|
| `--paper` | `#F8F4F1` | 默认明亮背景 |
| `--ink` | `#211B1D` | 标题、正文、主边框 |
| `--muted` | `#74676C` | 次级文字，禁止再降透明度 |
| `--line` | `#D8CCC9` | 分隔线、表格基线 |
| `--rose` | `#C9346C` | 链接、编号、焦点、重要状态 |
| `--blush` | `#EAD0D9` | 小面积底色、选中区 |
| `--plum` | `#4A172B` | 深色章节、强调背景 |
| `--night` | `#151113` | Night Bloom 底色 |
| `--bone` | `#F4EDE8` | 深色模式正文 |

规则：长正文不使用粉色；`--rose` 在暖纸白上用于 16px 以上链接或加下划线，小字号状态则使用 `--plum`。任何叠图文字必须经过实际对比度检查，不用纯透明白猜测可读性。

### 9.2 字体与字号

| 角色 | 建议字体 | 桌面 | 移动 |
|---|---|---:|---:|
| Display / Wordmark | Newsreader / Instrument Serif + Noto Serif SC | 96–152px | 52–78px |
| H1 | Noto Serif SC | 64–88px | 40–52px |
| H2 | Noto Serif SC | 36–52px | 30–38px |
| Lead | Noto Serif SC | 20–24px | 18–21px |
| Body | Noto Serif SC 或 Noto Sans SC | 17–19px | 16–18px |
| UI | Inter Tight / Noto Sans SC | 13–15px | 14–16px |
| Metadata | IBM Plex Mono | 10–12px | 11–12px |

中文正文行高 1.75–1.9，UI 行高 1.4–1.6。最多使用三个字体家族；加载失败时要有系统字体回退，生产阶段优先自托管所需字重。

### 9.3 间距、边框、容器

- 基础单位：4px；常用间距：8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160。
- 页面最大宽度：1440px；阅读正文最大宽度：760px。
- 边框：1px；Hover 可加深，不增加厚重阴影。
- 圆角：链接和文本为 0；图像 0–4px；可交互控件 2–6px；只在未来 Companion 气泡使用更大圆角。
- 阴影：默认无；浮层可用 `0 20px 60px rgba(33,27,29,.14)`。

### 9.4 状态与交互

- 所有链接、按钮、筛选器都有统一 `:focus-visible`，焦点环使用 3px 半透明 `--rose`。
- 内容筛选按钮用 `aria-pressed`；结果数用 `aria-live="polite"`。
- Modal 优先原生 `<dialog>`，打开时背景 inert，关闭后焦点回触发器。
- 链接 hover 只做下划线、箭头位移或图像 reveal 三种之一。
- 动效时长：micro 160–240ms，section 360–600ms；统一 `cubic-bezier(.22,1,.36,1)`。
- 支持 `prefers-reduced-motion`；禁止让核心文字初始 `opacity: 0`。

### 9.5 编辑组件

- `Masthead`：刊头、刊号、语言、日期。
- `Manifesto`：一句固定自述，不随机改变首屏高度。
- `WorkIndexRow`：编号、名称、类型、年份、预览图。
- `ThoughtListItem`：日期、标题、内容类型、主题、成熟度。
- `NowGrid`：Building / Reading / Thinking / Listening。
- `GardenStatus`：Seed / Growing / Evergreen + last tended。
- `BacklinkContext`：来源标题 + 引用上下文，而非裸链接。
- `Colophon`：技术栈、更新方式、字体、RSS、最后构建时间。

## 10. 后续设计顺序（待确认方向后）

本轮只确认研究与设计方向，不改生产页面。确认后建议按以下顺序进入设计：

1. 写定首页自述、3 个真实作品摘要与 3 条最近内容。
2. 准备一张人物图、每个项目 2–4 张真实过程图。
3. 在 1440 / 768 / 390 三个宽度完成首页高保真稿。
4. 设计 Work case study 与 Garden article 两种核心内页。
5. 原型验证导航、链接预览、stacked notes 和移动降级。
6. 再进入 React 组件、内容模型与迁移实施。

完成标准不是“页面都做了”，而是从首页可以沿着一条真实叙事链走通：**认识你 → 看一个作品 → 读一个想法 → 进入相关笔记 → 看见你现在正在做什么。**
