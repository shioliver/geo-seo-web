'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Search, TrendingUp, Activity, ChevronRight, ExternalLink, Zap, Shield, FileText, ArrowUpRight, Eye, MessageSquare, BarChart3, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

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

const sampleRankings = [
  { brand: 'Tesla', mentionRate: 72, mentions: 4521, avgRank: 3.2, sentiment: 95, score: 82 },
  { brand: 'Apple', mentionRate: 68, mentions: 3892, avgRank: 3.8, sentiment: 92, score: 78 },
  { brand: 'Google', mentionRate: 65, mentions: 3456, avgRank: 4.1, sentiment: 88, score: 74 },
  { brand: 'Microsoft', mentionRate: 58, mentions: 2987, avgRank: 4.5, sentiment: 90, score: 70 },
  { brand: 'Amazon', mentionRate: 54, mentions: 2654, avgRank: 4.9, sentiment: 85, score: 66 },
  { brand: 'Samsung', mentionRate: 48, mentions: 2231, avgRank: 5.3, sentiment: 87, score: 62 },
  { brand: 'Meta', mentionRate: 42, mentions: 1876, avgRank: 5.8, sentiment: 78, score: 56 },
  { brand: 'NVIDIA', mentionRate: 39, mentions: 1543, avgRank: 6.1, sentiment: 94, score: 52 },
];

