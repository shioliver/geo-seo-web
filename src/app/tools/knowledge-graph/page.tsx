'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Map, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function KnowledgeGraphPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        entities: { count: Math.floor(Math.random() * 20), score: Math.floor(Math.random() * 100) },
        relationships: { count: Math.floor(Math.random() * 30), score: Math.floor(Math.random() * 100) },
        schemaOrg: { hasOrganization: Math.random() > 0.5, hasArticle: Math.random() > 0.5, score: Math.floor(Math.random() * 100) },
        recommendations: [
          '添加明确的实体标记',
          '增强实体之间的关系',
          '使用标准的 Schema.org 类型',
          '确保实体描述准确'
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
          <Map className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">知识图谱兼容性</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            评估网站与 Google 知识图谱等 AI 知识系统的兼容性
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
              <p className="text-slate-600">正在分析知识图谱兼容性...</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Hash className="w-8 h-8 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">实体</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>识别数</span>
                      <span>{result.entities.count}</span>
                    </div>
                    <div>
                      <div className="text-center text-2xl font-bold mb-1" style={{ color: getScoreColor(result.entities.score) }}>
                        {result.entities.score}
                      </div>
                      <div className="text-xs text-slate-500 text-center">兼容性</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Hash className="w-8 h-8 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">关系</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>识别数</span>
                      <span>{result.relationships.count}</span>
                    </div>
                    <div>
                      <div className="text-center text-2xl font-bold mb-1" style={{ color: getScoreColor(result.relationships.score) }}>
                        {result.relationships.score}
                      </div>
                      <div className="text-xs text-slate-500 text-center">兼容性</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Hash className="w-8 h-8 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Schema.org</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        {result.schemaOrg.hasOrganization ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 border border-slate-300 rounded" />}
                        <span className="text-slate-600">Organization</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {result.schemaOrg.hasArticle ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 border border-slate-300 rounded" />}
                        <span className="text-slate-600">Article</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-center text-2xl font-bold mb-1" style={{ color: getScoreColor(result.schemaOrg.score) }}>
                        {result.schemaOrg.score}
                      </div>
                      <div className="text-xs text-slate-500 text-center">完整性</div>
                    </div>
                  </div>
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
