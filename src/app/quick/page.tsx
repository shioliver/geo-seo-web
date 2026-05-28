'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, CheckCircle, AlertCircle, XCircle, Clock, Search, Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScoreCircle } from '@/components/ScoreCircle';

export default function QuickPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleQuickCheck = () => {
    if (!url) return;
    setIsLoading(true);
    setTimeout(() => {
      setResult({
        url,
        score: 68,
        checks: [
          { name: '可引用性', status: 'warning', score: 65, icon: <FileText /> },
          { name: 'AI 爬虫访问', status: 'pass', score: 90, icon: <Search /> },
          { name: '移动端友好', status: 'pass', score: 85, icon: <Shield /> },
          { name: '页面速度', status: 'warning', score: 72, icon: <Zap /> },
        ],
        quickTips: [
          '添加 llms.txt 文件',
          '优化图片加载速度',
          '增加数据引用来源',
        ],
      });
      setIsLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
            <Clock className="w-4 h-4" />
            60 秒快速检测
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">快速 GEO 检测</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            快速检查您网站的 AI 搜索可见性，获得即时优化建议
          </p>
        </div>

        {!result && !isLoading && (
          <div className="max-w-xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <input
                    type="url"
                    placeholder="https://your-website.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button
                    onClick={handleQuickCheck}
                    disabled={!url}
                    className="w-full"
                    size="lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    开始快速检测
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-indigo-50 text-indigo-700 rounded-lg mb-4">
              <Zap className="w-6 h-6 animate-pulse" />
              <span className="font-semibold">正在快速检测...</span>
            </div>
            <p className="text-slate-600">只需 60 秒</p>
          </div>
        )}

        {result && (
          <div className="space-y-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ScoreCircle score={result.score} label="快速评分" size="lg" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      检测结果：{result.url}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {result.checks.map((check: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                          <div className="text-indigo-600">{check.icon}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">{check.name}</span>
                              {getStatusIcon(check.status)}
                            </div>
                            <div className="text-sm text-slate-600">{check.score}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>快速优化建议</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.quickTips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-slate-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-slate-600 mb-4">需要更全面的分析？</p>
              <Button onClick={() => {}} size="lg">
                进行完整审计
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
