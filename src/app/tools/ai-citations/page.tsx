'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Search, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AICitationsPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        citations: { count: Math.floor(Math.random() * 50), score: Math.floor(Math.random() * 100) },
        sources: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
        visibility: { score: Math.floor(Math.random() * 100) },
        recommendations: [
          '增强内容可引用性',
          '提供更多数据和证据',
          '确保内容权威性',
          '优化内容结构'
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
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
          <Search className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">AI 引用追踪</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            追踪您的网站被 AI 搜索引擎引用的情况
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
              <Button
                onClick={analyze}
                disabled={!url}
                className="w-full"
              >
                开始分析
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">正在追踪 AI 引用...</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>追踪结果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-lg text-center">
                    <LinkIcon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <div className="text-4xl font-bold mb-2" style={{ color: getScoreColor(result.citations.score) }}>
                      {result.citations.count}
                    </div>
                    <div className="text-lg text-slate-700 mb-3">AI 引用数</div>
                    <div className="text-sm text-slate-600">
                      综合引用评分: {result.citations.score}/100
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">被引用来源</h3>
                    <ul className="space-y-2">
                      {result.sources.map((source: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 p-3 bg-white rounded-lg">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-slate-700">{source}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>优化建议</CardTitle>
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
