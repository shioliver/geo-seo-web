'use client';

import { useState } from 'react';
import { Monitor, TrendingUp, TrendingDown, Eye, Bell, Plus, ArrowUpRight, ArrowDownRight, Minus, Calendar, Filter, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';

interface MonitoredBrand {
  name: string;
  score: number;
  scoreChange: number;
  mentionRate: number;
  mentionChange: number;
  sentiment: number;
  sentimentChange: number;
  status: 'improving' | 'stable' | 'declining';
}

const monitoredBrands: MonitoredBrand[] = [
  { name: 'Tesla', score: 82, scoreChange: 3, mentionRate: 72, mentionChange: 5, sentiment: 95, sentimentChange: 2, status: 'improving' },
  { name: 'Apple', score: 78, scoreChange: -1, mentionRate: 68, mentionChange: -2, sentiment: 92, sentimentChange: 0, status: 'stable' },
  { name: 'Google', score: 74, scoreChange: 2, mentionRate: 65, mentionChange: 3, sentiment: 88, sentimentChange: -1, status: 'improving' },
  { name: 'Microsoft', score: 70, scoreChange: -3, mentionRate: 58, mentionChange: -4, sentiment: 90, sentimentChange: -2, status: 'declining' },
  { name: 'Amazon', score: 66, scoreChange: 1, mentionRate: 54, mentionChange: 1, sentiment: 85, sentimentChange: 1, status: 'stable' },
];

const trend30Days = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}日`,
  Tesla: 75 + Math.floor(Math.random() * 15),
  Apple: 72 + Math.floor(Math.random() * 12),
  Google: 68 + Math.floor(Math.random() * 14),
}));

const platformTrend = [
  { platform: 'ChatGPT', current: 78, previous: 72 },
  { platform: 'DeepSeek', current: 65, previous: 60 },
  { platform: 'Claude', current: 70, previous: 68 },
  { platform: '千问', current: 62, previous: 58 },
  { platform: 'Kimi', current: 55, previous: 52 },
  { platform: '豆包', current: 48, previous: 45 },
];

const alerts = [
  { type: 'warning', brand: 'Microsoft', message: 'GEO 得分下降 3 分，跌出前 3 名', time: '2 小时前' },
  { type: 'success', brand: 'Tesla', message: 'ChatGPT 提及率上升至 72%，创历史新高', time: '5 小时前' },
  { type: 'info', brand: 'Google', message: 'DeepSeek 平台首次引用该品牌', time: '1 天前' },
  { type: 'warning', brand: 'Amazon', message: 'Gemini 平台正面情感下降 5%', time: '2 天前' },
];

export default function BrandMonitorPage() {
  const [activeBrand, setActiveBrand] = useState<string>('Tesla');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <div className="min-h-screen bg-[#020617] py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-100 mb-3 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Monitor className="w-6 h-6" />
                </div>
                品牌监测
              </h1>
              <p className="text-slate-400 text-lg">持续追踪品牌在各 AI 平台的提及率和排名变化</p>
            </div>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 text-lg px-8 py-6">
              <Plus className="w-5 h-5 mr-2" />
              添加品牌
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-xl bg-dark-card overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 font-medium">监测品牌数</span>
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">5</div>
              <div className="text-sm text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                +2 本月新增
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-dark-card overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 font-medium">平均得分</span>
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div className="text-4xl font-bold text-indigo-400 mb-2">74</div>
              <div className="text-sm text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                +1.2 较上月
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-dark-card overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 font-medium">活跃告警</span>
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div className="text-4xl font-bold text-amber-400 mb-2">4</div>
              <div className="text-sm text-amber-400 flex items-center gap-1">
                <Minus className="w-4 h-4" />
                需要关注
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl bg-dark-card overflow-hidden">
          <CardHeader className="pb-6 px-8 pt-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="text-2xl font-bold text-slate-100">监测中的品牌</CardTitle>
              <div className="flex gap-3">
                {['7天', '30天', '90天'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range === '7天' ? '7d' : range === '30天' ? '30d' : '90d')}
                    className={`text-sm px-5 py-2.5 rounded-xl font-medium transition-all ${
                      (range === '7天' && timeRange === '7d') || (range === '30天' && timeRange === '30d') || (range === '90天' && timeRange === '90d')
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-4">
              {monitoredBrands.map((brand) => (
                <div
                  key={brand.name}
                  onClick={() => setActiveBrand(brand.name)}
                  className={`flex items-center gap-6 p-6 rounded-2xl cursor-pointer transition-all border-2 ${
                    activeBrand === brand.name 
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/50 shadow-xl shadow-indigo-500/10' 
                      : 'bg-slate-800/50 border-transparent hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {brand.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl font-bold text-slate-100">{brand.name}</span>
                      <span className={`text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                        brand.status === 'improving' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        brand.status === 'stable' ? 'bg-slate-700 text-slate-300 border border-slate-600' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {brand.status === 'improving' ? <><ArrowUpRight className="w-4 h-4" /> 上升</> :
                         brand.status === 'stable' ? <><Minus className="w-4 h-4" /> 稳定</> :
                         <><ArrowDownRight className="w-4 h-4" /> 下降</>}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm text-slate-500 mb-1.5">GEO 得分</div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-indigo-400">{brand.score}</span>
                          <span className={`text-sm font-medium ${brand.scoreChange > 0 ? 'text-emerald-400' : brand.scoreChange < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                            {brand.scoreChange > 0 ? '+' : ''}{brand.scoreChange}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1.5">提及率</div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-purple-400">{brand.mentionRate}%</span>
                          <span className={`text-sm font-medium ${brand.mentionChange > 0 ? 'text-emerald-400' : brand.mentionChange < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                            {brand.mentionChange > 0 ? '+' : ''}{brand.mentionChange}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1.5">正面情感</div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-emerald-400">{brand.sentiment}%</span>
                          <span className={`text-sm font-medium ${brand.sentimentChange > 0 ? 'text-emerald-400' : brand.sentimentChange < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                            {brand.sentimentChange > 0 ? '+' : ''}{brand.sentimentChange}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-dark-card overflow-hidden">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-2xl font-bold text-slate-100">GEO 得分趋势</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend30Days}>
                      <defs>
                        <linearGradient id="colorTesla" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorApple" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} interval={4} axisLine={false} tickLine={false} />
                      <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }}
                        itemStyle={{ color: '#f1f5f9' }}
                      />
                      <Area type="monotone" dataKey="Tesla" stroke="#6366f1" fill="url(#colorTesla)" strokeWidth={3} />
                      <Area type="monotone" dataKey="Apple" stroke="#10b981" fill="url(#colorApple)" strokeWidth={3} />
                      <Area type="monotone" dataKey="Google" stroke="#f59e0b" fill="url(#colorGoogle)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-0 shadow-xl bg-dark-card overflow-hidden">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-amber-400" />
                  最新告警
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="space-y-4">
                  {alerts.map((alert, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${
                      alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                      alert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                      'bg-blue-500/10 border-blue-500/30'
                    }`}>
                      <div className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
                        {alert.type === 'warning' && <Bell className="w-4 h-4 text-amber-400" />}
                        {alert.type === 'success' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                        {alert.type === 'info' && <Activity className="w-4 h-4 text-blue-400" />}
                        {alert.brand}
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{alert.message}</p>
                      <div className="text-xs text-slate-500">{alert.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-dark-card overflow-hidden">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-2xl font-bold text-slate-100">各 AI 平台趋势对比</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="platform" tick={{ fontSize: 13, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 13, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="previous" name="上期" fill="#475569" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="current" name="本期" radius={[6, 6, 0, 0]}>
                    {platformTrend.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.current > entry.previous ? '#6366f1' : '#475569'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
