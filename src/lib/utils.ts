import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AuditResult } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

export function generateMockAudit(url: string): AuditResult {
  return {
    url,
    timestamp: new Date(),
    overallScore: 72,
    categories: {
      aiVisibility: {
        score: 68,
        label: 'AI 可见性',
        items: [
          { name: '可引用性评分', status: 'warning', description: '内容可引用性中等' },
          { name: 'AI 爬虫访问', status: 'pass', description: 'AI 爬虫可正常访问' },
          { name: 'llms.txt', status: 'fail', description: '未找到 llms.txt 文件' },
          { name: '品牌提及', status: 'info', description: '检测到部分平台提及' },
        ],
      },
      technical: {
        score: 85,
        label: '技术 SEO',
        items: [
          { name: '页面速度', status: 'pass', description: '加载速度良好' },
          { name: '移动端友好', status: 'pass', description: '响应式设计良好' },
          { name: 'SSL 证书', status: 'pass', description: 'HTTPS 已启用' },
        ],
      },
      content: {
        score: 75,
        label: '内容质量',
        items: [
          { name: '字数统计', status: 'pass', description: '内容长度充足' },
          { name: '可读性', status: 'warning', description: '可读性可提升' },
          { name: 'E-E-A-T', status: 'warning', description: '专业性展示不足' },
        ],
      },
      schema: {
        score: 55,
        label: '结构化数据',
        items: [
          { name: 'Schema 存在', status: 'fail', description: '未检测到 Schema 标记' },
          { name: '类型完整度', status: 'fail', description: '缺少关键 Schema 类型' },
        ],
      },
      platforms: {
        score: 78,
        label: '平台优化',
        items: [
          { name: 'Open Graph', status: 'pass', description: '社交媒体元数据完整' },
          { name: 'Twitter Card', status: 'pass', description: 'Twitter 卡片已配置' },
        ],
      },
    },
    details: {
      citability: {
        score: 68,
        factors: {
          dataPoints: 75,
          citations: 60,
          expertise: 65,
          structure: 72,
        },
      },
      crawlers: {
        robotsTxt: true,
        aiCrawlersAllowed: true,
        issues: [],
      },
      llmsTxt: {
        exists: false,
        valid: false,
      },
      brandMentions: [
        { platform: 'Twitter', count: 42, authority: 65 },
        { platform: 'LinkedIn', count: 28, authority: 72 },
        { platform: 'Reddit', count: 15, authority: 58 },
      ],
      schema: {
        hasSchema: false,
        types: [],
        valid: false,
        recommendations: ['添加 Organization Schema', '添加 Article Schema', '添加 BreadcrumbList Schema'],
      },
      technical: {
        pageSpeed: 85,
        mobileFriendly: true,
        ssl: true,
        issues: [],
      },
      content: {
        wordCount: 1847,
        readability: 72,
        eeat: 68,
        keywordDensity: { '优化': 2.5, 'SEO': 3.1, 'AI': 2.8, '搜索': 2.2, '引用': 1.9 },
        contentStructure: {
          hasIntro: true,
          hasConclusion: true,
          sectionCount: 5,
        },
        readabilityMetrics: {
          fleschKincaid: 65,
          averageSentenceLength: 18,
          averageWordLength: 5,
          passiveVoicePercentage: 12,
        },
        contentQuality: {
          originality: 78,
          depth: 72,
          utility: 80,
        },
        recommendations: ['添加作者简介', '增加数据引用', '添加专家引用'],
        actionableTips: [
          { priority: 'high' as const, title: '增加内容长度', description: '更长的内容通常能提供更详细的信息', steps: ['扩展主题', '添加例子', '纳入数据'] },
          { priority: 'medium' as const, title: '添加数据引用', description: '数据增加权威性', steps: ['加入统计', '引用来源', '添加案例'] },
        ],
      },
    },
  };
}