const citationSources = [
  { source: '维基百科', rate: 12 },
  { source: '知乎', rate: 9 },
  { source: 'CSDN', rate: 7 },
  { source: '百度百科', rate: 6 },
  { source: 'Medium', rate: 5 },
  { source: 'GitHub', rate: 5 },
  { source: '掘金', rate: 4 },
  { source: '微信公众号', rate: 4 },
  { source: '哔哩哔哩', rate: 3 },
  { source: '抖音', rate: 3 },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'brand'>('url');
  const router = useRouter();

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'url' && url) {
      router.push(`/audit?url=${encodeURIComponent(url)}`);
    } else if (activeTab === 'brand' && brandName) {
      router.push(`/brand-diagnosis?brand=${encodeURIComponent(brandName)}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* 顶部 Hero 区域 - 流动背景 */}
      <section className="relative flow-bg py-20 px-4 overflow-hidden min-h-[85vh] flex items-center">
        <div className="flow-orb flow-orb-1" />
        <div className="flow-orb flow-orb-2" />
        <div className="flow-orb flow-orb-3" />
        <div className="flow-orb flow-orb-4" />
        <div className="mesh-gradient" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-indigo-200 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Activity className="w-4 h-4" />
              GEO-first, SEO-supported
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              AI 搜索引擎优化平台
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              诊断您的品牌在 ChatGPT、DeepSeek、Claude、千问等 AI 平台的可见度，优化内容让 AI 更容易引用
            </p>

            {/* 搜索框 - 双模式 */}
            <form onSubmit={handleAudit} className="max-w-3xl mx-auto">
              <div className="flex gap-1 mb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'url'
                      ? 'bg-white text-slate-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  🔗 网站审计
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('brand')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'brand'
                      ? 'bg-white text-slate-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  🏷️ 品牌诊断
                </button>
              </div>

              <div className="flex gap-3 bg-white/10 backdrop-blur-md rounded-xl p-2">
                {activeTab === 'url' ? (
                  <input
                    type="url"
                    placeholder="输入网站 URL，如 https://your-website.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="输入品牌名称，如 特斯拉、苹果、华为"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  />
                )}
                <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap rounded-lg">
                  {activeTab === 'url' ? '开始审计' : '品牌诊断'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </form>
          </div>

          {/* AI 平台选择器 */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {aiPlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => setSelectedPlatform(selectedPlatform === platform.name ? null : platform.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  selectedPlatform === platform.name
                    ? 'bg-white text-slate-900 border-white shadow-lg'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span>{platform.icon}</span>
                {platform.name}
              </button>
            ))}
          </div>

          {/* 统计数字卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <MessageSquare className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                <AnimatedCounter target={8794851} />
              </div>
              <div className="text-sm text-slate-300">AI 对话追踪</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <Eye className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                <AnimatedCounter target={14723664} />
              </div>
              <div className="text-sm text-slate-300">品牌 AI 提及</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                <AnimatedCounter target={21042256} />
              </div>
              <div className="text-sm text-slate-300">收录引用文章</div>
            </div>
          </div>
        </div>
      </section>

      {/* 品牌排名榜 + 引用来源 + 品牌监测 */}
      <section className="py-12 px-4 bg-gradient-to-b from-[#020617] to-[#020617]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 品牌排名榜 */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-400" />
                      行业 GEO 排名榜
                    </CardTitle>
                    <div className="flex gap-2">
                      {['科技', '汽车', '消费'].map((cat) => (
                        <span key={cat} className="text-xs px-3 py-1 rounded-full bg-slate-700 text-slate-300 cursor-pointer hover:bg-slate-600 hover:text-white transition-colors">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-slate-400 border-b border-slate-700">
                          <th className="text-left py-3 px-2">排名</th>
                          <th className="text-left py-3 px-2">品牌</th>
                          <th className="text-center py-3 px-2">提及率</th>
                          <th className="text-center py-3 px-2">提及次数</th>
                          <th className="text-center py-3 px-2">平均排名</th>
                          <th className="text-center py-3 px-2">情感</th>
                          <th className="text-center py-3 px-2">GEO 得分</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleRankings.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/60 transition-colors cursor-pointer">
                            <td className="py-3 px-2">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                idx < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-700 text-slate-200'
                              }`}>
                                {idx + 1}
                              </span>
                            </td>
                            <td className="py-3 px-2 font-semibold text-slate-100">{item.brand}</td>
                            <td className="py-3 px-2 text-center">
                              <div className="inline-flex items-center gap-1">
                                <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.mentionRate}%` }} />
                                </div>
                                <span className="text-sm font-medium text-slate-200">{item.mentionRate}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-center text-sm text-slate-400">
                              {item.mentions.toLocaleString()}
                              <span className="text-xs text-slate-500 ml-1">提及</span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className={`text-sm font-medium ${item.avgRank <= 4 ? 'text-emerald-400' : item.avgRank <= 6 ? 'text-amber-400' : 'text-red-400'}`}>
                                {item.avgRank}
                                <span className="text-xs text-slate-500 ml-1">{item.avgRank <= 4 ? '靠前' : item.avgRank <= 6 ? '中等' : '靠后'}</span>
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className={`text-sm font-medium ${item.sentiment >= 90 ? 'text-emerald-400' : item.sentiment >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                                {item.sentiment}%
                                <span className="text-xs text-slate-500 ml-1">{item.sentiment >= 90 ? '正面' : '中性'}</span>
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-900/50 text-sm font-bold text-indigo-300">
                                {item.score}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 引用来源 + 品牌监测 */}
            <div className="grid grid-cols-1 gap-8">
              {/* 引用来源排行 */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-purple-400" />
                    GEO 引用来源
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {citationSources.map((source, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 w-5">{idx + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-slate-300">{source.source}</span>
                            <span className="text-sm font-bold text-indigo-400">{source.rate}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                              style={{ width: `${source.rate * 8}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 品牌监测 - 重新设计更大气 */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 p-8">
                  {/* 装饰光效 */}
                  <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-56 h-56 bg-indigo-400/20 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    {/* 图标区域 */}
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                      <Monitor className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* 文字区域 */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-white mb-2">品牌 AI 监测</h3>
                      <p className="text-indigo-100 text-sm mb-5 max-w-xs">
                        7x24小时不间断监测您的品牌在各大 AI 平台的提及率、情感变化和排名波动
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="text-xs bg-white/20 px-3 py-1 rounded-full text-indigo-100">实时通知</span>
                        <span className="text-xs bg-white/20 px-3 py-1 rounded-full text-indigo-100">趋势报告</span>
                        <span className="text-xs bg-white/20 px-3 py-1 rounded-full text-indigo-100">竞品对比</span>
                      </div>
                    </div>
                    
                    {/* 按钮 */}
                    <Button
                      size="lg"
                      className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all px-6"
                      onClick={() => router.push('/brand-monitor')}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      开始监测
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特色 */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#020617] to-[#020617]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-100 text-center mb-3">
            全方位 GEO-SEO 分析
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            从 AI 品牌诊断到技术审计，帮助您的品牌在 AI 时代脱颖而出
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Search className="w-8 h-8 text-indigo-400" />, title: '品牌诊断', desc: '诊断品牌在各 AI 平台的可见度和引用率', link: '/brand-diagnosis' },
              { icon: <FileText className="w-8 h-8 text-emerald-400" />, title: '完整审计', desc: '全面的网站 GEO-SEO 技术审计报告', link: '/audit' },
              { icon: <BarChart3 className="w-8 h-8 text-amber-400" />, title: '实时搜索', desc: '模拟 AI 搜索查看引用来源和排名', link: '/realtime-search' },
              { icon: <Monitor className="w-8 h-8 text-purple-400" />, title: '品牌监测', desc: '持续追踪品牌 AI 提及率和情感分析', link: '/brand-monitor' },
            ].map((feature, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-all cursor-pointer shadow-sm group" onClick={() => router.push(feature.link)}>
                <CardContent className="p-6">
                  <div className="mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                  <ArrowUpRight className="w-5 h-5 text-slate-500 mt-3 group-hover:text-indigo-400 transition-colors" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative flow-bg py-20 px-4 overflow-hidden">
        <div className="flow-orb flow-orb-1" />
        <div className="flow-orb flow-orb-2" />
        <div className="mesh-gradient" />
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <h2 className="text-3xl font-bold mb-6">准备好提升您的 AI 搜索可见度了吗？</h2>
          <p className="text-lg text-slate-300 mb-8">
            AI 搜索正在改变游戏规则。现在就开始优化，领先一步。
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => router.push('/audit')}
            >
              <Zap className="w-5 h-5 mr-2" />
              免费开始审计
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => router.push('/brand-diagnosis')}
            >
              品牌诊断
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#020617] border-t border-slate-800 text-slate-400">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">GEO-SEO © 2026 - 为 AI 时代优化</p>
          <p className="text-sm">基于 zubair-trabzada/geo-seo-claude 项目</p>
        </div>
      </footer>
    </div>
  );
}
