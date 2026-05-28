'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target, ChevronRight, History, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AdInfoForm } from '@/components/AdStrategy/AdInfoForm';
import { AdStrategyConfig } from '@/components/AdStrategy/AdStrategyConfig';
import { AnalysisResultComponent } from '@/components/AdStrategy/AnalysisResult';
import { ApiConfigPanel } from '@/components/AdStrategy/ApiConfigPanel';
import { HistoryPanel } from '@/components/AdStrategy/HistoryPanel';
import { useStrategyHistory, type HistoryEntry } from '@/hooks/useStrategyHistory';
import { useApiConfig } from '@/hooks/useApiConfig';
import { exportToPDF } from '@/lib/export-pdf';
import type { AdFormData, AdStrategy, AnalysisResult } from '@/lib/types';

type Step = 'info' | 'strategy' | 'analysis';

const defaultFormData: AdFormData = {
  ad_topic: '',
  ad_goal: '',
  ad_plan: '',
  brand_info: { name: '', positioning: '', target_audience: '' },
  budget: 0,
  platforms: [],
};

const defaultStrategy: AdStrategy = {
  creative_form: 'video',
  delivery_method: 'cost_control',
  heating_target: 'conversion',
  delivery_time: 'long_term',
  delivery_period: 'long_term',
  daily_budget: '500',
  target_audience: {
    region: '',
    gender: 'all',
    age: '',
    interests: [],
    network: 'all',
    platform: 'all',
  },
};

