'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Search, Shield, Zap, Layout, Users, CheckCircle, ChevronRight, Calendar, History, Hash, Image, Map, TrendingUp, BarChart3, FileSearch, Type, ListTree, Sparkles, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const tools = [
  {
    icon: <FileText className="w-10 h-10 text-indigo-400" />,
    title: '可引用性评分',
    description: '评估您的内容是否容易被 AI 引用和引用',
    features: ['数据点检测', '引用来源分析', '专业性评估'],
    enabled: true,
    link: '/tools/citability',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30'
  },
  {
    icon: <Search className="w-10 h-10 text-emerald-400" />,
    title: 'AI 爬虫检查',
    description: '检查您的网站是否允许 AI 爬虫访问',
    features: ['robots.txt 分析', 'AI 爬虫规则', '访问权限检测'],
    enabled: true,
    link: '/tools/ai-crawlers',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  },
  {
    icon: <Calendar className="w-10 h-10 text-pink-400" />,
    title: '内容新鲜度评分',
    description: '评估您的内容新鲜度，为 AI 搜索引擎提供最新参考',
    features: ['更新频率检测', '内容深度分析', '优化建议'],
    enabled: true,
    link: '/tools/freshness-checker',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30'
  },
  {
    icon: <FileText className="w-10 h-10 text-amber-400" />,
    title: 'llms.txt 生成器',
    description: '创建和优化 llms.txt 文件',
    features: ['llms.txt 验证', '模板生成', '最佳实践建议'],
    enabled: true,
    link: '/tools/llmstxt-generator',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30'
  },
  {
    icon: <Users className="w-10 h-10 text-purple-400" />,
    title: '品牌提及检测',
    description: '扫描您的品牌在 AI 引用平台上的提及',
    features: ['社交媒体扫描', '论坛提及', '权威度评分'],
    enabled: true,
    link: '/tools/brand-mentions',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  {
    icon: <Layout className="w-10 h-10 text-rose-400" />,
    title: 'Schema 标记生成器',
    description: '检测和建议结构化数据优化',
    features: ['多种 Schema 类型', 'JSON-LD 生成', '验证建议'],
    enabled: true,
    link: '/tools/schema-generator',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30'
  },
  {
    icon: <History className="w-10 h-10 text-blue-400" />,
    title: '审计历史记录',
    description: '查看和管理所有 GEO-SEO 审计历史',
    features: ['历史数据', '进度追踪', '报告管理'],
    enabled: true,
    link: '/tools/history',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-cyan-400" />,
    title: '对比分析',
    description: '比较两次审计结果，查看优化效果',
    features: ['版本对比', '变化分析', '改进建议'],
    enabled: true,
    link: '/tools/compare',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30'
  },
  {
    icon: <Image className="w-10 h-10 text-teal-400" />,
    title: '多模态优化',
    description: '优化图片、视频和音频内容，提升 AI 搜索能力',
    features: ['图片优化', '视频优化', '音频优化'],
    enabled: true,
    link: '/tools/multimodal',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30'
  },
  {
    icon: <Map className="w-10 h-10 text-violet-400" />,
    title: '知识图谱兼容性',
    description: '评估与 Google 知识图谱等 AI 系统的兼容性',
    features: ['实体识别', '关系分析', 'Schema 检查'],
    enabled: true,
    link: '/tools/knowledge-graph',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30'
  },
  {
    icon: <Search className="w-10 h-10 text-fuchsia-400" />,
    title: 'AI 引用追踪',
    description: '追踪网站被 AI 搜索引擎引用的情况',
    features: ['引用追踪', '来源分析', '可见性报告'],
    enabled: true,
    link: '/tools/ai-citations',
    color: 'from-fuchsia-500 to-fuchsia-600',
    bgColor: 'bg-fuchsia-500/10',
    borderColor: 'border-fuchsia-500/30'
  },
  {
    icon: <TrendingUp className="w-10 h-10 text-orange-400" />,
    title: '竞争对手分析',
    description: '对比您的网站与竞争对手的 SEO 表现',
    features: ['分数对比', '优势分析', '机会发现'],
    enabled: true,
    link: '/tools/competitor',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30'
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-green-400" />,
    title: 'SEO 健康仪表板',
    description: '实时监控您的 SEO 健康状态和趋势',
    features: ['关键指标', '趋势图表', '健康评分'],
    enabled: true,
    link: '/tools/dashboard',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  },
  {
    icon: <FileSearch className="w-10 h-10 text-sky-400" />,
    title: '内容差距发现',
    description: '识别您内容中的差距和机会',
    features: ['关键词分析', '内容缺口', '优化建议'],
    enabled: true,
    link: '/tools/content-gaps',
    color: 'from-sky-500 to-sky-600',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30'
  },
  {
    icon: <Type className="w-10 h-10 text-rose-400" />,
    title: '标题优化器',
    description: '优化您的页面标题，提高点击率',
    features: ['标题分析', '改进建议', 'A/B 测试'],
    enabled: true,
    link: '/tools/title-optimizer',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30'
  },
  {
    icon: <ListTree className="w-10 h-10 text-yellow-400" />,
    title: 'XML 站点地图生成器',
    description: '自动生成和优化 XML 站点地图',
    features: ['自动生成', 'URL 验证', '下载导出'],
    enabled: true,
    link: '/tools/sitemap',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30'
  }
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </Link>

        <div className="relative mb-16">
          <div className="absolute -top-20 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -top-20 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="text-indigo-400 font-medium">完整的工具套件</span>
            </div>
            <h1 className="text-5xl font-bold text-slate-100 mb-6">
              GEO-SEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">工具集</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              一套完整的工具，帮助您优化网站以适应 AI 搜索引擎，提升可见性和可引用性
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {tools.map((tool, idx) => (
            <Card key={idx} className={`bg-dark-card border-2 ${tool.borderColor} hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${tool.bgColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-8 relative">
                <div className={`w-16 h-16 ${tool.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3 flex items-center gap-2">
                  {tool.title}
                  {tool.enabled && (
                    <span className="px-3 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                      可用
                    </span>
                  )}
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{tool.description}</p>
                <ul className="space-y-3 mb-8">
                  {tool.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {tool.enabled && tool.link ? (
                  <Link href={tool.link}>
                    <Button className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 transition-opacity`}>
                      开始使用
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    即将推出
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <CardContent className="p-12 text-center relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/20">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-slate-100 mb-4">
              需要自定义解决方案？
            </h3>
            <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              我们可以为您提供定制的 GEO-SEO 策略和实施服务，帮助您在 AI 搜索时代获得竞争优势
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-10 py-6">
                联系我们
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 text-lg px-10 py-6">
                了解更多
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
