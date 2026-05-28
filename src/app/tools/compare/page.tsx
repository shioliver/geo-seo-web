'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ComparePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const compare = () => {
    setLoading(true);
    setTimeout(() => {
      const before = { score: 65, ai: 60, technical: 70, content: 62, schema: 50, platforms: 75 };
      const after = { score: 78, ai: 75, technical: 80, content: 76, schema: 60, platforms: 78 };
      const improvements = [
        { category: 'AI 可见性', change: 15, status: 'up' },
        { category: '技术 SEO', change: 10, status: 'up' },
        { category: '内容质量', change: 14, status: 'up' },
        { category: 'Schema 标记', change: 10, status: 'up' },
        { category: '平台优化', change: 3, status: 'up' }
      ];
      const recommendations = [
        '继续优化 Schema 标记',
        '增加内容更新频率',
        '优化页面加载速度'
      ];
      setResult({ before, after, improvements, recommendations });
      setLoading(false);
    }, 1500);
  };

  const getChangeIcon = (status: string) => {
    if (status === 'up') return <TrendingUp className="w-5 h-5 text-emerald-600" />;
    if (status === 'down') return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-slate-400" />;
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
          <CheckCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">对比分析</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            比较两次审计的结果，查看优化效果
          </p>
        </div>

        {!result && !loading && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>选择审计记录</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 mb-4">选择要比较的两次审计记录</p>
              <div className="flex gap-4">
                <Input placeholder="旧审计 URL" />
                <Input placeholder="新审计 URL" />
              </div>
              <Button onClick={compare} className="w-full">
                开始对比
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">正在对比分析...</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>总体对比</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">优化前</div>
                    <div className="text-6xl font-bold text-slate-500">{result.before.score}</div>
                  </div>
                  <TrendingUp className="w-12 h-12 text-emerald-600" />
                  <div>
                    <div className="text-sm text-slate-600 mb-1">优化后</div>
                    <div className="text-6xl font-bold text-emerald-600">{result.after.score}</div>
                  </div>
                </div>
                <div className="text-lg text-slate-700">
                  提升了 <span className="text-emerald-600 font-bold">+{result.after.score - result.before.score}分</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>详细对比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result.improvements.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold text-slate-900">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">{result.before[Object.keys(result.before)[idx]]}</span>
                          {getChangeIcon(item.status)}
                          <span className="text-emerald-600 font-bold">{result.after[Object.keys(result.after)[idx]]}</span>
                          <span className="text-sm text-emerald-600 font-semibold">(+{item.change})</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${(result.after[Object.keys(result.after)[idx]] / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>持续优化建议</CardTitle>
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

            <div className="flex justify-center gap-4">
              <Button onClick={() => setResult(null)}>
                新的对比
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
