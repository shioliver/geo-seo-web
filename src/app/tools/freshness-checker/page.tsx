'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CheckResult {
  overallScore: number;
  freshnessScore: number;
  updateFrequency: number;
  contentLength: number;
  recommendations: string[];
}

export default function FreshnessCheckerPage() {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  const mockCheck = async (checkUrl: string) => {
    setIsChecking(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const daysAgo = Math.floor(Math.random() * 90) + 5;
    const contentLength = Math.floor(Math.random() * 4000) + 500;
    
    const freshnessScore = Math.max(20, Math.min(100, 100 - daysAgo));
    const updateFrequency = Math.floor(Math.random() * 40) + 60;
    const contentScore = Math.min(100, 30 + Math.min(70, contentLength / 10));
    
    const recommendations: string[] = [];
    
    if (daysAgo > 30) {
      recommendations.push('更新内容以保持新鲜度，建议至少每30天更新一次重要页面');
    }
    if (contentLength < 1000) {
      recommendations.push('增加内容深度和长度，提升内容价值');
    }
    if (daysAgo < 7) {
      recommendations.push('很好！内容更新频率良好，继续保持');
    }
    
    setResult({
      overallScore: Math.round((freshnessScore + updateFrequency + contentScore) / 3),
      freshnessScore,
      updateFrequency,
      contentLength: contentScore,
      recommendations,
    });
    
    setIsChecking(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
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
          <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">内容新鲜度评分</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            评估您的内容新鲜度，为 AI 搜索引擎提供最新的内容参考
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>检查内容新鲜度</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">页面 URL</label>
              <div className="flex gap-3">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/blog/post"
                />
                <Button
                  onClick={() => mockCheck(url)}
                  disabled={!url || isChecking}
                >
                  {isChecking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      检查中...
                    </>
                  ) : (
                    '开始检查'
                  )}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900">关于内容新鲜度</p>
                  <p className="text-amber-700">
                    AI 搜索引擎更倾向于引用最近更新的内容。建议您的内容保持定期更新，以提高可引用性。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>检查结果</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-indigo-600 mb-2">
                      {result.overallScore}
                    </div>
                    <div className="text-slate-600">总评分</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">内容新鲜度</span>
                        <span className={`text-lg font-bold ${getScoreColor(result.freshnessScore)}`}>
                          {result.freshnessScore}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${getScoreBg(result.freshnessScore)}`}
                          style={{ width: `${result.freshnessScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">更新频率</span>
                        <span className={`text-lg font-bold ${getScoreColor(result.updateFrequency)}`}>
                          {result.updateFrequency}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${getScoreBg(result.updateFrequency)}`}
                          style={{ width: `${result.updateFrequency}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">内容深度</span>
                        <span className={`text-lg font-bold ${getScoreColor(result.contentLength)}`}>
                          {result.contentLength}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${getScoreBg(result.contentLength)}`}
                          style={{ width: `${result.contentLength}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    优化建议
                  </h4>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg">
              <h4 className="text-xl font-bold text-slate-900 mb-4">提升内容新鲜度的最佳实践</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <div className="text-emerald-600 font-semibold mb-2">定期更新</div>
                  <p className="text-slate-700">至少每30天更新一次重要页面内容</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <div className="text-emerald-600 font-semibold mb-2">显示日期</div>
                  <p className="text-slate-700">在页面上显示最后更新时间</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <div className="text-emerald-600 font-semibold mb-2">内容延伸</div>
                  <p className="text-slate-700">添加新内容、数据和见解</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
