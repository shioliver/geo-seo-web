'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Search, FileText, Monitor, Wrench, LayoutDashboard, Activity, ChevronLeft, ChevronRight, Target } from 'lucide-react';

const navItems = [
  { href: '/', label: '首页', icon: LayoutDashboard },
  { href: '/audit', label: '完整审计', icon: FileText },
  { href: '/brand-diagnosis', label: '品牌诊断', icon: Search },
  { href: '/realtime-search', label: '实时搜索', icon: Activity },
  { href: '/brand-monitor', label: '品牌监测', icon: Monitor },
  { href: '/ad-optimizer', label: '广告策略优化', icon: Target },
  { href: '/tools', label: '工具集', icon: Wrench },
];

const aiPlatforms = [
  { name: 'ChatGPT', color: '#10a37f' },
  { name: 'DeepSeek', color: '#4d6bfe' },
  { name: 'Claude', color: '#d97706' },
  { name: '千问', color: '#6366f1' },
  { name: 'Kimi', color: '#8b5cf6' },
  { name: '豆包', color: '#0891b2' },
  { name: 'Gemini', color: '#2563eb' },
  { name: 'Perplexity', color: '#0891b2' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed left-0 top-0 bottom-0 bg-[#020617] text-white flex flex-col z-50 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-[68px]'
      }`}
      style={{ boxShadow: '2px 0 20px rgba(0, 0, 0, 0.5)' }}
    >
      <div className={`border-b border-slate-800 ${isExpanded ? 'p-5' : 'p-3 flex justify-center'}`}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
            <h1 className="text-lg font-bold whitespace-nowrap">GEO-SEO</h1>
            <p className="text-xs text-slate-400 whitespace-nowrap">AI 搜索优化平台</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={!isExpanded ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${!isExpanded ? 'justify-center' : ''}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-slate-800 transition-all duration-300 ${isExpanded ? 'p-4' : 'p-3'}`}>
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="text-xs text-slate-400 mb-3 font-medium">支持的 AI 平台</div>
          <div className="flex flex-wrap gap-2">
            {aiPlatforms.map((platform) => (
              <span
                key={platform.name}
                className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer transition-colors"
                style={{ borderLeft: `2px solid ${platform.color}` }}
              >
                {platform.name}
              </span>
            ))}
          </div>
        </div>
        {!isExpanded && (
          <div className="flex justify-center">
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>
        )}
      </div>
    </aside>
  );
}
