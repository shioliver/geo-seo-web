import { NextResponse } from 'next/server';
import { crawlWebsite } from '@/lib/crawler';
import { analyzeWithAI } from '@/lib/ai-service';
import type { AuditResult } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const crawlData = await crawlWebsite(url);
    const aiAnalysis = await analyzeWithAI(crawlData);

    const result: AuditResult = {
      url,
      timestamp: new Date(),
      overallScore: Math.round(
        (aiAnalysis.citability.score +
          aiAnalysis.contentQuality.score +
          (crawlData.hasSchema ? 75 : 40) +
          (crawlData.ssl ? 90 : 50)) / 4
      ),
      categories: {
        aiVisibility: {
          score: aiAnalysis.citability.score,
          label: 'AI 可见性',
          items: [
            {
              name: '可引用性评分',
              status: aiAnalysis.citability.score >= 80 ? 'pass' : aiAnalysis.citability.score >= 60 ? 'warning' : 'fail',
              description: aiAnalysis.citability.summary,
            },
            {
              name: 'AI 爬虫访问',
              status: crawlData.hasRobotsTxt ? 'pass' : 'warning',
              description: crawlData.hasRobotsTxt ? 'robots.txt 已配置' : '建议配置 robots.txt',
            },
            {
              name: 'llms.txt',
              status: crawlData.hasLlmsTxt ? 'pass' : 'fail',
              description: crawlData.hasLlmsTxt ? 'llms.txt 已配置' : '未找到 llms.txt 文件',
            },
            {
              name: '内容结构',
              status: crawlData.headings.h1.length > 0 ? 'pass' : 'warning',
              description: crawlData.headings.h1.length > 0 ? '标题结构良好' : '建议优化标题结构',
            },
          ],
        },
        technical: {
          score: crawlData.ssl ? 85 : 60,
          label: '技术 SEO',
          items: [
            {
              name: '页面速度',
              status: 'info',
              description: '建议使用 PageSpeed API 进行详细检测',
            },
            {
              name: '移动端友好',
              status: 'info',
              description: '建议使用 Google Mobile-Friendly Test',
            },
            {
              name: 'SSL 证书',
              status: crawlData.ssl ? 'pass' : 'fail',
              description: crawlData.ssl ? 'HTTPS 已启用' : '未启用 HTTPS',
            },
          ],
        },
        content: {
          score: aiAnalysis.contentQuality.score,
          label: '内容质量',
          items: [
            {
              name: '字数统计',
              status: crawlData.wordCount >= 500 ? 'pass' : 'warning',
              description: `${crawlData.wordCount} 字`,
            },
            {
              name: '可读性',
              status: aiAnalysis.contentQuality.readability >= 70 ? 'pass' : 'warning',
              description: `可读性评分 ${aiAnalysis.contentQuality.readability}`,
            },
            {
              name: 'E-E-A-T',
              status: aiAnalysis.contentQuality.eeat >= 70 ? 'pass' : 'warning',
              description: `E-E-A-T 评分 ${aiAnalysis.contentQuality.eeat}`,
            },
          ],
        },
        schema: {
          score: crawlData.hasSchema ? 75 : 45,
          label: '结构化数据',
          items: [
            {
              name: 'Schema 存在',
              status: crawlData.hasSchema ? 'pass' : 'fail',
              description: crawlData.hasSchema
                ? `检测到 ${crawlData.schemaTypes.length} 种 Schema 类型`
                : '未检测到 Schema 标记',
            },
            {
              name: '类型完整度',
              status: crawlData.schemaTypes.length >= 3 ? 'pass' : 'warning',
              description: crawlData.schemaTypes.length > 0
                ? `当前类型: ${crawlData.schemaTypes.join(', ')}`
                : '缺少关键 Schema 类型',
            },
          ],
        },
        platforms: {
          score: 70,
          label: '平台优化',
          items: [
            {
              name: 'Open Graph',
              status: crawlData.metaTags['og:title'] ? 'pass' : 'warning',
              description: crawlData.metaTags['og:title'] ? '已配置' : '建议配置',
            },
            {
              name: 'Twitter Card',
              status: crawlData.metaTags['twitter:card'] ? 'pass' : 'warning',
              description: crawlData.metaTags['twitter:card'] ? '已配置' : '建议配置',
            },
          ],
        },
      },
      details: {
        citability: aiAnalysis.citability,
        crawlers: {
          robotsTxt: crawlData.hasRobotsTxt,
          aiCrawlersAllowed: true,
          issues: crawlData.hasRobotsTxt ? [] : ['缺少 robots.txt'],
        },
        llmsTxt: {
          exists: crawlData.hasLlmsTxt,
          valid: crawlData.hasLlmsTxt,
          content: crawlData.llmsTxtContent,
        },
        brandMentions: [
          { platform: 'Twitter', count: 0, authority: 0 },
          { platform: 'LinkedIn', count: 0, authority: 0 },
        ],
        schema: {
          hasSchema: crawlData.hasSchema,
          types: crawlData.schemaTypes,
          valid: crawlData.hasSchema,
          recommendations: aiAnalysis.schemaRecommendations,
        },
        technical: {
          pageSpeed: 70,
          mobileFriendly: true,
          ssl: crawlData.ssl,
          issues: [],
        },
        content: {
      wordCount: crawlData.wordCount,
      readability: aiAnalysis.contentQuality.readability,
      eeat: aiAnalysis.contentQuality.eeat,
      keywordDensity: aiAnalysis.contentQuality.keywordDensity,
      contentStructure: aiAnalysis.contentQuality.contentStructure,
      readabilityMetrics: aiAnalysis.contentQuality.readabilityMetrics,
      contentQuality: aiAnalysis.contentQuality.contentQuality,
      recommendations: aiAnalysis.contentQuality.recommendations,
      actionableTips: aiAnalysis.contentQuality.actionableTips,
    },
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Audit error:', error);
    return NextResponse.json(
      { error: 'Failed to audit website' },
      { status: 500 }
    );
  }
}
