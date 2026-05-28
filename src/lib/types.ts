export interface AuditResult {
  url: string;
  timestamp: Date;
  overallScore: number;
  categories: {
    aiVisibility: CategoryScore;
    technical: CategoryScore;
    content: CategoryScore;
    schema: CategoryScore;
    platforms: CategoryScore;
  };
  details: AuditDetails;
}

export interface CategoryScore {
  score: number;
  label: string;
  items: ScoreItem[];
}

export interface ScoreItem {
  name: string;
  status: 'pass' | 'warning' | 'fail' | 'info';
  description: string;
  details?: string;
}

export interface AuditDetails {
  citability: CitabilityScore;
  crawlers: CrawlerCheck;
  llmsTxt: LlmsTxtCheck;
  brandMentions: BrandMention[];
  schema: SchemaCheck;
  technical: TechnicalCheck;
  content: ContentCheck;
}

export interface CitabilityScore {
  score: number;
  factors: {
    dataPoints: number;
    citations: number;
    expertise: number;
    structure: number;
  };
}

export interface CrawlerCheck {
  robotsTxt: boolean;
  aiCrawlersAllowed: boolean;
  issues: string[];
}

export interface LlmsTxtCheck {
  exists: boolean;
  valid: boolean;
  content?: string;
}

export interface BrandMention {
  platform: string;
  count: number;
  authority: number;
}

export interface SchemaCheck {
  hasSchema: boolean;
  types: string[];
  valid: boolean;
  recommendations: string[];
}

export interface TechnicalCheck {
  pageSpeed: number;
  mobileFriendly: boolean;
  ssl: boolean;
  issues: string[];
}

export interface ContentCheck {
  wordCount: number;
  readability: number;
  eeat: number;
  keywordDensity: Record<string, number>;
  contentStructure: {
    hasIntro: boolean;
    hasConclusion: boolean;
    sectionCount: number;
  };
  readabilityMetrics: {
    fleschKincaid: number;
    averageSentenceLength: number;
    averageWordLength: number;
    passiveVoicePercentage: number;
  };
  contentQuality: {
    originality: number;
    depth: number;
    utility: number;
  };
  recommendations: string[];
  actionableTips: {
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    steps: string[];
  }[];
}

// 广告策略相关类型
export interface AdFormData {
  ad_topic: string;
  ad_goal: string;
  ad_plan: string;
  brand_info: {
    name: string;
    positioning: string;
    target_audience: string;
  };
  budget: number;
  platforms: string[];
}

export interface TargetAudience {
  region: string;
  gender: string;
  age: string;
  age_range?: Record<string, boolean>;
  interests: string[];
  network: string;
  network_type?: Record<string, boolean>;
  platform: string;
  custom_audience?: string;
}

export interface AdStrategy {
  creative_form: string;
  delivery_method: string;
  heating_target: string;
  delivery_time: string;
  delivery_period: string;
  daily_budget: string;
  custom_budget?: number;
  start_date?: string;
  end_date?: string;
  time_grid?: boolean[][];
  target_audience: TargetAudience;
}

export interface Competitor {
  name: string;
  budget_level: '高' | '中' | '低';
  creative_style: string;
  positioning: string;
  target_audience: string;
  ad_strategy: string;
  advantages: string[];
  disadvantages: string[];
}

export interface StrategyComparison {
  score: number;
  suggestion: string;
}

export interface AnalysisResult {
  overall_score: number;
  summary: string;
  competitor_insight: string;
  competitors: Competitor[];
  comparison: Record<string, StrategyComparison>;
}

export interface StrategyHistory {
  id: string;
  created_at: string;
  ad_topic: string;
  overall_score: number;
  status: 'draft' | 'analyzed' | 'exported';
}

export interface PlatformConfig {
  name: string;
  icon: string;
  supported: boolean;
  description: string;
}
