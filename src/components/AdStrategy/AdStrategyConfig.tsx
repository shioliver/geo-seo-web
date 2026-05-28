'use client';

import { useState } from 'react';
import { Settings, Clock, Users, Target, Calendar, Wallet, Check, ArrowLeft, ArrowRight, Zap, Globe, Tv, BarChart3, RefreshCw, TrendingUp, MessageCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import type { AdStrategy, TargetAudience } from '@/lib/types';

interface AdStrategyConfigProps {
  strategy: AdStrategy;
  onStrategyChange: (data: AdStrategy) => void;
  onNext: () => void;
  onPrev: () => void;
}

const creativeForms = [
  { value: 'live_stream', label: '直投直播间', desc: '直接引流至直播间', icon: Tv, color: 'indigo' },
  { value: 'video', label: '视频引流', desc: '短视频内容引流', icon: TrendingUp, color: 'rose' },
  { value: 'image', label: '图文推广', desc: '图文种草推广', icon: MessageCircle, color: 'amber' },
  { value: 'interactive', label: '互动玩法', desc: '互动活动吸引', icon: Heart, color: 'purple' },
];

const deliveryMethods = [
  { value: 'cost_control', label: '控成本投放', desc: '控制单次转化成本', icon: Target, color: 'emerald' },
  { value: 'volume', label: '放量投放', desc: '最大化曝光量', icon: BarChart3, color: 'blue' },
  { value: 'uniform', label: '匀速投放', desc: '均匀分配流量', icon: RefreshCw, color: 'cyan' },
  { value: 'accelerate', label: '加速投放', desc: '快速获取流量', icon: Zap, color: 'orange' },
];

const heatingTargets = [
  { value: 'popularity', label: '人气提升', desc: '提升在线人数', color: 'rose' },
  { value: 'view', label: '观看提升', desc: '增加有效观看时长', color: 'blue' },
  { value: 'interaction', label: '互动提升', desc: '点赞评论分享', color: 'amber' },
  { value: 'conversion', label: '转化提升', desc: '商品购买转化', color: 'emerald' },
];

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const timeSlots = [
  { label: '0:00-3:00', range: '凌晨' },
  { label: '3:00-6:00', range: '凌晨' },
  { label: '6:00-9:00', range: '早晨' },
  { label: '9:00-12:00', range: '上午' },
  { label: '12:00-15:00', range: '午后' },
  { label: '15:00-18:00', range: '下午' },
  { label: '18:00-21:00', range: '晚间' },
  { label: '21:00-24:00', range: '深夜' },
];

function getColorClasses(color: string, selected: boolean) {
  const map: Record<string, { selected: string; unselected: string }> = {
    indigo: { selected: 'bg-indigo-500/20 border-indigo-500 text-indigo-300', unselected: 'bg-[#0f172a] border-slate-600 text-slate-400 hover:border-indigo-500/50' },
    rose: { selected: 'bg-rose-500/20 border-rose-500 text-rose-300', unselected: 'bg-[#0f172a] border-slate-600 text-slate-400 hover:border-rose-500/50' },
    amber: { selected: 'bg-amber-500/20 border-amber-500 text-amber-300', unselected: 'bg-[#0f172a] border-slate-600 text-slate-400 hover:border-amber-500/50' },
    purple: { selected: 'bg-purple-500/20 border-purple-500 text-purple-300', unselected: 'bg-[#0f172a] border-slate-600 text-slate-400 hover:border-purple-500/50' },
    emerald: { selected: 'bg-emerald-500/20 border-emerald-500 text-emerald-300', unselected: 'bg-[#0f172a] border-slate-600 text-slate-400 hover:border-emerald-500/50' },
    blue: { selected: 'bg-blue-500/20 border-blue-500 text-blue-300', unselected: 'bg-[#0f172a] border-slate-600 text-slate-400 hover:border-blue-500/50' },
    cyan: { selected: 'bg-cyan-500/20 border-cyan-500 text-cyan-300', unselected: 'bg-[#0f172a] border-slate-600 text-slate-400 hover:border-cyan-500/50' },
    orange: { selected: 'bg-orange-500/20 border-orange-500 text-orange-300', unselected: 'bg-[#0f172a] border-slate-600 text-slate-400 hover:border-orange-500/50' },
  };
  return selected ? map[color]?.selected || '' : map[color]?.unselected || '';
}

export function AdStrategyConfig({ strategy, onStrategyChange, onNext, onPrev }: AdStrategyConfigProps) {
  const [timeGrid, setTimeGrid] = useState<boolean[][]>(
    strategy.time_grid || Array(7).fill(null).map(() => Array(8).fill(false))
  );

  const toggleTimeSlot = (day: number, slot: number) => {
    const newGrid = timeGrid.map(row => [...row]);
    newGrid[day][slot] = !newGrid[day][slot];
    setTimeGrid(newGrid);
    onStrategyChange({ ...strategy, time_grid: newGrid });
  };

  const setAllTimeSlots = (fill: boolean) => {
    const newGrid = Array(7).fill(null).map(() => Array(8).fill(fill));
    setTimeGrid(newGrid);
    onStrategyChange({ ...strategy, time_grid: newGrid });
  };

  const updateTargetAudience = (updates: Partial<TargetAudience>) => {
    onStrategyChange({
      ...strategy,
      target_audience: { ...strategy.target_audience, ...updates }
    });
  };

  const activeTimeSlots = timeGrid.flat().filter(Boolean).length;

  return (
    <Card className="bg-[#0f172a] border-slate-700/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="border-b border-slate-700/50 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">投放策略配置</h2>
              <p className="text-sm text-slate-400">精细调整广告投放参数，AI 将基于此进行深度分析</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div className="xl:col-span-3 space-y-8">
              {/* 创意形式 */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Tv className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">创意形式</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {creativeForms.map((form) => {
                    const isSelected = strategy.creative_form === form.value;
                    const Icon = form.icon;
                    return (
                      <button
                        key={form.value}
                        onClick={() => onStrategyChange({ ...strategy, creative_form: form.value })}
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                          getColorClasses(form.color, isSelected)
                        } ${isSelected ? 'shadow-lg' : ''}`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/10' : 'bg-slate-800'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{form.label}</div>
                          <div className="text-xs opacity-70 mt-0.5">{form.desc}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 shrink-0 ml-auto mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 投放方式 */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">投放方式</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {deliveryMethods.map((method) => {
                    const isSelected = strategy.delivery_method === method.value;
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.value}
                        onClick={() => onStrategyChange({ ...strategy, delivery_method: method.value })}
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                          getColorClasses(method.color, isSelected)
                        } ${isSelected ? 'shadow-lg' : ''}`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/10' : 'bg-slate-800'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{method.label}</div>
                          <div className="text-xs opacity-70 mt-0.5">{method.desc}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 shrink-0 ml-auto mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 加热目标 */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">加热目标</h3>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {heatingTargets.map((target) => {
                    const isSelected = strategy.heating_target === target.value;
                    return (
                      <button
                        key={target.value}
                        onClick={() => onStrategyChange({ ...strategy, heating_target: target.value })}
                        className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                          getColorClasses(target.color, isSelected)
                        } ${isSelected ? 'shadow-lg scale-[1.02]' : ''}`}
                      >
                        <div className="font-medium text-sm">{target.label}</div>
                        <div className="text-xs opacity-70 mt-1">{target.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 投放时间 */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">投放时间</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      已选 {activeTimeSlots} 个时段
                    </span>
                    <div className="flex rounded-lg border border-slate-600 overflow-hidden">
                      <button
                        onClick={() => onStrategyChange({ ...strategy, delivery_period: 'long_term' })}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          strategy.delivery_period === 'long_term'
                            ? 'bg-cyan-500 text-white'
                            : 'bg-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        长期投放
                      </button>
                      <button
                        onClick={() => onStrategyChange({ ...strategy, delivery_period: 'fixed' })}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          strategy.delivery_period === 'fixed'
                            ? 'bg-cyan-500 text-white'
                            : 'bg-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        固定日期
                      </button>
                    </div>
                  </div>
                </div>

                {strategy.delivery_period === 'fixed' && (
                  <div className="flex gap-4 mb-4 p-3 bg-[#1e293b] rounded-lg">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 mb-1">开始日期</label>
                      <input
                        type="date"
                        value={strategy.start_date || ''}
                        onChange={(e) => onStrategyChange({ ...strategy, start_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-slate-600 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 mb-1">结束日期</label>
                      <input
                        type="date"
                        value={strategy.end_date || ''}
                        onChange={(e) => onStrategyChange({ ...strategy, end_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-slate-600 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-[#1e293b] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400">投放时段选择</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setAllTimeSlots(true)}
                        className="px-2 py-1 text-xs rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                      >
                        全选
                      </button>
                      <button
                        onClick={() => setAllTimeSlots(false)}
                        className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-400 hover:bg-slate-600 transition-colors"
                      >
                        清空
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-1">
                      <thead>
                        <tr>
                          <th className="w-16 p-1 text-xs text-slate-500 font-medium text-left">时段</th>
                          {weekDays.map((day) => (
                            <th key={day} className="p-1 text-xs text-slate-500 font-medium text-center">{day}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((slot, slotIdx) => (
                          <tr key={slot.label}>
                            <td className="p-1">
                              <div className="text-xs text-slate-400">{slot.label}</div>
                              <div className="text-[10px] text-slate-600">{slot.range}</div>
                            </td>
                            {weekDays.map((_, dayIdx) => {
                              const isActive = timeGrid[dayIdx][slotIdx];
                              return (
                                <td key={dayIdx} className="p-1">
                                  <button
                                    onClick={() => toggleTimeSlot(dayIdx, slotIdx)}
                                    className={`w-full aspect-[3/2] rounded-md transition-all duration-150 border ${
                                      isActive
                                        ? 'bg-cyan-500 border-cyan-400 shadow-sm shadow-cyan-500/30'
                                        : 'bg-[#0f172a] border-slate-700 hover:border-slate-500'
                                    }`}
                                    title={`${weekDays[dayIdx]} ${slot.label}`}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-cyan-500" />
                      已选时段
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-[#0f172a] border border-slate-700" />
                      未选时段
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="xl:col-span-2 space-y-8">
              {/* 目标受众 */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-pink-400" />
                  <h3 className="text-sm font-semibold text-pink-400 uppercase tracking-wider">目标受众</h3>
                </div>

                <div className="bg-[#1e293b] rounded-xl divide-y divide-slate-700/50">
                  <div className="p-4">
                    <label className="flex items-center gap-1 text-xs text-slate-400 mb-2">
                      <Globe className="w-3 h-3" />
                      地域定向
                    </label>
                    <select
                      value={strategy.target_audience.region}
                      onChange={(e) => updateTargetAudience({ region: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-slate-600 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40 cursor-pointer"
                    >
                      <option value="">不限地域</option>
                      <option value="all">全国范围</option>
                      <option value="first">一线城市（北上广深）</option>
                      <option value="second">二线城市</option>
                      <option value="third">三线及以下城市</option>
                    </select>
                  </div>

                  <div className="p-4">
                    <label className="text-xs text-slate-400 mb-2 block">性别定向</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'all', label: '不限' },
                        { value: 'male', label: '男性' },
                        { value: 'female', label: '女性' },
                      ].map((g) => (
                        <button
                          key={g.value}
                          onClick={() => updateTargetAudience({ gender: g.value })}
                          className={`py-2 rounded-lg text-sm transition-all duration-200 ${
                            strategy.target_audience.gender === g.value
                              ? 'bg-pink-500 text-white shadow-sm'
                              : 'bg-[#0f172a] border border-slate-600 text-slate-400 hover:border-pink-500/50'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4">
                    <label className="text-xs text-slate-400 mb-2 block">年龄定向</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {['不限', '18-24', '25-34', '35-44', '45+'].map((age) => (
                        <button
                          key={age}
                          onClick={() => updateTargetAudience({ age: age === '不限' ? '' : age })}
                          className={`py-2 rounded-lg text-xs transition-all duration-200 ${
                            (age === '不限' && !strategy.target_audience.age) || strategy.target_audience.age === age
                              ? 'bg-pink-500 text-white shadow-sm'
                              : 'bg-[#0f172a] border border-slate-600 text-slate-400 hover:border-pink-500/50'
                          }`}
                        >
                          {age}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4">
                    <label className="text-xs text-slate-400 mb-2 block">网络环境</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'all', label: '全部' },
                        { value: 'wifi', label: 'WiFi' },
                        { value: 'mobile', label: '移动网络' },
                      ].map((net) => (
                        <button
                          key={net.value}
                          onClick={() => updateTargetAudience({ network: net.value })}
                          className={`py-2 rounded-lg text-sm transition-all duration-200 ${
                            strategy.target_audience.network === net.value
                              ? 'bg-pink-500 text-white shadow-sm'
                              : 'bg-[#0f172a] border border-slate-600 text-slate-400 hover:border-pink-500/50'
                          }`}
                        >
                          {net.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4">
                    <label className="text-xs text-slate-400 mb-2 block">设备平台</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'all', label: '全部' },
                        { value: 'ios', label: 'iOS' },
                        { value: 'android', label: 'Android' },
                      ].map((dev) => (
                        <button
                          key={dev.value}
                          onClick={() => updateTargetAudience({ platform: dev.value })}
                          className={`py-2 rounded-lg text-sm transition-all duration-200 ${
                            strategy.target_audience.platform === dev.value
                              ? 'bg-pink-500 text-white shadow-sm'
                              : 'bg-[#0f172a] border border-slate-600 text-slate-400 hover:border-pink-500/50'
                          }`}
                        >
                          {dev.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 日预算 */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-4 h-4 text-green-400" />
                  <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider">日预算</h3>
                </div>
                <div className="bg-[#1e293b] rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {['100', '500', '1000', '3000'].map((budget) => (
                      <button
                        key={budget}
                        onClick={() => onStrategyChange({ ...strategy, daily_budget: budget, custom_budget: undefined })}
                        className={`py-3 rounded-lg text-center transition-all duration-200 ${
                          strategy.daily_budget === budget && !strategy.custom_budget
                            ? 'bg-green-500 text-white font-medium shadow-sm'
                            : 'bg-[#0f172a] border border-slate-600 text-slate-400 hover:border-green-500/50'
                        }`}
                      >
                        <span className="text-sm font-semibold">{Number(budget).toLocaleString()}</span>
                        <span className="text-xs opacity-70 ml-1">元/天</span>
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-sm">¥</span>
                    </div>
                    <input
                      type="number"
                      placeholder="自定义每日预算"
                      value={strategy.custom_budget || ''}
                      onChange={(e) => onStrategyChange({ ...strategy, custom_budget: Number(e.target.value), daily_budget: 'custom' })}
                      className="w-full pl-8 pr-4 py-2 rounded-lg bg-[#0f172a] border border-slate-600 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-700/50">
            <Button
              onClick={onPrev}
              variant="outline"
              className="border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回上一步
            </Button>
            <Button
              onClick={onNext}
              className="group bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-emerald-500/20"
              size="lg"
            >
              开始 AI 策略分析
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
