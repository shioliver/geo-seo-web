'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CompetitorPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        yourScore: 72,
        competitors: [
          { url: 'competitor1.com', score: 85, strength: 88, content: 78, visibility: 90 },
          { url: 'competitor2.com', score: 78, strength: 82, content: 75, visibility: 77 },
          { url: 'competitor3.com', score: 68, strength: 70, content: 72, visibility: 62 }
        ],
        yourStrengths: ['内容质量高', '移动端体验好', 'Schema 标记完善'],
        opportunities: ['AI 可见性需提升', '品牌提及可增加', '内容新鲜度需改善'],
        recommendations: [
          '增加 llms.txt 文件',
          '提升 AI 可引用性',
          '增强社交媒体提及',
          '定期更新内容'
        ]
      });
      setLoading(false);
    }, 2000);
  };

  const getColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
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
          <h1 className="text-3xl font-bold text-slate-900 mb-4">竞争对手分析</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            扫描竞争对手网站，对比优缺点，找出优化机会
          </p>
        </div>

        {!result && !loading && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>输入您的网站 URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-website.com"
              />
              <Button
                onClick={analyze}
                disabled={!url}
                className="w-full"
              >
                开始分析竞争对手
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">正在扫描竞争对手...</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>整体对比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-indigo-600 mb-2">{result.yourScore}</div>
                  <div className="text-lg text-slate-700">您的网站评分</div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">竞争对手对比</h3>
                  {result.competitors.map((comp: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-slate-900">{comp.url}</span>
                        <span className="text-2xl font-bold" style={{ color: getColor(comp.score) }}>{comp.score}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-slate-600 mb-1">网站实力</div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full" style={{ width: `${comp.strength}%`, backgroundColor: comp.strength >= 80 ? '#10b981' : comp.strength >= 60 ? '#f59e0b' : '#ef4444' }} />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-600 mb-1">内容质量</div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full" style={{ width: `${comp.content}%`, backgroundColor: comp.content >= 80 ? '#10b981' : comp.content >= 60 ? '#f59e0b' : '#ef4444' }} />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-600 mb-1">AI 可见性</div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full" style={{ width: `${comp.visibility}%`, backgroundColor: comp.visibility >= 80 ? '#10b981' : comp.visibility >= 60 ? '#f59e0b' : '#ef4444' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>您的优势</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.yourStrengths.map((str: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-emerald-800">{str}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>优化机会</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.opportunities.map((opp: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-amber-800">{opp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>行动建议</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{rec}</span>
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
