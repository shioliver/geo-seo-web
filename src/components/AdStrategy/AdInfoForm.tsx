'use client';

import { useState } from 'react';
import { Sparkles, Users, Plus, X, DollarSign, Building2, MapPin, Target, ArrowRight, Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import type { AdFormData } from '@/lib/types';

interface AdInfoFormProps {
  formData: AdFormData;
  onFormChange: (data: AdFormData) => void;
  onNext: () => void;
}

const platformOptions = [
  { name: '抖音', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30', activeColor: 'bg-rose-500 text-white border-rose-500' },
  { name: '小红书', color: 'bg-red-500/20 text-red-400 border-red-500/30', activeColor: 'bg-red-500 text-white border-red-500' },
  { name: '快手', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', activeColor: 'bg-orange-500 text-white border-orange-500' },
  { name: '微博', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', activeColor: 'bg-amber-500 text-white border-amber-500' },
  { name: '微信', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', activeColor: 'bg-emerald-500 text-white border-emerald-500' },
  { name: 'B站', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30', activeColor: 'bg-sky-500 text-white border-sky-500' },
  { name: '知乎', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', activeColor: 'bg-blue-500 text-white border-blue-500' },
  { name: '淘宝', color: 'bg-orange-600/20 text-orange-300 border-orange-600/30', activeColor: 'bg-orange-600 text-white border-orange-600' },
];

const budgetPresets = [
  { value: 1000, label: '1,000', desc: '基础' },
  { value: 5000, label: '5,000', desc: '标准' },
  { value: 10000, label: '1万', desc: '进阶' },
  { value: 50000, label: '5万', desc: '专业' },
];

export function AdInfoForm({ formData, onFormChange, onNext }: AdInfoFormProps) {
  const [customPlatform, setCustomPlatform] = useState('');

  const selectedPlatforms = formData.platforms;

  const togglePlatform = (name: string) => {
    const idx = selectedPlatforms.indexOf(name);
    if (idx > -1) {
      onFormChange({ ...formData, platforms: selectedPlatforms.filter((_, i) => i !== idx) });
    } else {
      onFormChange({ ...formData, platforms: [...selectedPlatforms, name] });
    }
  };

  const addCustomPlatform = () => {
    if (customPlatform.trim() && !selectedPlatforms.includes(customPlatform.trim())) {
      onFormChange({ ...formData, platforms: [...selectedPlatforms, customPlatform.trim()] });
      setCustomPlatform('');
    }
  };

  const isFormValid = formData.ad_topic.trim() && formData.ad_goal.trim();

  return (
    <Card className="bg-[#0f172a] border-slate-700/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="border-b border-slate-700/50 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">广告计划目标</h2>
              <p className="text-sm text-slate-400">填写基本信息，AI 将智能生成策略参数</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-5">
                <Target className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">核心信息</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-300">
                    广告主题
                    <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="例如：XX品牌夏季新品直播间专场"
                    value={formData.ad_topic}
                    onChange={(e) => onFormChange({ ...formData, ad_topic: e.target.value })}
                    className={`bg-[#1e293b] border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20${
                      formData.ad_topic.trim() ? ' border-indigo-500/50' : ''
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-300">
                    广告目标
                    <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="例如：提升直播间人气、增加商品销量"
                    value={formData.ad_goal}
                    onChange={(e) => onFormChange({ ...formData, ad_goal: e.target.value })}
                    className={`bg-[#1e293b] border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20${
                      formData.ad_goal.trim() ? ' border-indigo-500/50' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-slate-400">广告计划描述</label>
                <textarea
                  placeholder="描述您的投放策略、时间安排、核心卖点等（选填，填写后AI分析更精准）"
                  value={formData.ad_plan}
                  onChange={(e) => onFormChange({ ...formData, ad_plan: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#1e293b] border border-slate-600 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 resize-none transition-colors"
                  rows={4}
                />
              </div>
            </section>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

            <section>
              <div className="flex items-center gap-2 mb-5">
                <Building2 className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">品牌信息</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">品牌名称</label>
                  <Input
                    placeholder="输入品牌名称"
                    value={formData.brand_info.name}
                    onChange={(e) => onFormChange({
                      ...formData,
                      brand_info: { ...formData.brand_info, name: e.target.value }
                    })}
                    className="bg-[#1e293b] border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">品牌定位</label>
                  <Input
                    placeholder="例如：高端护肤品牌"
                    value={formData.brand_info.positioning}
                    onChange={(e) => onFormChange({
                      ...formData,
                      brand_info: { ...formData.brand_info, positioning: e.target.value }
                    })}
                    className="bg-[#1e293b] border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">目标受众</label>
                  <Input
                    placeholder="例如：25-35岁都市女性"
                    value={formData.brand_info.target_audience}
                    onChange={(e) => onFormChange({
                      ...formData,
                      brand_info: { ...formData.brand_info, target_audience: e.target.value }
                    })}
                    className="bg-[#1e293b] border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

            <section>
              <div className="flex items-center gap-2 mb-5">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">投放设置</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-300 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    投放平台
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {platformOptions.map((platform) => {
                      const isSelected = selectedPlatforms.includes(platform.name);
                      return (
                        <button
                          key={platform.name}
                          onClick={() => togglePlatform(platform.name)}
                          className={`relative px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                            isSelected
                              ? platform.activeColor
                              : `${platform.color} border`
                          } hover:scale-[1.02] active:scale-[0.98]`}
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            {isSelected && <Check className="w-3 h-3" />}
                            {platform.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="添加其他平台"
                      value={customPlatform}
                      onChange={(e) => setCustomPlatform(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomPlatform()}
                      className="flex-1 bg-[#1e293b] border-slate-600 text-slate-100 placeholder:text-slate-500 text-sm"
                    />
                    <Button onClick={addCustomPlatform} className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {selectedPlatforms.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedPlatforms.map((p, idx) => {
                        const config = platformOptions.find(po => po.name === p);
                        return (
                          <span
                            key={idx}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${config?.activeColor || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}
                          >
                            {p}
                            <button
                              onClick={() => onFormChange({ ...formData, platforms: selectedPlatforms.filter((_, i) => i !== idx) })}
                              className="ml-0.5 hover:bg-white/10 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-300 mb-3">
                    <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                    投放预算
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {budgetPresets.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => onFormChange({ ...formData, budget: preset.value })}
                        className={`p-2.5 rounded-lg text-center transition-all duration-200 border ${
                          formData.budget === preset.value
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-500/20'
                            : 'bg-[#1e293b] border-slate-600 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="text-sm font-bold">{preset.label}</div>
                        <div className="text-xs opacity-70">{preset.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-sm">¥</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="自定义金额"
                      value={formData.budget || ''}
                      onChange={(e) => onFormChange({ ...formData, budget: Number(e.target.value) })}
                      className="pl-8 bg-[#1e293b] border-slate-600 text-slate-100 placeholder:text-slate-500"
                    />
                  </div>
                  {formData.budget > 0 && (
                    <p className="mt-2 text-xs text-slate-500">
                      总预算 {formData.budget.toLocaleString()} 元，建议合理分配到各平台投放
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-700/50">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1">
                {isFormValid ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">必填项已完成</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    请填写广告主题和目标
                  </>
                )}
              </span>
            </div>
            <Button
              onClick={onNext}
              disabled={!isFormValid}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
              size="lg"
            >
              下一步，配置投放策略
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
