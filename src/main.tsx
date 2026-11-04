import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp, theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { erpTheme } from './theme/erpTheme';
import useUiStore from './stores/useUiStore';
import App from './App';
import { ensureSeedData } from './data/seed';
import './styles/global.css';

ensureSeedData();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
    mutations: {
      onError: (error) => console.error('[React Query mutation error]', error),
    },
  },
});

/** 主题 + 语言包装：暗黑模式切换 darkAlgorithm，并覆盖浅色专用的硬编码 token */
function ThemedApp({ children }: { children: ReactNode }) {
  const lang = useUiStore((s) => s.lang);
  const themeMode = useUiStore((s) => s.themeMode);

  const themeConfig = useMemo<ThemeConfig>(() => {
    if (themeMode === 'light') return erpTheme;
    return {
      ...erpTheme,
      algorithm: antdTheme.darkAlgorithm,
      token: {
        ...erpTheme.token,
        colorTextBase: '#e6e8eb',
        colorBgLayout: '#141414',
        colorBorder: '#4b4b4b',
        colorBorderSecondary: '#303030',
      },
      components: {
        ...erpTheme.components,
        Table: {
          ...erpTheme.components?.Table,
          headerBg: '#1d1d1d',
          headerColor: '#e6e8eb',
          headerSplitColor: '#262626',
          rowHoverBg: '#15213a',
          borderColor: '#262626',
        },
        Layout: {
          ...erpTheme.components?.Layout,
          siderBg: '#141414',
          headerBg: '#141414',
          bodyBg: '#141414',
          triggerBg: '#1d1d1d',
        },
      },
    };
  }, [themeMode]);

  return (
    <ConfigProvider theme={themeConfig} locale={lang === 'zh' ? zhCN : enUS}>
      {children}
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemedApp>
        <AntApp>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AntApp>
      </ThemedApp>
    </QueryClientProvider>
  </React.StrictMode>,
);
