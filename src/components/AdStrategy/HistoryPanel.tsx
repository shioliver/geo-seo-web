'use client';

import { Clock, Trash2, ChevronRight, History, Star, X } from 'lucide-react';
import type { HistoryEntry } from '@/hooks/useStrategyHistory';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onLoad: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, onLoad, onDelete, onClear }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-8 text-center">
        <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-sm text-slate-500">暂无历史记录</p>
        <p className="text-xs text-slate-600 mt-1">完成一次分析后会自动保存</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Clock className="w-4 h-4 text-slate-500" />
          历史记录 ({history.length})
        </div>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
          清空全部
        </button>
      </div>
      <div className="divide-y divide-slate-700/30 max-h-96 overflow-y-auto">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between px-5 py-3 hover:bg-slate-800/50 transition-colors group"
          >
            <button
              onClick={() => onLoad(entry)}
              className="flex-1 flex items-center gap-3 text-left min-w-0"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                entry.overall_score >= 85
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : entry.overall_score >= 70
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : entry.overall_score >= 50
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
              }`}>
                {entry.overall_score}
              </div>
              <div className="min-w-0">
                <div className="text-sm text-slate-200 truncate">{entry.ad_topic}</div>
                <div className="text-xs text-slate-500">
                  {new Date(entry.created_at).toLocaleDateString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </button>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onDelete(entry.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
