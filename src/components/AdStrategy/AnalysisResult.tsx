'use client';

import { useState } from 'react';
import {
  TrendingUp, Award, AlertTriangle, Lightbulb,
  Download, Share2, RotateCcw, ChevronDown, ChevronUp,
  Shield, Zap, BarChart3, ThumbsUp, Info, FileText, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import type { AnalysisResult } from '@/lib/types';

interface AnalysisResultProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
  onExport: () => void;
}

const scoreTiers = [
  { min: 90, label: '卓越', color: 'emerald', tag: 'excellent', desc: '策略配置非常出色' },
  { min: 75, label: '优秀', color: 'cyan', tag: 'great', desc: '策略配置高于平均水平' },
  { min: 60, label: '良好', color: 'amber', tag: 'good', desc: '还有优化空间' },
  { min: 40, label: '中等', color: 'orange', tag: 'average', desc: '建议重点优化薄弱项' },
  { min: 0, label: '需优化', color: 'red', tag: 'poor', desc: '策略需要较大调整' },
];

function getScoreTier(score: number) {
  return scoreTiers.find(t => score >= t.min) || scoreTiers[scoreTiers.length - 1];
}

function ScoreWheel({ score }: { score: number }) {
  const tier = getScoreTier(score);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  const colorMap: Record<string, { stroke: string; bg: string; glow: string }> = {
    emerald: { stroke: '#34d399', bg: 'rgba(52,211,153,0.1)', glow: 'rgba(52,211,153,0.3)' },
    cyan: { stroke: '#22d3ee', bg: 'rgba(34,211,238,0.1)', glow: 'rgba(34,211,238,0.3)' },
    amber: { stroke: '#fbbf24', bg: 'rgba(251,191,36,0.1)', glow: 'rgba(251,191,36,0.3)' },
    orange: { stroke: '#fb923c', bg: 'rgba(251,146,60,0.1)', glow: 'rgba(251,146,60,0.3)' },
    red: { stroke: '#f87171', bg: 'rgba(248,113,113,0.1)', glow: 'rgba(248,113,113,0.3)' },
  };

  const colors = colorMap[tier.color];

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(51,65,85,0.5)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r="52"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${colors.glow})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white">{score}</span>
        <span className="text-xs text-slate-400 mt-0.5">综合分</span>
      </div>
    </div>
  );
}

