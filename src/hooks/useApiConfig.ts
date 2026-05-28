'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ApiConfig {
  provider: 'deepseek' | 'openai' | 'custom';
  apiKey: string;
  baseUrl: string;
  model: string;
}

const STORAGE_KEY = 'ad-strategy-api-config';

const defaultDeepSeekConfig: ApiConfig = {
  provider: 'deepseek',
  apiKey: '',
  baseUrl: 'https://api.deepseek.com',
  model: 'deepseek-chat',
};

function loadConfig(): ApiConfig {
  if (typeof window === 'undefined') return defaultDeepSeekConfig;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultDeepSeekConfig, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...defaultDeepSeekConfig };
}

function saveConfig(config: ApiConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useApiConfig() {
  const [config, setConfig] = useState<ApiConfig>(defaultDeepSeekConfig);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setConfig(loadConfig());
    setInitialized(true);
  }, []);

  const updateConfig = useCallback((partial: Partial<ApiConfig>) => {
    setConfig(prev => {
      const next = { ...prev, ...partial };
      saveConfig(next);
      return next;
    });
  }, []);

  const isConfigured = config.apiKey.trim().length > 0;

  return { config, updateConfig, isConfigured, initialized };
}
