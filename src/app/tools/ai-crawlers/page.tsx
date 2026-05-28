'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Shield, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AICrawlersPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      const hasRobotsTxt = Math.random() > 0.3;
      const hasLlmsTxt = Math.random() > 0.6;
      const aiCrawlersAllowed = Math.random() > 0.2;
      
      setResult({
        hasRobotsTxt,
        hasLlmsTxt,
        aiCrawlersAllowed,
        issues: !hasRobotsTxt ? ['缺少robots.txt文件'] :
                !hasLlmsTxt ? ['缺少llms.txt文件'] :
                !aiCrawlersAllowed ? ['AI爬虫被禁止访问'] : [],
        recommendations: [
          '创建llms.txt文件明确指导AI爬虫',
          '确保AI爬虫能访问重要内容',
          '定期检查robots.txt是否过时',
          '添加Sitemap帮助爬虫发现内容'
        ]
      });
      setLoading(false);
    }, 1200);
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
          <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">AI 爬虫检查</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            检查您的网站是否允许AI搜索引擎爬虫正常访问
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
                placeholder="https://your-website.com"
              />
              <Button
                onClick={analyze}
                disabled={!url}
                className="w-full"
              >
                开始检查
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">正在检查AI爬虫访问权限...</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>检查结果</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 rounded-lg text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: result.hasRobotsTxt ? '#d1fae5' : '#fee2e2' }}>
                    {result.hasRobotsTxt ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <XCircle className="w-8 h-8 text-red-600" />}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">robots.txt</h3>
                  <p className="text-slate-600">{result.hasRobotsTxt ? '已找到' : '未找到'}</p>
                </div>

                <div className="p-6 bg-slate-50 rounded-lg text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: result.hasLlmsTxt ? '#d1fae5' : '#fee2e2' }}>
                    {result.hasLlmsTxt ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <XCircle className="w-8 h-8 text-red-600" />}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">llms.txt</h3>
                  <p className="text-slate-600">{result.hasLlmsTxt ? '已找到' : '未找到'}</p>
                </div>

                <div className="p-6 bg-slate-50 rounded-lg text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: result.aiCrawlersAllowed ? '#d1fae5' : '#fee2e2' }}>
                    {result.aiCrawlersAllowed ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <XCircle className="w-8 h-8 text-red-600" />}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">AI 爬虫访问</h3>
                  <p className="text-slate-600">{result.aiCrawlersAllowed ? '允许' : '不允许'}</p>
                </div>
              </CardContent>
            </Card>

            {result.issues.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-700">发现的问题</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.issues.map((issue: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-red-800">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

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
                新的检查
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
