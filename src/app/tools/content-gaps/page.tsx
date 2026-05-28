'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ContentGapsPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        currentTopics: ['SEO 基础', '技术 SEO', '移动优化'],
        missingTopics: ['AI 搜索优化', '语音搜索', 'GEO SEO'],
        trendingTopics: ['GPT SEO', 'AI Content', 'LLM Optimization'],
        opportunities: [
          { topic: 'AI 搜索优化', potential: '高', competition: '中' },
          { topic: 'GEO SEO 指南', potential: '高', competition: '低' },
          { topic: 'Schema 标记教程', potential: '中', competition: '低' }
        ],
        recommendations: [
          '创建 AI 搜索优化系列教程',
          '编写 llms.txt 最佳实践指南',
          '制作 GEO SEO 工具使用教程'
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回工具集
        </Link>

        <div className="text-center mb-12">
          <Lightbulb className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">内容 Gaps 发现</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            找出内容缺口和机会，针对性创作内容
          </p>
        </div>

        {!result && !loading && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>输入 URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-website.com"
              />
              <Button onClick={analyze} disabled={!url} className="w-full">
                发现内容机会
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">正在分析内容缺口...</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>现有主题</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.currentTopics.map((topic: string, idx: number) => (
                      <li key={idx} className="p-3 bg-emerald-50 rounded-lg text-emerald-800">
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>缺失主题</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.missingTopics.map((topic: string, idx: number) => (
                      <li key={idx} className="p-3 bg-amber-50 rounded-lg text-amber-800">
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>趋势主题</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.trendingTopics.map((topic: string, idx: number) => (
                      <li key={idx} className="p-3 bg-purple-50 rounded-lg text-purple-800">
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>内容机会</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.opportunities.map((opp: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-900">{opp.topic}</div>
                        <div className="text-sm text-slate-600">
                          潜力: <span className="text-indigo-600 font-semibold">{opp.potential}</span> |
                          竞争: <span className="text-amber-600 font-semibold">{opp.competition}</span>
                        </div>
                      </div>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        创建内容
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>行动建议</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="p-3 bg-slate-50 rounded-lg text-slate-700">
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button onClick={() => setResult(null)}>
                新的分析
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
