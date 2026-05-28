'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AdFormData, AdStrategy, AnalysisResult } from '@/lib/types';

export interface HistoryEntry {
  id: string;
  created_at: string;
  ad_topic: string;
  overall_score: number;
  formData: AdFormData;
  strategy: AdStrategy;
  result: AnalysisResult;
}

const STORAGE_KEY = 'ad-strategy-history';

function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore quota errors
  }
}

export function useStrategyHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addEntry = useCallback((
    formData: AdFormData,
    strategy: AdStrategy,
    result: AnalysisResult,
  ) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      created_at: new Date().toISOString(),
      ad_topic: formData.ad_topic || '未命名计划',
      overall_score: result.overall_score,
      formData,
      strategy,
      result,
    };
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, 20);
      saveHistory(updated);
      return updated;
    });
    return entry;
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const loadEntry = useCallback((id: string): HistoryEntry | undefined => {
    return history.find(e => e.id === id);
  }, [history]);

  return { history, addEntry, deleteEntry, clearHistory, loadEntry };
}
