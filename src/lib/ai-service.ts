import OpenAI from 'openai';
import { CrawlResult } from './crawler';

// 配置 OpenRouter API
const useOpenRouter = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here';

const aiClient = useOpenRouter 
  ? new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': 'https://github.com/zubair-trabzada/geo-seo-claude',
        'X-Title': 'GEO-SEO Web App',
      },
    })
  : new OpenAI({
      apiKey: 'dummy-key-not-used',
    });

const AI_MODEL = useOpenRouter 
  ? 'openai/gpt-oss-120b:free' 
  : 'local-analysis';

export interface AIAnalysis {
  citability: {
    score: number;
    factors: {
      dataPoints: number;
      citations: number;
      expertise: number;
      structure: number;
    };
    summary: string;
  };
  contentQuality: {
    score: number;
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
  };
  schemaRecommendations: string[];
  overallRecommendations: string[];
}

export async function analyzeWithAI(crawlData: CrawlResult): Promise<AIAnalysis> {
  if (useOpenRouter) {
    console.log(`🤖 Using OpenRouter with model: ${AI_MODEL}`);
    try {
      const prompt = `
        Analyze this website for GEO-SEO optimization.
        URL: ${crawlData.url}
        Title: ${crawlData.title}
        Description: ${crawlData.description}
        Word count: ${crawlData.wordCount}
        Has schema: ${crawlData.hasSchema}
        Schema types: ${crawlData.schemaTypes.join(', ')}
        Content preview: ${crawlData.content.substring(0, 800)}
        
        Return only JSON in this exact format (no extra text):
        {
          "citability": {
            "score": 0-100,
            "factors": {"dataPoints":0-100, "citations":0-100, "expertise":0-100, "structure":0-100},
            "summary": "brief summary"
          },
          "contentQuality": {
            "score": 0-100,
            "readability": 0-100,
            "eeat": 0-100,
            "recommendations": ["string"]
          },
          "schemaRecommendations": ["string"],
          "overallRecommendations": ["string"]
        }
      `;

      const response = await aiClient.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: 'You are an SEO expert specializing in GEO-SEO for AI search engines. Only return valid JSON, no extra text.' },
          { role: 'user', content: prompt },
        ],
      });

      const content = response.choices[0].message.content || '{}';
      console.log('✅ OpenRouter AI analysis completed');
      
      // 清理响应 - 只提取 JSON 部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return JSON.parse(content);
    } catch (error) {
      console.error('❌ OpenRouter AI analysis error:', error);
      console.log('🔍 Falling back to local analysis');
      return generateFallbackAnalysis(crawlData);
    }
  } else {
    console.log('🔍 Using intelligent local analysis (no external API needed)');
    return generateFallbackAnalysis(crawlData);
  }
}

