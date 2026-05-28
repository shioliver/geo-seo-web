'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, FileText, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LlmstxtData {
  siteUrl: string;
  siteName: string;
  description: string;
  allow: string[];
  disallow: string[];
  preferredPages: string[];
  contact: string;
}

export default function LlmsTxtGeneratorPage() {
  const [data, setData] = useState<LlmstxtData>({
    siteUrl: '',
    siteName: '',
    description: '',
    allow: ['/'],
    disallow: ['/private', '/admin'],
    preferredPages: [],
    contact: '',
  });
  const [copied, setCopied] = useState(false);
  const [newAllow, setNewAllow] = useState('');
  const [newDisallow, setNewDisallow] = useState('');
  const [newPreferred, setNewPreferred] = useState('');

  const generateLlmsTxt = () => {
    let content = `# llms.txt - ${data.siteName}

`;

    if (data.description) {
      content += `## About
${data.description}

`;
    }

    content += `## Base URL
${data.siteUrl}

`;

    if (data.allow.length > 0) {
      content += `## Allow
${data.allow.map(path => `- ${path}`).join('\n')}

`;
    }

    if (data.disallow.length > 0) {
      content += `## Disallow
${data.disallow.map(path => `- ${path}`).join('\n')}

`;
    }

    if (data.preferredPages.length > 0) {
      content += `## Preferred Pages
${data.preferredPages.map(path => `- ${path}`).join('\n')}

`;
    }

    if (data.contact) {
      content += `## Contact
${data.contact}

`;
    }

    content += `## Documentation
This file helps AI models understand the structure of ${data.siteName}.

`;

    return content;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateLlmsTxt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addAllow = () => {
    if (newAllow) {
      setData({ ...data, allow: [...data.allow, newAllow] });
      setNewAllow('');
    }
  };

  const addDisallow = () => {
    if (newDisallow) {
      setData({ ...data, disallow: [...data.disallow, newDisallow] });
      setNewDisallow('');
    }
  };

  const addPreferred = () => {
    if (newPreferred) {
      setData({ ...data, preferredPages: [...data.preferredPages, newPreferred] });
      setNewPreferred('');
    }
  };

  const removePath = (type: 'allow' | 'disallow' | 'preferred', index: number) => {
    if (type === 'allow') {
      setData({ ...data, allow: data.allow.filter((_, i) => i !== index) });
    } else if (type === 'disallow') {
      setData({ ...data, disallow: data.disallow.filter((_, i) => i !== index) });
    } else {
      setData({ ...data, preferredPages: data.preferredPages.filter((_, i) => i !== index) });
    }
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
          <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">llms.txt 生成器</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            为 AI 爬虫创建专门的指引文件，帮助 AI 更好地理解和引用您的网站内容
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>配置 llms.txt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-indigo-900 mb-1">什么是 llms.txt？</p>
                    <p className="text-indigo-700">
                      llms.txt 是为 AI 爬虫准备的文件，类似于 robots.txt，但专门为了让 AI 更好地理解您的网站结构和内容。
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">网站 URL *</label>
                  <Input
                    value={data.siteUrl}
                    onChange={(e) => setData({ ...data, siteUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">网站名称 *</label>
                  <Input
                    value={data.siteName}
                    onChange={(e) => setData({ ...data, siteName: e.target.value })}
                    placeholder="示例公司"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">网站描述</label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    placeholder="简要介绍您的网站，帮助 AI 理解您的内容"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">联系信息</label>
                  <Input
                    value={data.contact}
                    onChange={(e) => setData({ ...data, contact: e.target.value })}
                    placeholder="contact@example.com"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    允许 AI 访问的路径
                  </label>
                  <div className="space-y-2">
                    {data.allow.map((path, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-emerald-50 rounded text-sm">
                        <span className="text-emerald-700">{path}</span>
                        <button
                          onClick={() => removePath('allow', idx)}
                          className="text-emerald-600 hover:text-emerald-800"
                        >
                          移除
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newAllow}
                      onChange={(e) => setNewAllow(e.target.value)}
                      placeholder="/blog"
                      onKeyDown={(e) => e.key === 'Enter' && addAllow()}
                    />
                    <Button variant="outline" onClick={addAllow} disabled={!newAllow}>
                      添加
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    禁止 AI 访问的路径
                  </label>
                  <div className="space-y-2">
                    {data.disallow.map((path, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded text-sm">
                        <span className="text-red-700">{path}</span>
                        <button
                          onClick={() => removePath('disallow', idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          移除
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newDisallow}
                      onChange={(e) => setNewDisallow(e.target.value)}
                      placeholder="/private"
                      onKeyDown={(e) => e.key === 'Enter' && addDisallow()}
                    />
                    <Button variant="outline" onClick={addDisallow} disabled={!newDisallow}>
                      添加
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    优先推荐的页面
                  </label>
                  <div className="space-y-2">
                    {data.preferredPages.map((path, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-amber-50 rounded text-sm">
                        <span className="text-amber-700">{path}</span>
                        <button
                          onClick={() => removePath('preferred', idx)}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          移除
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newPreferred}
                      onChange={(e) => setNewPreferred(e.target.value)}
                      placeholder="/about"
                      onKeyDown={(e) => e.key === 'Enter' && addPreferred()}
                    />
                    <Button variant="outline" onClick={addPreferred} disabled={!newPreferred}>
                      添加
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>llms.txt 预览</CardTitle>
            </CardHeader>
            <CardContent>
              {data.siteUrl && data.siteName ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">llms.txt 已生成</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? '已复制' : '复制代码'}
                    </Button>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-[500px] overflow-y-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {generateLlmsTxt()}
                    </pre>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">使用方法</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                      <li>复制上面的内容</li>
                      <li>在网站根目录创建名为 <code className="bg-slate-200 px-1 py-0.5 rounded">llms.txt</code> 的文件</li>
                      <li>将内容粘贴进去并保存</li>
                      <li>确保可以通过 <code className="bg-slate-200 px-1 py-0.5 rounded">{data.siteUrl || 'https://example.com'}/llms.txt</code> 访问</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p>填写左侧表单来生成 llms.txt</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
