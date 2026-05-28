'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Sparkles, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TitleOptimizerPage() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const optimize = () => {
    if (!title) return;
    setLoading(true);
    setTimeout(() => {
      setResults([
        `${title}: 完整指南 2026`,
        `如何 ${title}: 专家策略和技巧`,
        `${title}: 您需要知道的一切`,
        `初学者指南: ${title}`,
        `终极 ${title} 资源 2026`
      ]);
      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回工具集
        </Link>

        <div className="text-center mb-12">
          <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">标题优化建议</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            使用 AI 生成吸引人的标题，提升点击率和排名
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>输入您的主题</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：AI SEO 优化"
              className="w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <Button onClick={optimize} disabled={!title || loading} className="w-full">
              {loading ? '生成中...' : '生成优化标题'}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>AI 推荐的标题</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.map((t, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg flex justify-between items-center">
                  <p className="text-slate-900 font-medium">{t}</p>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(t)}>
                    <Copy className="w-4 h-4 mr-2" />
                    复制
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
