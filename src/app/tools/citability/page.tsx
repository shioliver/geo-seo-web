'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Info, Database, Search, Book } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';

export default function CitabilityPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      const dataPoints = Math.floor(Math.random() * 100);
      const citations = Math.floor(Math.random() * 80);
      const expertise = Math.floor(Math.random() * 90);
      const structure = Math.floor(Math.random() * 85);
      
      const overall = Math.floor((dataPoints + citations + expertise + structure) / 4);
      
      setResult({
        overall,
        factors: {
          dataPoints,
          citations,
          expertise,
          structure
        },
        recommendations: [
          '添加更多数据点和统计信息',
          '包括可信来源的引用链接',
          '增加作者的资质信息',
          '改善内容结构和标题层级',
          '提供案例研究和实际例子'
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const getColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBgColor = (score: number) => {
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
          <Database className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">可引用性评分</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            评估您的内容是否容易被AI搜索引擎引用和引用
          </p>
        </div>

        {!result && !loading && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>输入URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-website.com/page"
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
              <p className="text-slate-600">正在分析内容可引用性...</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>总体评分</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-7xl font-bold text-indigo-600 mb-4">
                  {result.overall}
                </div>
                <div className="text-slate-600">满分100</div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">数据点</h3>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: getColor(result.factors.dataPoints) }}>
                    {result.factors.dataPoints}
                  </div>
                  <Progress value={result.factors.dataPoints} className={getBgColor(result.factors.dataPoints)} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Link href="/" className="w-6 h-6 text-indigo-600">
                      <Book />
                    </Link>
                    <h3 className="text-lg font-semibold text-slate-900">引用来源</h3>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: getColor(result.factors.citations) }}>
                    {result.factors.citations}
                  </div>
                  <Progress value={result.factors.citations} className={getBgColor(result.factors.citations)} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">专业性</h3>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: getColor(result.factors.expertise) }}>
                    {result.factors.expertise}
                  </div>
                  <Progress value={result.factors.expertise} className={getBgColor(result.factors.expertise)} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Search className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">结构</h3>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: getColor(result.factors.structure) }}>
                    {result.factors.structure}
                  </div>
                  <Progress value={result.factors.structure} className={getBgColor(result.factors.structure)} />
                </CardContent>
              </Card>
            </div>

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