export function AnalysisResultComponent({ result, onNewAnalysis, onExport }: AnalysisResultProps) {
  const [expandedCompetitors, setExpandedCompetitors] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'competitors' | 'details'>('overview');

  const toggleCompetitor = (name: string) => {
    setExpandedCompetitors((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const tier = getScoreTier(result.overall_score);
  const tierColors: Record<string, string> = {
    emerald: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30',
    cyan: 'from-cyan-600/20 to-blue-600/20 border-cyan-500/30',
    amber: 'from-amber-600/20 to-yellow-600/20 border-amber-500/30',
    orange: 'from-orange-600/20 to-red-600/20 border-orange-500/30',
    red: 'from-red-600/20 to-rose-600/20 border-red-500/30',
  };

  const tierBadgeColors: Record<string, string> = {
    emerald: 'bg-emerald-500/20 text-emerald-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    amber: 'bg-amber-500/20 text-amber-400',
    orange: 'bg-orange-500/20 text-orange-400',
    red: 'bg-red-500/20 text-red-400',
  };

  const scoreBadgeMap: Record<string, { badge: string; label: string }> = {
    emerald: { badge: 'bg-emerald-500/20 text-emerald-400', label: '优秀' },
    cyan: { badge: 'bg-cyan-500/20 text-cyan-400', label: '良好' },
    amber: { badge: 'bg-amber-500/20 text-amber-400', label: '待优化' },
    red: { badge: 'bg-red-500/20 text-red-400', label: '需改进' },
  };

  const scoreZapMap: Record<string, string> = {
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  };

  const tabs = [
    { key: 'overview' as const, label: '概览', icon: BarChart3 },
    { key: 'competitors' as const, label: '竞品', icon: Shield },
    { key: 'details' as const, label: '详情', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* 顶部评分卡片 */}
      <Card className={`bg-gradient-to-r ${tierColors[tier.color]} border overflow-hidden`}>
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            <div className="flex items-center gap-6 p-8 flex-1">
              <ScoreWheel score={result.overall_score} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierBadgeColors[tier.color]}`}>
                    {tier.label}
                  </span>
                  <span className="text-slate-500 text-xs">{tier.desc}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">策略分析报告</h2>
                <p className="text-slate-400 text-sm max-w-md">
                  基于您填写的广告信息和策略参数，AI 已完成综合评估。以下为详细分析结果。
                </p>
              </div>
            </div>
            <div className="flex lg:flex-col items-center justify-center gap-2 px-8 py-4 lg:py-8 bg-white/5 border-t lg:border-t-0 lg:border-l border-white/10">
              <Button onClick={onExport} variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full justify-center">
                <Download className="w-4 h-4 mr-2" />
                导出报告
              </Button>
              <Button onClick={onNewAnalysis} className="bg-white text-slate-900 hover:bg-white/90 w-full justify-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                新建分析
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab 切换 */}
      <div className="flex bg-[#0f172a] rounded-xl border border-slate-700/50 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 策略总结 */}
          <Card className="bg-[#0f172a] border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-slate-100">策略总结</h3>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-5">
                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">{result.summary}</p>
              </div>
            </CardContent>
          </Card>

          {/* 竞品洞察摘要 */}
          <Card className="bg-[#0f172a] border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="font-semibold text-slate-100">竞品洞察</h3>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-5">
                <p className="text-slate-300 leading-relaxed text-sm">{result.competitor_insight}</p>
              </div>
              <button
                onClick={() => setActiveTab('competitors')}
                className="mt-3 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                查看竞品详细分析 <ExternalLink className="w-3 h-3" />
              </button>
            </CardContent>
          </Card>

          {/* 参数评分速览 */}
          <Card className="bg-[#0f172a] border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-100">参数评分速览</h3>
                </div>
                <button
                  onClick={() => setActiveTab('details')}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  查看详情 <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(result.comparison).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="bg-[#1e293b] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">{key}</span>
                      <span className="text-sm font-bold text-slate-100">{value.score}</span>
                    </div>
                    <Progress
                      value={value.score}
                      className="h-1.5 bg-slate-700"
                      barClassName={
                        value.score >= 85 ? 'bg-emerald-500' :
                        value.score >= 70 ? 'bg-cyan-500' :
                        value.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'competitors' && (
        <Card className="bg-[#0f172a] border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">竞品深度分析</h3>
                  <p className="text-xs text-slate-500 mt-0.5">点击展开查看各竞品详细信息</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">{result.competitors.length} 个竞品</span>
            </div>

            <div className="space-y-3">
              {result.competitors.map((competitor, index) => (
                <div
                  key={competitor.name}
                  className="bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700/50 transition-all"
                >
                  <button
                    onClick={() => toggleCompetitor(competitor.name)}
                    className="w-full p-4 flex items-center justify-between hover:bg-[#273548] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        competitor.budget_level === '高'
                          ? 'bg-red-500/20 text-red-400'
                          : competitor.budget_level === '中'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-slate-100">{competitor.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`px-1.5 py-0.5 rounded text-xs ${
                            competitor.budget_level === '高'
                              ? 'bg-red-500/10 text-red-400'
                              : competitor.budget_level === '中'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-slate-500/10 text-slate-400'
                          }`}>
                            {competitor.budget_level}预算
                          </span>
                          <span className="text-xs text-slate-500">{competitor.positioning}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {!expandedCompetitors[competitor.name] && (
                        <span className="text-xs text-slate-500 hidden sm:block">{competitor.creative_style}</span>
                      )}
                      {expandedCompetitors[competitor.name] ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {expandedCompetitors[competitor.name] && (
                    <div className="px-4 pb-4 border-t border-slate-700/30 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-[#0f172a] rounded-lg p-3">
                          <div className="text-xs text-slate-500 mb-1">创意风格</div>
                          <div className="text-sm text-slate-200">{competitor.creative_style}</div>
                        </div>
                        <div className="bg-[#0f172a] rounded-lg p-3">
                          <div className="text-xs text-slate-500 mb-1">品牌定位</div>
                          <div className="text-sm text-slate-200">{competitor.positioning}</div>
                        </div>
                        <div className="bg-[#0f172a] rounded-lg p-3">
                          <div className="text-xs text-slate-500 mb-1">目标人群</div>
                          <div className="text-sm text-slate-200">{competitor.target_audience}</div>
                        </div>
                        <div className="bg-[#0f172a] rounded-lg p-3">
                          <div className="text-xs text-slate-500 mb-1">投放策略</div>
                          <div className="text-sm text-slate-200">{competitor.ad_strategy}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-emerald-400 mb-2 text-sm font-medium">
                            <ThumbsUp className="w-4 h-4" />
                            竞争优势
                          </div>
                          <ul className="space-y-2">
                            {competitor.advantages.map((adv, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {adv}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-red-400 mb-2 text-sm font-medium">
                            <AlertTriangle className="w-4 h-4" />
                            竞争劣势
                          </div>
                          <ul className="space-y-2">
                            {competitor.disadvantages.map((dis, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                {dis}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'details' && (
        <Card className="bg-[#0f172a] border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">参数评分与优化建议</h3>
                <p className="text-xs text-slate-500 mt-0.5">各项参数的详细评分与AI建议</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(result.comparison).map(([key, value]) => {
                const scoreColor =
                  value.score >= 85 ? 'emerald' :
                  value.score >= 70 ? 'cyan' :
                  value.score >= 50 ? 'amber' : 'red';

                const scoreBadge = scoreBadgeMap[scoreColor];

                return (
                  <div key={key} className="bg-[#1e293b] rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200">{key}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">当前评分 {value.score}/100</p>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${scoreBadge.badge}`}>
                        {scoreBadge.label}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>评分</span>
                        <span>{value.score}%</span>
                      </div>
                      <Progress
                        value={value.score}
                        className="h-2 bg-slate-700 rounded-full overflow-hidden"
                        barClassName={
                          value.score >= 85 ? 'bg-emerald-500' :
                          value.score >= 70 ? 'bg-cyan-500' :
                          value.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }
                      />
                    </div>
                    <div className="bg-[#0f172a] rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Zap className={`w-3.5 h-3.5 ${scoreZapMap[scoreColor]} shrink-0 mt-0.5`} />
                        <p className="text-xs text-slate-400 leading-relaxed">{value.suggestion}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 底部操作 */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-3.5 h-3.5" />
          分析基于您提供的策略参数，建议结合实际数据持续优化
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-400 hover:text-slate-200 text-sm">
            <Share2 className="w-4 h-4 mr-2" />
            分享
          </Button>
          <Button onClick={onExport} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-sm shadow-lg shadow-indigo-500/20">
            <Download className="w-4 h-4 mr-2" />
            导出完整报告
          </Button>
        </div>
      </div>
    </div>
  );
}
