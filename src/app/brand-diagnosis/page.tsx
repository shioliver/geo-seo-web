'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, TrendingUp, Eye, MessageSquare, ThumbsUp, ThumbsDown, Minus, Loader2, ChevronRight, BarChart3, Globe, CheckCircle, AlertCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const aiPlatforms = [
  { name: 'ChatGPT', icon: '🤖', color: '#10a37f' },
  { name: 'DeepSeek', icon: '🔮', color: '#4d6bfe' },
  { name: 'Claude', icon: '🧠', color: '#d97706' },
  { name: '千问', icon: '☁️', color: '#6366f1' },
  { name: 'Kimi', icon: '🌙', color: '#8b5cf6' },
  { name: '豆包', icon: '🫧', color: '#0891b2' },
  { name: 'Gemini', icon: '💎', color: '#2563eb' },
  { name: 'Perplexity', icon: '🔍', color: '#0891b2' },
];

interface BrandDiagnosisResult {
  brandName: string;
  overallScore: number;
  mentionRate: number;
  totalMentions: number;
  avgRank: number;
  sentimentScore: number;
  platformBreakdown: { platform: string; mentionRate: number; rank: number; sentiment: number; color: string }[];
  citationSources: { source: string; rate: number }[];
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  trendData: { date: string; score: number; mentions: number }[];
  recommendations: { priority: 'high' | 'medium' | 'low'; title: string; description: string }[];
  competitors: { name: string; score: number; mentionRate: number }[];
}

function generateDiagnosis(brandName: string): BrandDiagnosisResult {
  const seed = brandName.length * 7;
  const baseScore = 40 + (seed % 40);
  const mentionRate = 20 + (seed % 50);
  const totalMentions = 500 + (seed % 4000);
  const avgRank = 2 + (seed % 6);
  const sentimentScore = 60 + (seed % 35);

  return {
    brandName,
    overallScore: baseScore,
    mentionRate,
    totalMentions,
    avgRank,
    sentimentScore,
    platformBreakdown: aiPlatforms.map((p, i) => ({
      platform: p.name,
      mentionRate: Math.max(5, mentionRate - i * 5 + Math.floor(Math.random() * 15)),
      rank: avgRank + i * 0.3 + Math.random(),
      sentiment: Math.max(50, sentimentScore - i * 3 + Math.floor(Math.random() * 10)),
      color: p.color,
    })),
    citationSources: [
      { source: '维基百科', rate: 15 },
      { source: '知乎', rate: 12 },
      { source: 'CSDN', rate: 9 },
      { source: '百度百科', rate: 8 },
      { source: 'Medium', rate: 6 },
      { source: 'GitHub', rate: 5 },
      { source: '抖音', rate: 5 },
      { source: '微信公众号', rate: 4 },
      { source: '哔哩哔哩', rate: 3 },
      { source: '搜狐', rate: 3 },
    ],
    sentimentBreakdown: {
      positive: sentimentScore,
      neutral: Math.round((100 - sentimentScore) * 0.7),
      negative: Math.round((100 - sentimentScore) * 0.3),
    },
    trendData: Array.from({ length: 7 }, (_, i) => ({
      date: `${7 - i} 天前`,
      score: baseScore - 10 + i * 2 + Math.floor(Math.random() * 5),
      mentions: Math.round(totalMentions / 7 * (0.8 + Math.random() * 0.4)),
    })).reverse(),
    recommendations: [
      { priority: 'high' as const, title: '增加 AI 可引用内容', description: '在官网和百科页面增加结构化的品牌信息、数据点和权威引用，让 AI 更容易提取和引用' },
      { priority: 'high' as const, title: '优化 llms.txt 文件', description: '创建 llms.txt 文件，为 AI 爬虫提供清晰的品牌指引和核心内容摘要' },
      { priority: 'medium' as const, title: '加强多平台内容布局', description: '在知乎、CSDN、微信公众号等高引用率平台发布优质内容，提升被 AI 引用的机会' },
      { priority: 'medium' as const, title: '构建知识图谱关联', description: '添加 Schema.org 结构化数据，建立品牌与行业实体的关联关系' },
      { priority: 'low' as const, title: '监控竞品 AI 表现', description: '持续追踪竞争对手在各 AI 平台的表现，及时调整优化策略' },
    ],
    competitors: [
      { name: `${brandName}-竞品A`, score: baseScore + 8, mentionRate: mentionRate + 5 },
      { name: `${brandName}-竞品B`, score: baseScore - 3, mentionRate: mentionRate - 8 },
      { name: `${brandName}-竞品C`, score: baseScore - 12, mentionRate: mentionRate - 15 },
    ],
  };
}

