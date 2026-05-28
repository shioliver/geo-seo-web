'use client';

import { useState } from 'react';
import { Settings2, Key, Globe, Cpu, Eye, EyeOff, Check, Zap, ExternalLink, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import type { ApiConfig } from '@/hooks/useApiConfig';

interface ApiConfigPanelProps {
  config: ApiConfig;
  onConfigChange: (partial: Partial<ApiConfig>) => void;
}

const modelOptions: Record<string, { label: string; models: { value: string; label: string }[] }> = {
  deepseek: {
    label: 'DeepSeek',
    models: [
      { value: 'deepseek-chat', label: 'DeepSeek-V3 (推荐)' },
      { value: 'deepseek-reasoner', label: 'DeepSeek-R1 (推理增强)' },
    ],
  },
  openai: {
    label: 'OpenAI 兼容',
    models: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    ],
  },
  custom: {
    label: '自定义',
    models: [],
  },
};

export function ApiConfigPanel({ config, onConfigChange }: ApiConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latency?: string;
    reply?: string;
    model?: string;
  } | null>(null);

  const providerInfo = modelOptions[config.provider];

  const handleTestConnection = async () => {
    if (!config.apiKey.trim()) {
      setTestResult({ success: false, message: '请先填写 API Key' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    setTestDialogOpen(true);

    try {
      const response = await fetch('/api/test-api-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: config.apiKey,
          baseUrl: config.baseUrl,
          model: config.model,
        }),
      });
      const result = await response.json();
      setTestResult(result);
    } catch {
      setTestResult({ success: false, message: '网络请求失败，请检查网络连接' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-slate-200">AI 分析配置</div>
              <div className="text-xs text-slate-500">
                {config.apiKey
                  ? `${providerInfo.label} · ${config.model}`
                  : '点击配置 DeepSeek API 以启用 AI 分析'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {config.apiKey ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                已配置
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-amber-400">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                待配置
              </span>
            )}
            <Settings2 className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="px-6 pb-6 border-t border-slate-700/50 pt-5 space-y-5">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-2 block">API 提供商</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'deepseek', label: 'DeepSeek', icon: Zap },
                  { value: 'openai', label: 'OpenAI 兼容', icon: Cpu },
                  { value: 'custom', label: '自定义', icon: Globe },
                ] as const).map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => onConfigChange({ provider: value } as Partial<ApiConfig>)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all border ${
                      config.provider === value
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-[#1e293b] border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {config.provider === 'deepseek' && (
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-300 mb-1">获取 DeepSeek API Key</div>
                    <ol className="text-xs text-blue-200/70 space-y-1">
                      <li>1. 访问 <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="underline">platform.deepseek.com</a> 注册</li>
                      <li>2. 进入「API Keys」页面创建新 Key</li>
                      <li>3. 复制 Key 粘贴到下方输入框</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-slate-400 mb-2">
                <Key className="w-3 h-3" />
                API Key
              </label>
              <div className="relative">
                <Input
                  type={showKey ? 'text' : 'password'}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                  value={config.apiKey}
                  onChange={(e) => onConfigChange({ apiKey: e.target.value })}
                  className="pr-10 bg-[#1e293b] border-slate-600 text-slate-100 placeholder:text-slate-600 font-mono text-sm"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {config.provider === 'custom' && (
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-slate-400 mb-2">
                  <Globe className="w-3 h-3" />
                  Base URL
                </label>
                <Input
                  placeholder="https://api.example.com"
                  value={config.baseUrl}
                  onChange={(e) => onConfigChange({ baseUrl: e.target.value })}
                  className="bg-[#1e293b] border-slate-600 text-slate-100 placeholder:text-slate-600 text-sm"
                />
              </div>
            )}

            {providerInfo.models.length > 0 && (
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-slate-400 mb-2">
                  <Cpu className="w-3 h-3" />
                  模型
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {providerInfo.models.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => onConfigChange({ model: m.value })}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all border ${
                        config.model === m.value
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                          : 'bg-[#1e293b] border-slate-600 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {m.label}
                      {config.model === m.value && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                onClick={handleTestConnection}
                disabled={!config.apiKey.trim()}
                className="flex items-center gap-2 bg-[#1e293b] border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-sm px-4 py-2"
              >
                <Wifi className="w-3.5 h-3.5" />
                测试连接
              </Button>
              <span className="text-xs text-slate-500">
                {config.apiKey ? '● 已就绪' : '○ 未配置'}
              </span>
            </div>

            <div className="text-xs text-slate-500">
              API Key 仅保存在浏览器本地，不会上传到服务器
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={testDialogOpen}
        onClose={() => {
          if (!testing) setTestDialogOpen(false);
        }}
        title="API 连接测试"
      >
        {testing ? (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-4" />
            <p className="text-sm text-slate-300">正在连接 {providerInfo.label} API...</p>
            <p className="text-xs text-slate-500 mt-1">模型: {config.model}</p>
          </div>
        ) : testResult ? (
          <div className="space-y-4">
            <div className={`flex items-start gap-3 p-4 rounded-xl ${
              testResult.success
                ? 'bg-emerald-500/10 border border-emerald-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}>
              {testResult.success ? (
                <Wifi className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className={`text-sm font-medium ${testResult.success ? 'text-emerald-300' : 'text-red-300'}`}>
                  {testResult.success ? '连接成功' : '连接失败'}
                </div>
                <div className={`text-xs mt-1 ${testResult.success ? 'text-emerald-200/70' : 'text-red-200/70'}`}>
                  {testResult.message}
                </div>
              </div>
            </div>

            {testResult.success && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">响应延迟</span>
                  <span className="text-slate-200 font-mono">{testResult.latency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">模型</span>
                  <span className="text-slate-200 font-mono">{testResult.model}</span>
                </div>
                {testResult.reply && (
                  <div className="mt-3">
                    <span className="text-xs text-slate-500">模型回复</span>
                    <div className="mt-1 p-3 bg-slate-800/50 rounded-lg text-sm text-slate-300">
                      {testResult.reply}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setTestDialogOpen(false)}
                className="px-4 py-2 text-sm bg-slate-700 text-slate-200 hover:bg-slate-600"
              >
                关闭
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
