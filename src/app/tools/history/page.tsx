'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, History, CheckCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function HistoryPage() {
  const [audits, setAudits] = useState<any[]>([]);

  useEffect(() => {
    const mockHistory = [
      {
        id: '1',
        url: 'https://example.com',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        score: 72,
        categories: ['AI 可见性', '技术 SEO', '内容质量', 'Schema 标记', '平台优化']
      },
      {
        id: '2',
        url: 'https://test-site.org',
        date: new Date(Date.now() - 48 * 60 * 60 * 1000),
        score: 65,
        categories: ['AI 可见性', '技术 SEO', '内容质量', 'Schema 标记', '平台优化']
      },
      {
        id: '3',
        url: 'https://blog-site.dev',
        date: new Date(Date.now() - 72 * 60 * 60 * 1000),
        score: 88,
        categories: ['AI 可见性', '技术 SEO', '内容质量', 'Schema 标记', '平台优化']
      }
    ];
    setAudits(mockHistory);
  }, []);

  const deleteAudit = (id: string) => {
    setAudits(audits.filter(a => a.id !== id));
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
          <History className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">审计历史记录</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            查看和管理您的所有 GEO-SEO 审计历史
          </p>
        </div>

        {audits.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">暂无审计记录</h3>
              <p className="text-slate-500 mb-6">开始进行您的第一次 GEO-SEO 审计</p>
              <Link href="/audit">
                <Button>
                  开始审计
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {audits.map((audit) => (
              <Card key={audit.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{audit.url}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {audit.date.toLocaleDateString('zh-CN')} {audit.date.toLocaleTimeString('zh-CN')}
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          {audit.categories.length} 项检测
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold" style={{ color: getScoreColor(audit.score) }}>
                          {audit.score}
                        </div>
                        <div className="text-sm text-slate-600">总分</div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50" onClick={() => deleteAudit(audit.id)}>
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center">
              <Button variant="outline">
                加载更多
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
