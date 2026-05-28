'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Loader2, Globe, ExternalLink, ChevronRight, MessageSquare, ThumbsUp, ThumbsDown, Minus, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const aiPlatforms = [
  { name: 'ChatGPT', icon: '🤖', color: '#10a37f' },
  { name: 'DeepSeek', icon: '🔮', color: '#4d6bfe' },
  { name: 'Claude', icon: '🧠', color: '#d97706' },
  { name: '千问', icon: '☁️', color: '#6366f1' },
  { name: 'Kimi', icon: '🌙', color: '#8b5cf6' },
  { name: '豆包', icon: '🫧', color: '#0891b2' },
];

interface SearchResult {
  query: string;
  platform: string;
  answer: string;
  citations: { title: string; url: string; type: string }[];
  sentiment: 'positive' | 'neutral' | 'negative';
  brandMentioned: boolean;
  mentionPosition: number;
}

function generateSearchResults(query: string, platform: string): SearchResult {
  const seed = query.length + platform.length;
  const brandMentioned = seed % 3 !== 0;
  const mentionPosition = brandMentioned ? 1 + (seed % 8) : 0;

  const sampleAnswers: Record<string, string> = {
    ChatGPT: `关于"${query}"，根据目前的信息，有几个主要的品牌和产品值得关注。首先，在这个领域中，${brandMentioned ? '该品牌在市场上表现突出，' : ''}其产品和服务在用户中获得了较高的评价。从技术角度分析，当前市场呈现出快速增长的趋势，预计未来几年将继续保持。建议用户根据自身需求选择合适的解决方案。`,
    DeepSeek: `"${query}"是一个热门话题。经过深入分析，${brandMentioned ? '该品牌是行业中的领先者，' : ''}主要参与者包括多家知名企业。从数据来看，市场需求持续增长，技术创新推动了行业发展。在选择时，建议考虑产品质量、服务支持和性价比等因素。`,
    Claude: `针对"${query}"这个问题，我来综合分析一下。${brandMentioned ? '该品牌在相关领域中占有重要地位，' : ''}目前市场上有多种选择可供考虑。根据公开数据和用户反馈，这个领域正在快速发展，消费者可以根据自己的具体需求做出选择。`,
    千问: `关于"${query}"，我可以提供以下信息。${brandMentioned ? '该品牌在市场上有着良好的口碑，' : ''}该行业整体呈现健康发展态势。从用户评价和专业分析来看，建议关注产品质量和服务体验，选择最适合自己的方案。`,
    Kimi: `"${query}"的相关信息如下：${brandMentioned ? '该品牌是值得关注的选项，' : ''}在这个领域中有多家竞争者。根据最新数据，市场规模在持续扩大，技术进步也在推动行业发展。建议消费者多做比较，选择最优方案。`,
    豆包: `关于"${query}"，这是我的分析：${brandMentioned ? '该品牌表现优异，' : ''}在当前市场环境下，有多种选择值得考虑。从性价比和用户满意度来看，建议根据实际需求做决策，同时关注行业动态。`,
  };

  const sampleCitations = [
    { title: '维基百科 - 相关条目', url: 'wikipedia.org', type: '百科' },
    { title: '知乎 - 专业解答', url: 'zhihu.com', type: '问答' },
    { title: 'CSDN - 技术分析', url: 'csdn.net', type: '技术' },
    { title: '百度百科 - 基础知识', url: 'baike.baidu.com', type: '百科' },
    { title: 'Medium - 深度报道', url: 'medium.com', type: '媒体' },
    { title: '微信公众号 - 行业观察', url: 'mp.weixin.qq.com', type: '媒体' },
    { title: '搜狐新闻 - 市场分析', url: 'sohu.com', type: '新闻' },
    { title: '哔哩哔哩 - 视频评测', url: 'bilibili.com', type: '视频' },
  ];

  const numCitations = 3 + (seed % 4);

  return {
    query,
    platform,
    answer: sampleAnswers[platform] || sampleAnswers.ChatGPT,
    citations: sampleCitations.slice(0, numCitations),
    sentiment: seed % 5 < 3 ? 'positive' : seed % 5 < 4 ? 'neutral' : 'negative',
    brandMentioned,
    mentionPosition,
  };
}

