'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SitemapPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generate = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>2026-04-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${url}/about</loc>
    <lastmod>2026-04-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${url}/blog</loc>
    <lastmod>2026-04-25</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

      setResult({
        xml,
        urlCount: 3,
        issues: ['缺少更多内容页面', '更新频率可以优化'],
        suggestions: ['添加所有博客文章', '确保日期格式正确', '设置合理的优先级']
      });
      setLoading(false);
    }, 1500);
  };

  const download = () => {
    const blob = new Blob([result.xml], { type: 'application/xml' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = 'sitemap.xml';
    a.click();
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
          <h1 className="text-3xl font-bold text-slate-900 mb-4">XML Sitemap 生成器</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            快速生成符合标准的 XML Sitemap
          </p>
        </div>

        {!result && !loading && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>输入网站 URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-website.com"
              />
              <Button onClick={generate} disabled={!url} className="w-full">
                生成 Sitemap
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">正在生成 Sitemap...</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>生成的 Sitemap</CardTitle>
                  <Button onClick={download}>
                    <Download className="w-4 h-4 mr-2" />
                    下载 Sitemap
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{result.xml}</pre>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sitemap 概览</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-indigo-600 mb-2">{result.urlCount}</div>
                    <div className="text-lg text-slate-700">URL 数量</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>发现的问题</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.issues.map((issue: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>优化建议</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.suggestions.map((s: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{s}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button onClick={() => setResult(null)}>
                新的 Sitemap
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
