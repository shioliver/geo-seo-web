'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Zap, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setData({
      overall: 76,
      aiVisibility: 72,
      technical: 88,
      content: 70,
      schema: 65,
      historical: [
        { date: '1/26', score: 68 },
        { date: '2/2', score: 70 },
        { date: '2/9', score: 72 },
        { date: '2/16', score: 73 },
        { date: '2/23', score: 76 }
      ],
      alerts: [
        { type: 'warning', message: '内容新鲜度下降，建议更新' },
        { type: 'info', message: 'Schema 标记有优化机会' },
        { type: 'success', message: 'AI 爬虫访问正常' }
      ],
      keyTasks: [
        '添加 Organization Schema',
        '创建 llms.txt 文件',
        '更新最近 30 天的文章'
      ]
    });
  }, []);

  const getColor = (score: number) => {
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
          <Activity className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">SEO 健康度仪表盘</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            实时监控网站各项指标，掌握 SEO 健康状况
          </p>
        </div>

        {data && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">{data.overall}</div>
                  <div className="text-sm text-slate-600">总评分</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: getColor(data.aiVisibility) }}>
                    {data.aiVisibility}
                  </div>
                  <div className="text-sm text-slate-600">AI 可见性</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: getColor(data.technical) }}>
                    {data.technical}
                  </div>
                  <div className="text-sm text-slate-600">技术 SEO</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: getColor(data.content) }}>
                    {data.content}
                  </div>
                  <div className="text-sm text-slate-600">内容质量</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: getColor(data.schema) }}>
                    {data.schema}
                  </div>
                  <div className="text-sm text-slate-600">Schema</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>历史趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-slate-50 rounded-lg p-4 flex items-end gap-4">
                  {data.historical.map((d: any, idx: number) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-indigo-100 rounded-t-lg" style={{ height: `${d.score}%` }}>
                        <div className="w-full bg-indigo-600 rounded-t-lg" style={{ height: `${d.score}%` }} />
                      </div>
                      <div className="mt-2 text-sm text-slate-600">{d.date}</div>
                      <div className="text-xs text-slate-500">{d.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>重要提醒</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.alerts.map((alert: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
                        {alert.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
                        {alert.type === 'info' && <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
                        <span className="text-slate-700">{alert.message}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>关键任务</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.keyTasks.map((task: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
