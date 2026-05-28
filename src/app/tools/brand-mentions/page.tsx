'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, Users, Hash, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function BrandMentionsPage() {
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const scan = () => {
    if (!brandName) return;
    setLoading(true);
    setTimeout(() => {
      const platforms = [
        { name: 'Twitter/X', count: Math.floor(Math.random() * 100), authority: Math.floor(Math.random() * 100) },
        { name: 'LinkedIn', count: Math.floor(Math.random() * 50), authority: Math.floor(Math.random() * 100) },
        { name: 'Reddit', count: Math.floor(Math.random() * 80), authority: Math.floor(Math.random() * 100) },
        { name: 'Hacker News', count: Math.floor(Math.random() * 20), authority: Math.floor(Math.random() * 100) },
        { name: 'GitHub', count: Math.floor(Math.random() * 40), authority: Math.floor(Math.random() * 100) }
      ];

      const recommendations = [
        '建立社交媒体活跃',
        '参与行业讨论',
        '增加高质量引用',
        '建立权威性内容'
      ];

      setResult({ platforms, recommendations });
      setLoading(false);
    }, 2000);
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
          <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">品牌提及检测</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            扫描您的品牌在AI引用平台上的提及情况
          </p>
        </div>

        {!result && !loading && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>输入品牌名称</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your Brand Name"
              />
              <Button
                onClick={scan}
                disabled={!brandName}
                className="w-full"
              >
                开始扫描
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">正在扫描品牌提及...</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>扫描结果 - {brandName}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.platforms.map((platform: any, idx: number) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      {idx === 0 && <Hash className="w-6 h-6 text-sky-600" />}
                      {idx === 1 && <Users className="w-6 h-6 text-blue-600" />}
                      {idx === 2 && <Users className="w-6 h-6 text-orange-600" />}
                      {idx === 3 && <MessageSquare className="w-6 h-6 text-amber-600" />}
                      {idx === 4 && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                      <h3 className="text-lg font-semibold text-slate-900">{platform.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-indigo-600">{platform.count}</div>
                        <div className="text-sm text-slate-600">提及次数</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-emerald-600">{platform.authority}</div>
                        <div className="text-sm text-slate-600">权威度</div>
                      </div>
                    </div>
                  </div>
                ))}
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
                新的扫描
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