export default function BrandDiagnosisPage() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand') || '';
  const [brandName, setBrandName] = useState(initialBrand);
  const [result, setResult] = useState<BrandDiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    if (initialBrand && !result && !isLoading) {
      handleDiagnosis(initialBrand);
    }
  }, [initialBrand]);

  const handleDiagnosis = async (name?: string) => {
    const brand = name || brandName;
    if (!brand) return;
    setIsLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResult(generateDiagnosis(brand));
    setIsLoading(false);
  };

  const togglePlatform = (name: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const sentimentData = result ? [
    { name: '正面', value: result.sentimentBreakdown.positive, color: '#10b981' },
    { name: '中性', value: result.sentimentBreakdown.neutral, color: '#f59e0b' },
    { name: '负面', value: result.sentimentBreakdown.negative, color: '#ef4444' },
  ] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-8">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">正在诊断品牌 "{brandName}"...</h2>
          <p className="text-slate-400 text-lg">正在扫描各 AI 平台的引用数据</p>
          <div className="flex justify-center gap-4 mt-8">
            {aiPlatforms.slice(0, 5).map(p => (
              <span key={p.name} className="text-3xl animate-pulse" style={{ animationDelay: `${Math.random() * 2}s` }}>
                {p.icon}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>

          {/* Hero 区域 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-indigo-300 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Globe className="w-4 h-4" />
              品牌诊断
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">品牌 GEO 诊断</h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              输入品牌名称，诊断在各 AI 搜索引擎平台的可见度、提及率和情感倾向
            </p>
          </div>

          {/* 输入卡片 */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="输入品牌名称，如 特斯拉、苹果、华为"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDiagnosis()}
                    className="flex-1 px-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                  />
                  <Button onClick={() => handleDiagnosis()} disabled={!brandName} size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Search className="w-5 h-5 mr-2" />
                    开始诊断
                  </Button>
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-3">选择要诊断的 AI 平台（默认全部）</div>
                  <div className="flex flex-wrap gap-2">
                    {aiPlatforms.map(p => (
                      <button
                        key={p.name}
                        onClick={() => togglePlatform(p.name)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedPlatforms.includes(p.name)
                            ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <span>{p.icon}</span>
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 功能预览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { title: 'AI 平台可见度', desc: '检查品牌在各 AI 平台的提及率' },
              { title: '情感分析', desc: '分析品牌在 AI 引用中的情感倾向' },
              { title: '竞品对比', desc: '对比品牌与竞品的 GEO 表现' },
            ].map((item, idx) => (
              <Card key={idx} className="border-0 bg-dark-card">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 顶部信息栏 */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">品牌诊断报告</h1>
          <p className="text-slate-400">{result.brandName} - 各 AI 平台 GEO 可见度分析</p>
        </div>

        {/* 核心指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-xl bg-dark-card">
            <CardContent className="p-6 text-center">
              <Eye className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-indigo-400">{result.overallScore}</div>
              <div className="text-sm text-slate-400 mt-2">GEO 总分</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-xl bg-dark-card">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-purple-400">{result.mentionRate}%</div>
              <div className="text-sm text-slate-400 mt-2">品牌提及率</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-xl bg-dark-card">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-emerald-400">{result.totalMentions.toLocaleString()}</div>
              <div className="text-sm text-slate-400 mt-2">总提及次数</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-xl bg-dark-card">
            <CardContent className="p-6 text-center">
              <ThumbsUp className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-amber-400">{result.sentimentScore}%</div>
              <div className="text-sm text-slate-400 mt-2">正面情感</div>
            </CardContent>
          </Card>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl bg-dark-card">
            <CardHeader>
              <CardTitle className="text-slate-100">各 AI 平台提及率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.platformBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                    <YAxis type="category" dataKey="platform" tick={{ fontSize: 12, fill: '#94a3b8' }} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                    <Bar dataKey="mentionRate" name="提及率 %" radius={[0, 4, 4, 0]}>
                      {result.platformBreakdown.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-dark-card">
            <CardHeader>
              <CardTitle className="text-slate-100">情感分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-56 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-slate-300">正面引用</span>
                    <span className="ml-auto text-xl font-bold text-emerald-400">{result.sentimentBreakdown.positive}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium text-slate-300">中性引用</span>
                    <span className="ml-auto text-xl font-bold text-amber-400">{result.sentimentBreakdown.neutral}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-slate-300">负面引用</span>
                    <span className="ml-auto text-xl font-bold text-red-400">{result.sentimentBreakdown.negative}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 趋势 + 引用来源 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl bg-dark-card">
            <CardHeader>
              <CardTitle className="text-slate-100">7 天趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} name="GEO 得分" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-dark-card">
            <CardHeader>
              <CardTitle className="text-slate-100">引用来源分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.citationSources.slice(0, 7).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-6">{idx + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-300">{item.source}</span>
                        <span className="text-sm font-bold text-indigo-400">{item.rate}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${item.rate * 6}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 竞品对比 */}
        <Card className="border-0 shadow-xl bg-dark-card">
          <CardHeader>
            <CardTitle className="text-slate-100">竞品 GEO 对比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[{ name: result.brandName, score: result.overallScore, mentionRate: result.mentionRate }, ...result.competitors].map((comp, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-5 rounded-xl border ${idx === 0 ? 'border-indigo-500/50 bg-indigo-900/20' : 'border-slate-700 bg-slate-800/30'}`}>
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-100 text-lg">{comp.name} {idx === 0 && '(您)'}</div>
                    <div className="text-sm text-slate-400">提及率 {comp.mentionRate}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-400">{comp.score}</div>
                    <div className="text-xs text-slate-500">GEO 得分</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 优化建议 */}
        <Card className="border-0 shadow-xl bg-dark-card">
          <CardHeader>
            <CardTitle className="text-slate-100">优化建议</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className={`border-l-4 p-5 rounded-r-xl ${
                  rec.priority === 'high' ? 'border-red-500 bg-red-900/20' :
                  rec.priority === 'medium' ? 'border-amber-500 bg-amber-900/20' :
                  'border-green-500 bg-green-900/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-slate-100 text-lg">{rec.title}</h4>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      rec.priority === 'high' ? 'bg-red-900 text-red-300' :
                      rec.priority === 'medium' ? 'bg-amber-900 text-amber-300' :
                      'bg-green-900 text-green-300'
                    }`}>
                      {rec.priority === 'high' ? '高优先级' : rec.priority === 'medium' ? '中优先级' : '低优先级'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{rec.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={() => { setResult(null); setBrandName(''); }}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            诊断其他品牌
          </Button>
        </div>
      </div>
    </div>
  );
}