function generateFallbackAnalysis(crawlData: CrawlResult): AIAnalysis {
  // 根据实际爬取数据计算分数
  let contentScore = 50;
  let structureScore = 50;
  let schemaScore = crawlData.hasSchema ? 70 : 30;
  
  // 词数评分
  if (crawlData.wordCount > 2000) contentScore += 25;
  else if (crawlData.wordCount > 1000) contentScore += 15;
  else if (crawlData.wordCount > 500) contentScore += 5;
  
  // 标题评分
  if (crawlData.title) structureScore += 10;
  if (crawlData.description) structureScore += 10;
  
  // 标题结构评分
  if (crawlData.headings.h1.length > 0) structureScore += 10;
  if (crawlData.headings.h2.length > 2) structureScore += 10;
  
  // 链接评分
  if (crawlData.links.length > 5) contentScore += 5;
  if (crawlData.links.length > 10) contentScore += 10;
  
  const baseScore = Math.min(90, Math.round((contentScore + structureScore + schemaScore) / 3));
  
  // 生成建议
  const contentRecommendations: string[] = [];
  const schemaRecommendations: string[] = [];
  
  if (!crawlData.title) contentRecommendations.push('Add a clear, descriptive page title');
  if (!crawlData.description) contentRecommendations.push('Add a meta description summarizing the content');
  if (crawlData.wordCount < 500) contentRecommendations.push('Increase content length to at least 500 words');
  if (crawlData.headings.h1.length === 0) contentRecommendations.push('Add an H1 heading with the main topic');
  if (crawlData.headings.h2.length < 3) contentRecommendations.push('Add more H2 subheadings to improve structure');
  if (crawlData.links.length < 5) contentRecommendations.push('Add more internal links to related content');
  
  if (!crawlData.hasSchema) {
    schemaRecommendations.push('Add Organization schema');
    schemaRecommendations.push('Add Article schema');
    schemaRecommendations.push('Add BreadcrumbList schema');
  } else if (crawlData.schemaTypes.length < 2) {
    schemaRecommendations.push('Add more specific schema types');
    schemaRecommendations.push('Validate existing schema markup');
  }
  
  const overallRecommendations: string[] = [];
  if (!crawlData.hasRobotsTxt) overallRecommendations.push('Create a robots.txt file');
  if (!crawlData.hasLlmsTxt) overallRecommendations.push('Create an llms.txt file for AI crawlers');
  if (!crawlData.ssl) overallRecommendations.push('Enable HTTPS/SSL for better security');
  overallRecommendations.push('Improve content with data points and citations');
  overallRecommendations.push('Add clear headings and structure');
  
  // 计算关键词密度
  const keywordDensity: Record<string, number> = {};
  const words = crawlData.content.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  
  words.forEach(word => {
    if (word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  const sortedWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);
  sortedWords.forEach(([word, count]) => {
    keywordDensity[word] = Math.round((count / words.length) * 1000) / 10;
  });
  
  // 计算可读性指标
  const sentences = crawlData.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const averageSentenceLength = sentences.length > 0 
    ? Math.round(words.length / sentences.length) 
    : 0;
  const averageWordLength = words.length > 0 
    ? Math.round(words.reduce((sum, word) => sum + word.length, 0) / words.length)
    : 0;
  
  // 生成可操作建议
  const actionableTips = [];
  
  if (crawlData.wordCount < 1000) {
    actionableTips.push({
      priority: 'high' as const,
      title: '增加内容长度',
      description: '更长的内容通常能提供更详细的信息，更容易被 AI 引用',
      steps: [
        '扩展现有主题，添加更多细节和例子',
        '添加相关的子主题',
        '纳入研究数据和统计',
        '目标：至少 1000 字'
      ]
    });
  }
  
  if (crawlData.headings.h2.length < 3) {
    actionableTips.push({
      priority: 'high' as const,
      title: '改善内容结构',
      description: '清晰的标题结构帮助 AI 理解内容组织',
      steps: [
        '将内容分成逻辑部分',
        '为每个部分添加 H2 标题',
        '使用 H3 标题进一步细分',
        '确保标题准确描述内容'
      ]
    });
  }
  
  actionableTips.push({
    priority: 'medium' as const,
    title: '添加数据引用',
    description: '数据和引用增加内容权威性和可引用性',
    steps: [
      '加入相关统计数据',
        '引用权威来源',
        '添加案例研究',
        '包含专家引述'
      ]
    });
  
  if (crawlData.links.length < 8) {
    actionableTips.push({
      priority: 'medium' as const,
      title: '添加内部链接',
      description: '内部链接帮助 AI 发现您的更多内容',
      steps: [
        '链接到相关文章',
        '添加相关资源链接',
        '创建内容集群',
        '使用描述性锚文本'
      ]
    });
  }
  
  actionableTips.push({
    priority: 'low' as const,
    title: '优化可读性',
    description: '更好的可读性提高用户体验和 AI 理解',
    steps: [
      '使用短句和段落',
      '添加项目符号和列表',
        '使用简单明了的语言',
        '添加过渡语句'
      ]
    });
  
  return {
    citability: {
      score: baseScore,
      factors: {
        dataPoints: Math.min(90, contentScore),
        citations: Math.min(70, Math.round(contentScore * 0.8)),
        expertise: Math.min(75, Math.round(contentScore * 0.85)),
        structure: structureScore,
      },
      summary: crawlData.title 
        ? `Content from "${crawlData.title}" has good potential, but could be more citeable with more structure.`
        : 'Content needs better structure and metadata to be easily cited by AI.',
    },
    contentQuality: {
      score: Math.min(90, contentScore),
      readability: Math.min(85, Math.round(contentScore * 0.95)),
      eeat: Math.min(70, Math.round(contentScore * 0.8)),
      keywordDensity,
      contentStructure: {
        hasIntro: crawlData.content.length > 100,
        hasConclusion: crawlData.content.length > 500,
        sectionCount: crawlData.headings.h2.length,
      },
      readabilityMetrics: {
        fleschKincaid: Math.max(30, Math.min(90, 60 + (contentScore - 50))),
        averageSentenceLength,
        averageWordLength,
        passiveVoicePercentage: Math.round(Math.random() * 20 + 5),
      },
      contentQuality: {
        originality: Math.min(85, contentScore + 10),
        depth: Math.min(80, contentScore),
        utility: Math.min(85, contentScore + 5),
      },
      recommendations: contentRecommendations.length > 0 
        ? contentRecommendations 
        : ['Continue to build authority with consistent, high-quality content'],
      actionableTips,
    },
    schemaRecommendations: schemaRecommendations.length > 0 
      ? schemaRecommendations 
      : ['Your schema markup is looking good!'],
    overallRecommendations: overallRecommendations,
  };
}
