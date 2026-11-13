// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * tagColor 是飞书推送卡片里跟在标题后面的这一类小标签的颜色（飞书 text_tag 的颜色名）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "macro", tagColor: "orange", label: "宏观与政策", feedLabel: "宏观与政策", section: "宏观与政策", guide: "央行、财政、监管、国务院及地方政府的政策与公告；CPI、PMI、社融、非农、LPR 等宏观数据；美联储等海外央行的决议与沟通。跨资产的宏观事件归这里；只影响单一资产的具体消息归对应资产类别。" },
  { key: "ashare", tagColor: "red", label: "A股", feedLabel: "A股", section: "A股", guide: "A股行情与资金面异动、上市公司公告与经营事件、指数与板块的重大变化、交易制度变化。同时影响多个市场的消息归宏观与政策；主体是港股公司的消息归港股。" },
  { key: "hk", tagColor: "wathet", label: "港股", feedLabel: "港股", section: "港股", guide: "港股行情、南向资金、港股上市公司事件、港交所规则与香港市场政策。" },
  { key: "us", tagColor: "indigo", label: "美股", feedLabel: "美股", section: "美股", guide: "美股行情与个股重大事件、美国上市公司财报与资本运作、直接影响美股的美国政策。美联储的全局性决议归宏观与政策。" },
  { key: "overseas", tagColor: "violet", label: "海外其他", feedLabel: "海外其他", section: "海外其他", guide: "除港股美股外的海外市场与经济体：欧日央行与政府政策、新兴市场、重要经济体数据、国际组织与大宗商品组织动态。" },
  { key: "gold", tagColor: "yellow", label: "黄金", feedLabel: "黄金", section: "黄金", guide: "黄金及贵金属的价格、供给与需求：央行购金、金矿与消费、黄金 ETF 持仓，以及直接驱动金价的避险与实际利率事件。" },
  { key: "bond", tagColor: "blue", label: "债券", feedLabel: "债券", section: "债券", guide: "利率债与信用债市场、国债收益率与期限利差、信用事件与违约、可转债，以及货基、理财等固收产品的规则变化。" },
  { key: "industry", tagColor: "grey", label: "综合", feedLabel: "综合", section: "综合", guide: "跨多个市场、无法归入以上类别的综合消息：行业公司综合动态、市场综述、机构年度策略等。日报里没归上类的资料也放这一节。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; tagColor: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（AI 行业是新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = null;

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["a股", "港股", "美股", "央行", "美联储", "降准", "降息", "加息", "lpr", "mlf", "slf", "gdp", "cpi", "ppi", "pmi", "社融", "ipo", "etf", "qdii", "reits", "opec", "非农", "两融", "北向资金", "国债", "收益率"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["policy_regulation", "macro_data", "company_event", "market_move", "product_issuance", "opinion_research", "risk_event"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "政策/监管", "宏观数据", "公司公告", "公司经营", "行情/资金", "产品发行", "产品规则", "研报观点", "机构观点", "风险事件", "地缘政治", "行业动态", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "货币政策", "财政政策", "产业政策", "财报", "回购/增减持", "并购重组", "基金/ETF", "汇率", "大宗商品", "地缘冲突",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = ["中国人民银行", "国家统计局", "财政部", "证监会", "交易所", "美联储", "欧洲央行", "日本央行"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  政策: "政策/监管", 监管: "政策/监管", 法规: "政策/监管", 新规: "政策/监管", 央行: "货币政策", 降准: "货币政策", 降息: "货币政策", 加息: "货币政策",
  数据: "宏观数据", 宏观: "宏观数据", 公告: "公司公告", 财报: "财报", 业绩: "公司经营", 经营: "公司经营", 行情: "行情/资金", 资金: "行情/资金",
  发行: "产品发行", 新发: "产品发行", 基金: "基金/ETF", etf: "基金/ETF", 观点: "机构观点", 研报: "研报观点", 预测: "机构观点",
  违约: "风险事件", 暴雷: "风险事件", 风险: "风险事件", 制裁: "地缘政治", 地缘: "地缘政治", 战争: "地缘冲突", 冲突: "地缘冲突",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；orgNames 是这家公司发消息时开头用的组织名（公司、实验室、团队），
 * 在它自己的主题页上读者知道说的是谁，可以省去；otherNames 是公司的其他称呼（官方账号名、子品牌）。
 * 所有这些名字都用来认出说的是哪家公司，比如把事实的主体对到发布方。
 * 财经行业公司太多不逐个收录；只留几家系统重要性机构，其余靠标题原文自明。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; orgNames?: string[]; otherNames?: string[] }> = {
  pbc: { name: "中国人民银行", displayTag: "中国人民银行", aliases: ["中国人民银行", "央行", "人行", "PBOC"], orgNames: ["中国人民银行"] },
  fed: { name: "美联储", displayTag: "美联储", aliases: ["美联储", "Federal Reserve", "Fed"], orgNames: ["Board of Governors of the Federal Reserve System"] },
  csrc: { name: "中国证监会", displayTag: "中国证监会", aliases: ["中国证监会", "证监会", "CSRC"], orgNames: ["中国证券监督管理委员会"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。财经标题点名公司是常态，误伤风险高于收益，先关掉。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [];

/** 这些域名上的文章，发布方就是对应的公司（托管平台如 GitHub、arXiv 不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [];
