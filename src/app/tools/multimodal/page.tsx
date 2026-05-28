'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Image, Video, FileAudio, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function MultimodalPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        images: { count: Math.floor(Math.random() * 50), optimized: Math.random() > 0.5, score: Math.floor(Math.random() * 100) },
        videos: { count: Math.floor(Math.random() * 10), optimized: Math.random() > 0.5, score: Math.floor(Math.random() * 100) },
        audio: { count: Math.floor(Math.random() * 5), optimized: Math.random() > 0.5, score: Math.floor(Math.random() * 100) },
        recommendations: [
          '为所有图片添加描述性 alt 文本',
          '优化图片文件大小',
          '为视频添加字幕和描述',
          '确保音频内容有文字转录',
          '使用响应式图片'
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
          <Image className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">多模态优化</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            优化网站的图片、视频和音频内容，提升 AI 搜索能力
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
              <p className="text-slate-600">正在分析多模态内容...</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Image className="w-8 h-8 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">图片</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>数量</span>
                      <span>{result.images.count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">优化状态</span>
                      <span className="text-sm font-medium flex items-center gap-2">
                        {result.images.optimized ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                        {result.images.optimized ? '已优化' : '需优化'}
                      </span>
                    </div>
                    <div>
                      <div className="text-center text-2xl font-bold mb-1" style={{ color: getScoreColor(result.images.score) }}>
                        {result.images.score}
                      </div>
                      <div className="text-xs text-slate-500 text-center">评分</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Video className="w-8 h-8 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">视频</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>数量</span>
                      <span>{result.videos.count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">优化状态</span>
                      <span className="text-sm font-medium flex items-center gap-2">
                        {result.videos.optimized ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                        {result.videos.optimized ? '已优化' : '需优化'}
                      </span>
                    </div>
                    <div>
                      <div className="text-center text-2xl font-bold mb-1" style={{ color: getScoreColor(result.videos.score) }}>
                        {result.videos.score}
                      </div>
                      <div className="text-xs text-slate-500 text-center">评分</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileAudio className="w-8 h-8 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">音频</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>数量</span>
                      <span>{result.audio.count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">优化状态</span>
                      <span className="text-sm font-medium flex items-center gap-2">
                        {result.audio.optimized ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                        {result.audio.optimized ? '已优化' : '需优化'}
                      </span>
                    </div>
                    <div>
                      <div className="text-center text-2xl font-bold mb-1" style={{ color: getScoreColor(result.audio.score) }}>
                        {result.audio.score}
                      </div>
                      <div className="text-xs text-slate-500 text-center">评分</div>
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
