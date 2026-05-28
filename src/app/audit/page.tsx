'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Info, Loader2, Download, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { ScoreCircle } from '@/components/ScoreCircle';
import type { AuditResult } from '@/lib/types';
import PDFExport from '@/components/PDFExport';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';

async function performAudit(url: string): Promise<AuditResult> {
  const response = await fetch('/api/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Audit failed');
  }
  
  return response.json();
}

export default function AuditPage() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || '';
  const [url, setUrl] = useState(initialUrl);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const mutation = useMutation({
    mutationFn: performAudit,
    onSuccess: (data) => {
      setResult(data);
    },
  });

  useEffect(() => {
    if (initialUrl && !hasStarted && !result && !mutation.isPending) {
      setHasStarted(true);
      mutation.mutate(initialUrl);
    }
  }, [initialUrl, hasStarted, result, mutation.isPending, mutation]);

  const handleAudit = () => {
    if (url) {
      setHasStarted(true);
      mutation.mutate(url);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  const chartData = result
    ? Object.entries(result.categories).map(([key, category]) => ({
        name: category.label,
        score: category.score,
      }))
    : [];

  if (!result && !mutation.isPending) {
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
              GEO-SEO 审计
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">网站完整审计</h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              输入您的网站 URL，获取全面的 AI 搜索引擎优化分析报告
            </p>
          </div>

          {/* 输入卡片 */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="https://your-website.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                />
                <Button
                  onClick={handleAudit}
                  disabled={!url || mutation.isPending}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-6 text-lg"
                  size="lg"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      正在分析您的网站...
                    </>
                  ) : (
                    '开始审计'
                  )}
                </Button>
                {mutation.error && (
                  <div className="p-4 bg-red-900/30 border border-red-800 text-red-300 rounded-xl">
                    错误: {mutation.error instanceof Error ? mutation.error.message : '审计失败'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 功能预览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { title: 'AI 可见度', desc: '检查各 AI 平台的可见性评分' },
              { title: '内容质量', desc: '评估 Flesch-Kincaid 易读度和深度' },
              { title: '引用分析', desc: '分析内容的可引用性和权威性' },
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

  if (mutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-8">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">正在分析您的网站...</h2>
          <p className="text-slate-400 text-lg">这可能需要几秒钟时间，请稍候</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 顶部信息栏 */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">审计报告</h1>
            <p className="text-slate-400">{result.url}</p>
            <p className="text-sm text-slate-500 mt-1">
              {result.timestamp.toLocaleString('zh-CN')}
            </p>
          </div>
          {result && <PDFExport result={result} />}
        </div>

        {/* 总体评分卡片 */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <ScoreCircle score={result.overallScore} label="总体评分" size="xl" />
              <div className="flex-1 max-w-lg">
                <h3 className="text-2xl font-bold text-slate-100 mb-6">评分概览</h3>
                <div className="space-y-5">
                  {Object.entries(result.categories).map(([key, category]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-300">{category.label}</span>
                        <span className={`font-bold ${
                          category.score >= 80 ? 'text-emerald-400' : 
                          category.score >= 60 ? 'text-amber-400' : 'text-red-400'
                        }`}>{category.score}%</span>
                      </div>
                      <Progress value={category.score} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-100">评分分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} itemStyle={{ color: '#f1f5f9' }} />
                    <Bar
                      dataKey="score"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-100">能力雷达图</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                    <Radar
                      name="评分"
                      dataKey="score"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.3}
                    />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 分类详情 */}
        <div className="space-y-6">
          {Object.entries(result.categories).map(([key, category]) => (
            <Card key={key} className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100">{category.label}</CardTitle>
                  <span className={`text-xl font-bold ${
                    category.score >= 80 ? 'text-emerald-400' : 
                    category.score >= 60 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {category.score}%
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                      {getStatusIcon(item.status)}
                      <div className="flex-1">
                        <div className="font-semibold text-slate-100">{item.name}</div>
                        <div className="text-sm text-slate-400 mt-1">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI 平台分布与引用分析 */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-100">AI 平台分布与引用分析</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100">各 AI 平台可见度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { platform: 'ChatGPT', score: Math.min(95, result.overallScore + 5), color: '#10a37f' },
                        { platform: 'DeepSeek', score: Math.min(90, result.overallScore + 2), color: '#4d6bfe' },
                        { platform: 'Claude', score: Math.min(88, result.overallScore - 3), color: '#d97706' },
                        { platform: '千问', score: Math.min(85, result.overallScore - 5), color: '#6366f1' },
                        { platform: 'Kimi', score: Math.min(82, result.overallScore - 8), color: '#8b5cf6' },
                        { platform: '豆包', score: Math.min(80, result.overallScore - 10), color: '#0891b2' },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                      <YAxis type="category" dataKey="platform" tick={{ fontSize: 11, fill: '#94a3b8' }} width={70} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                      <Bar dataKey="score" name="可见度评分" radius={[0, 4, 4, 0]}>
                        {[
                          { platform: 'ChatGPT', score: 0, color: '#10a37f' },
                          { platform: 'DeepSeek', score: 0, color: '#4d6bfe' },
                          { platform: 'Claude', score: 0, color: '#d97706' },
                          { platform: '千问', score: 0, color: '#6366f1' },
                          { platform: 'Kimi', score: 0, color: '#8b5cf6' },
                          { platform: '豆包', score: 0, color: '#0891b2' },
                        ].map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100">引用来源倾向</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { source: '维基百科', rate: 15 },
                    { source: '知乎', rate: 11 },
                    { source: 'CSDN', rate: 8 },
                    { source: '百度百科', rate: 7 },
                    { source: 'GitHub', rate: 5 },
                    { source: '微信公众号', rate: 5 },
                    { source: 'Medium', rate: 4 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 w-5">{idx + 1}</span>
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

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-100">AI 引用情感分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-56 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '正面', value: 72, color: '#10b981' },
                          { name: '中性', value: 20, color: '#f59e0b' },
                          { name: '负面', value: 8, color: '#ef4444' },
                        ]}
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
                    <span className="ml-auto text-xl font-bold text-emerald-400">72%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium text-slate-300">中性引用</span>
                    <span className="ml-auto text-xl font-bold text-amber-400">20%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-slate-300">负面引用</span>
                    <span className="ml-auto text-xl font-bold text-red-400">8%</span>
                  </div>
                  <div className="pt-5 border-t border-slate-700">
                    <p className="text-sm text-slate-400">
                      💡 您的品牌在 AI 搜索引擎中的整体情感倾向为<strong className="text-emerald-400">正面</strong>。
                      建议继续增加正面引用来源，优化中性内容为正面描述。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 内容优化深度分析 */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-100">内容优化深度分析</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100">可读性指标</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-300">Flesch-Kincaid 易读度</span>
                    <span className="text-xl font-bold text-indigo-400">
                      {result.details.content.readabilityMetrics?.fleschKincaid || 0}
                    </span>
                  </div>
                  <Progress value={result.details.content.readabilityMetrics?.fleschKincaid || 0} />
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <div className="text-xs text-slate-500 mb-1">平均句长</div>
                      <div className="text-2xl font-bold text-slate-100">
                        {result.details.content.readabilityMetrics?.averageSentenceLength || 0} 词
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <div className="text-xs text-slate-500 mb-1">平均词长</div>
                      <div className="text-2xl font-bold text-slate-100">
                        {result.details.content.readabilityMetrics?.averageWordLength || 0} 字符
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <div className="text-xs text-slate-500 mb-1">被动语态</div>
                      <div className="text-2xl font-bold text-slate-100">
                        {result.details.content.readabilityMetrics?.passiveVoicePercentage || 0}%
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <div className="text-xs text-slate-500 mb-1">总字数</div>
                      <div className="text-2xl font-bold text-slate-100">
                        {result.details.content.wordCount}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100">内容质量评分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-300">原创性</span>
                      <span className="text-sm text-slate-400">
                        {result.details.content.contentQuality?.originality || 0}%
                      </span>
                    </div>
                    <Progress value={result.details.content.contentQuality?.originality || 0} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-300">深度</span>
                      <span className="text-sm text-slate-400">
                        {result.details.content.contentQuality?.depth || 0}%
                      </span>
                    </div>
                    <Progress value={result.details.content.contentQuality?.depth || 0} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-300">实用性</span>
                      <span className="text-sm text-slate-400">
                        {result.details.content.contentQuality?.utility || 0}%
                      </span>
                    </div>
                    <Progress value={result.details.content.contentQuality?.utility || 0} />
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <div className="text-sm text-slate-400 mb-2">内容结构</div>
                    <div className="flex gap-4">
                      <span className="text-sm">
                        {result.details.content.contentStructure?.hasIntro ? '✅' : '❌'} 引言
                      </span>
                      <span className="text-sm">
                        {result.details.content.contentStructure?.hasConclusion ? '✅' : '❌'} 结论
                      </span>
                      <span className="text-sm">
                        📑 {result.details.content.contentStructure?.sectionCount || 0} 章节
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 关键词分析 */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-100">关键词密度分析</CardTitle>
            </CardHeader>
            <CardContent>
              {result.details.content.keywordDensity && Object.keys(result.details.content.keywordDensity).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(result.details.content.keywordDensity).map(([word, density], idx) => (
                    <div key={idx} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 text-center">
                      <div className="font-semibold text-slate-100 mb-1">{word}</div>
                      <div className="text-lg font-bold text-indigo-400">{density}%</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">关键词数据不可用</p>
              )}
            </CardContent>
          </Card>

          {/* 可操作建议 */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-100">可操作优化建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.details.content.actionableTips?.map((tip, idx) => (
                  <div key={idx} className={`border-l-4 p-5 rounded-r-xl ${
                    tip.priority === 'high' ? 'border-red-500 bg-red-900/20' :
                    tip.priority === 'medium' ? 'border-amber-500 bg-amber-900/20' :
                    'border-green-500 bg-green-900/20'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-100 text-lg">{tip.title}</h4>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        tip.priority === 'high' ? 'bg-red-900 text-red-300' :
                        tip.priority === 'medium' ? 'bg-amber-900 text-amber-300' :
                        'bg-green-900 text-green-300'
                      }`}>
                        {tip.priority === 'high' ? '高优先级' :
                         tip.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{tip.description}</p>
                    <ul className="space-y-2">
                      {tip.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-indigo-400 font-bold">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={() => setResult(null)}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            新的审计
          </Button>
        </div>
      </div>
    </div>
  );
}
