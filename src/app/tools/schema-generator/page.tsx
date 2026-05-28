'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Copy, Layout, FileCode, Settings, Code2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type SchemaType = 'organization' | 'localBusiness' | 'article' | 'product' | 'website' | 'softwareApplication';

interface SchemaData {
  type: SchemaType;
  name: string;
  url: string;
  description: string;
  logo: string;
  email?: string;
  phone?: string;
  address?: string;
  author?: string;
  datePublished?: string;
  price?: string;
  currency?: string;
}

export default function SchemaGeneratorPage() {
  const [schemaType, setSchemaType] = useState<SchemaType>('organization');
  const [schemaData, setSchemaData] = useState<SchemaData>({
    type: 'organization',
    name: '',
    url: '',
    description: '',
    logo: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const schemaTypes = [
    { id: 'organization', label: 'Organization', desc: '公司、组织、网站' },
    { id: 'localBusiness', label: 'Local Business', desc: '本地商家' },
    { id: 'article', label: 'Article', desc: '文章、博客' },
    { id: 'product', label: 'Product', desc: '电商产品' },
    { id: 'website', label: 'Website', desc: '网站基础' },
    { id: 'softwareApplication', label: 'Software', desc: '软件/应用' },
  ];

  const generateSchema = () => {
    let schema: any = {
      '@context': 'https://schema.org',
      '@type': schemaData.type.charAt(0).toUpperCase() + schemaData.type.slice(1),
      name: schemaData.name,
      url: schemaData.url,
      description: schemaData.description,
    };

    if (schemaData.logo) {
      schema.logo = schemaData.logo;
    }

    if (schemaData.type === 'organization' || schemaData.type === 'localBusiness') {
      if (schemaData.email) schema.email = schemaData.email;
      if (schemaData.phone) schema.telephone = schemaData.phone;
      if (schemaData.address) schema.address = schemaData.address;
    }

    if (schemaData.type === 'article' && schemaData.author) {
      schema.author = {
        '@type': 'Person',
        name: schemaData.author,
      };
      if (schemaData.datePublished) schema.datePublished = schemaData.datePublished;
    }

    if (schemaData.type === 'product' && schemaData.price) {
      schema.offers = {
        '@type': 'Offer',
        price: schemaData.price,
        priceCurrency: schemaData.currency || 'USD',
      };
    }

    if (schemaData.type === 'website') {
      schema.potentialAction = {
        '@type': 'SearchAction',
        target: `${schemaData.url}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      };
    }

    return schema;
  };

  const copyToClipboard = () => {
    const schema = generateSchema();
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Layout className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Schema 标记生成器</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            快速生成结构化数据，让 AI 搜索引擎更容易理解您的网站
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>配置 Schema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Schema 类型</label>
                <div className="grid grid-cols-2 gap-2">
                  {schemaTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSchemaType(type.id as SchemaType)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        schemaType === type.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{type.label}</div>
                      <div className="text-xs text-slate-500">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">名称 *</label>
                  <Input
                    value={schemaData.name}
                    onChange={(e) => setSchemaData({ ...schemaData, name: e.target.value })}
                    placeholder="您的公司或网站名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL *</label>
                  <Input
                    value={schemaData.url}
                    onChange={(e) => setSchemaData({ ...schemaData, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                  <textarea
                    value={schemaData.description}
                    onChange={(e) => setSchemaData({ ...schemaData, description: e.target.value })}
                    placeholder="简要描述您的业务或网站"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                  <Input
                    value={schemaData.logo}
                    onChange={(e) => setSchemaData({ ...schemaData, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                {(schemaData.type === 'organization' || schemaData.type === 'localBusiness') && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
                      <Input
                        value={schemaData.email || ''}
                        onChange={(e) => setSchemaData({ ...schemaData, email: e.target.value })}
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">电话</label>
                      <Input
                        value={schemaData.phone || ''}
                        onChange={(e) => setSchemaData({ ...schemaData, phone: e.target.value })}
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                )}

                {schemaData.type === 'article' && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">作者</label>
                      <Input
                        value={schemaData.author || ''}
                        onChange={(e) => setSchemaData({ ...schemaData, author: e.target.value })}
                        placeholder="张三"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">发布日期</label>
                      <Input
                        type="date"
                        value={schemaData.datePublished || ''}
                        onChange={(e) => setSchemaData({ ...schemaData, datePublished: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {schemaData.type === 'product' && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">价格</label>
                      <Input
                        value={schemaData.price || ''}
                        onChange={(e) => setSchemaData({ ...schemaData, price: e.target.value })}
                        placeholder="99.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">货币</label>
                      <select
                        value={schemaData.currency || 'USD'}
                        onChange={(e) => setSchemaData({ ...schemaData, currency: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option>USD</option>
                        <option>CNY</option>
                        <option>EUR</option>
                        <option>GBP</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setShowPreview(true)}
                className="w-full"
                disabled={!schemaData.name || !schemaData.url}
              >
                <Code2 className="w-4 h-4 mr-2" />
                生成 Schema
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schema 预览</CardTitle>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Schema 已生成</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? '已复制' : '复制代码'}
                    </Button>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm font-mono">
                      {JSON.stringify(generateSchema(), null, 2)}
                    </pre>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">使用方法</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                      <li>复制上面的 JSON-LD 代码</li>
                      <li>将其放在您网站的 <code className="bg-slate-200 px-1 py-0.5 rounded">&lt;head&gt;</code> 或 <code className="bg-slate-200 px-1 py-0.5 rounded">&lt;body&gt;</code> 中</li>
                      <li>用 <code className="bg-slate-200 px-1 py-0.5 rounded">&lt;script type="application/ld+json"&gt;</code> 包裹</li>
                      <li>用 Google Rich Results Test 验证</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <FileCode className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p>填充左侧表单，点击"生成 Schema"查看预览</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