export default function AdOptimizerPage() {
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AdFormData>({ ...defaultFormData });
  const [strategyData, setStrategyData] = useState<AdStrategy>({ ...defaultStrategy });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const { history, addEntry, deleteEntry, clearHistory } = useStrategyHistory();
  const { config, updateConfig, isConfigured } = useApiConfig();

  const handleNextStep = () => {
    if (currentStep === 'info') {
      setCurrentStep('strategy');
    } else if (currentStep === 'strategy') {
      generateAnalysis();
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'strategy') {
      setCurrentStep('info');
    } else if (currentStep === 'analysis') {
      setCurrentStep('strategy');
      setAnalysisResult(null);
    }
  };

  const generateAnalysis = async () => {
    setIsLoading(true);
    setAiError(null);
    setCurrentStep('analysis');

    try {
      const body: Record<string, any> = { formData, strategy: strategyData };

      if (isConfigured) {
        body.apiKey = config.apiKey;
        body.baseUrl = config.baseUrl;
        body.model = config.model;
      }

      const response = await fetch('/api/ad-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.error) {
        setAiError(result.error);
        setAnalysisResult(generateMockResult());
      } else {
        if (result.summary?.startsWith('⚠️')) {
          setAiError(result.summary);
        }
        setAnalysisResult(result);
        addEntry(formData, strategyData, result);
      }
    } catch (error) {
      console.error('分析失败:', error);
      setAiError('网络请求失败，请检查网络连接');
      setAnalysisResult(generateMockResult());
    }

    setIsLoading(false);
  };

  const handleLoadHistory = useCallback((entry: HistoryEntry) => {
    setFormData(entry.formData);
    setStrategyData(entry.strategy);
    setAnalysisResult(entry.result);
    setCurrentStep('analysis');
  }, []);

  const handleNewAnalysis = () => {
    setCurrentStep('info');
    setAnalysisResult(null);
    setAiError(null);
    setFormData({ ...defaultFormData });
    setStrategyData({ ...defaultStrategy });
  };

  const handleExport = async () => {
    if (!analysisResult) return;
    const topic = formData.ad_topic || '广告策略';
    await exportToPDF(
      {
        topic: formData.ad_topic,
        goal: formData.ad_goal,
        brand: formData.brand_info.name,
        platforms: formData.platforms,
        budget: formData.budget,
        result: analysisResult,
      },
      `${topic}-分析报告.pdf`
    );
  };

  const generateMockResult = (): AnalysisResult => ({
    overall_score: 72,
    summary: '策略分析完成。建议优化投放时段和受众定向以获得更好效果。\n\n💡 配置 DeepSeek API Key 可获得 AI 深度分析。',
    competitor_insight: '竞品多集中在主流平台，建议差异化竞争。',
    competitors: [
      { name: '竞品A', budget_level: '高', creative_style: '短视频+直播', positioning: '高端', target_audience: '25-35岁女性', ad_strategy: '达人+信息流', advantages: ['品牌力强'], disadvantages: ['价格高'] },
      { name: '竞品B', budget_level: '中', creative_style: '图文种草', positioning: '性价比', target_audience: '18-28岁', ad_strategy: '达人矩阵', advantages: ['性价比'], disadvantages: ['品牌力弱'] },
    ],
    comparison: {
      '创意形式': { score: 82, suggestion: '视频引流效果好，建议高质量内容。' },
      '投放方式': { score: 75, suggestion: '控成本投放合适，可尝试放量测试。' },
      '加热目标': { score: 85, suggestion: '以转化为目标方向正确。' },
      '投放时间': { score: 65, suggestion: '建议设置具体投放时段。' },
      '日预算': { score: 70, suggestion: '预算合理，可动态调整。' },
      '目标受众': { score: 78, suggestion: '受众定位可进一步细化。' },
    },
  });

  return (
    <div className="min-h-screen bg-[#020617] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-sm font-medium mb-4">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-400">
              {isConfigured ? 'DeepSeek AI 驱动' : 'AI 智能优化'}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-4">广告策略优化</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            智能分析广告投放策略，{isConfigured ? 'DeepSeek AI' : 'AI'} 生成优化建议，提升广告效果与 ROI
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${currentStep === 'info' ? 'text-indigo-400' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'info' ? 'bg-indigo-500 text-white' : 'bg-slate-700'}`}>1</div>
            <span>基本信息</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-600" />
          <div className={`flex items-center gap-2 ${currentStep === 'strategy' || currentStep === 'analysis' ? 'text-indigo-400' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'strategy' || currentStep === 'analysis' ? 'bg-indigo-500 text-white' : 'bg-slate-700'}`}>2</div>
            <span>策略配置</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-600" />
          <div className={`flex items-center gap-2 ${currentStep === 'analysis' ? 'text-indigo-400' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'analysis' ? 'bg-indigo-500 text-white' : 'bg-slate-700'}`}>3</div>
            <span>分析结果</span>
          </div>
        </div>

        {currentStep !== 'analysis' && (
          <div className="mb-6">
            <ApiConfigPanel config={config} onConfigChange={updateConfig} />
          </div>
        )}

        {currentStep === 'info' && !isLoading && (
          <AdInfoForm
            formData={formData}
            onFormChange={setFormData}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 'strategy' && !isLoading && (
          <AdStrategyConfig
            strategy={strategyData}
            onStrategyChange={setStrategyData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {currentStep === 'analysis' && isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-300 text-lg">AI 正在分析您的广告策略...</p>
              <p className="text-slate-500 text-sm mt-2">
                {isConfigured ? 'DeepSeek AI 深度分析中，请稍候' : '使用本地规则引擎快速分析'}
              </p>
            </div>
          </div>
        )}

        {currentStep === 'analysis' && !isLoading && analysisResult && (
          <>
            {aiError && (
              <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-300">
                ⚠️ {aiError.includes('⚠️') ? aiError.replace('⚠️ ', '') : aiError}
              </div>
            )}

            <div>
              <AnalysisResultComponent
                result={analysisResult}
                onNewAnalysis={handleNewAnalysis}
                onExport={handleExport}
              />
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <History className="w-4 h-4" />
                历史记录
              </div>
              <HistoryPanel
                history={history}
                onLoad={handleLoadHistory}
                onDelete={deleteEntry}
                onClear={clearHistory}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