export default function RealtimeSearchPage() {
  const [query, setQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('全部平台');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deepThinking, setDeepThinking] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    setResults([]);
    await new Promise(resolve => setTimeout(resolve, deepThinking ? 3000 : 1500));

    const platforms = selectedPlatform === '全部平台' 
      ? aiPlatforms.map(p => p.name) 
      : [selectedPlatform];
    
    const searchResults = platforms.map(p => generateSearchResults(query, p));
    setResults(searchResults);
    setIsLoading(false);
  };

  const citationSourceData = results.length > 0 
    ? Object.entries(
        results.flatMap(r => r.citations).reduce<Record<string, number>>((acc, c) => {
          const domain = c.url.split('.')[0];
          acc[domain] = (acc[domain] || 0) + 1;
          return acc;
        }, {})
      ).map(([source, count]) => ({ source, count }))
    : [];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
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
              实时搜索
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">实时 AI 搜索分析</h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              模拟 AI 搜索引擎查询，查看品牌/关键词的引用来源和排名表现
            </p>
          </div>

          {/* 搜索框 */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                    <input
                      type="text"
                      placeholder="输入搜索关键词，如 最好的电动汽车、AI编程工具推荐"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-14 pr-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={!query || isLoading} size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
                    搜索
                  </Button>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedPlatform('全部平台')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedPlatform === '全部平台' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      全部平台
                    </button>
                    {aiPlatforms.map(p => (
                      <button
                        key={p.name}
                        onClick={() => setSelectedPlatform(p.name)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedPlatform === p.name ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        <span>{p.icon}</span>
                        {p.name}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-center gap-3 text-sm text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deepThinking}
                      onChange={(e) => setDeepThinking(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    深度思考模式
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-8">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              {deepThinking ? '正在进行深度分析...' : '正在搜索各 AI 平台...'}
            </h2>
            <p className="text-slate-400 text-lg">请稍候，我们正在获取最新数据</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            {/* 搜索结果摘要 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-xl bg-dark-card">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-indigo-400">
                    {results.filter(r => r.brandMentioned).length}/{results.length}
                  </div>
                  <div className="text-sm text-slate-400 mt-2">平台提及品牌</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-xl bg-dark-card">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-emerald-400">
                    {results.filter(r => r.sentiment === 'positive').length}
                  </div>
                  <div className="text-sm text-slate-400 mt-2">正面评价</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-xl bg-dark-card">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-amber-400">
                    {results.reduce((sum, r) => sum + r.citations.length, 0)}
                  </div>
                  <div className="text-sm text-slate-400 mt-2">引用来源总数</div>
                </CardContent>
              </Card>
            </div>

            {/* 各平台搜索结果 */}
            <div className="space-y-6">
              {results.map((result, idx) => {
                const platform = aiPlatforms.find(p => p.name === result.platform);
                return (
                  <Card key={idx} className="border-0 shadow-xl bg-dark-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{platform?.icon}</span>
                          <CardTitle className="text-slate-100 text-xl">{result.platform}</CardTitle>
                        </div>
                        <div className="flex items-center gap-3">
                          {result.brandMentioned && (
                            <span className="text-xs px-4 py-2 rounded-full bg-emerald-900/50 text-emerald-400 font-medium border border-emerald-700/50">
                              ✅ 品牌被提及 (第{result.mentionPosition}位)
                            </span>
                          )}
                          <span className={`text-xs px-4 py-2 rounded-full font-medium ${
                            result.sentiment === 'positive' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50' :
                            result.sentiment === 'neutral' ? 'bg-amber-900/50 text-amber-400 border border-amber-700/50' :
                            'bg-red-900/50 text-red-400 border border-red-700/50'
                          }`}>
                            {result.sentiment === 'positive' ? '😊 正面' : result.sentiment === 'neutral' ? '😐 中性' : '😟 负面'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-slate-800/50 p-6 rounded-xl mb-4 border border-slate-700/50">
                        <p className="text-slate-300 leading-relaxed text-base">{result.answer}</p>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-400 mb-3">引用来源</div>
                        <div className="flex flex-wrap gap-2">
                          {result.citations.map((citation, cIdx) => (
                            <a
                              key={cIdx}
                              href={`https://${citation.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm hover:border-indigo-500 hover:bg-indigo-900/30 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-300">{citation.title}</span>
                              <span className="text-xs text-slate-500">{citation.type}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 引用来源分布图 */}
            {citationSourceData.length > 0 && (
              <Card className="border-0 shadow-xl bg-dark-card">
                <CardHeader>
                  <CardTitle className="text-slate-100">引用来源分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={citationSourceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="source" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <YAxis tick={{ fill: '#94a3b8' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                        <Bar dataKey="count" name="引用次数" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}