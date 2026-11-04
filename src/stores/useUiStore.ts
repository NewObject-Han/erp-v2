/**
 * 全局 UI 状态：语言 + 主题模式（持久化到 localStorage）
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'zh' | 'en';
export type ThemeMode = 'light' | 'dark';

interface UiState {
  /** 界面语言 */
  lang: Lang;
  /** 主题模式 */
  themeMode: ThemeMode;
  setLang: (lang: Lang) => void;
  toggleTheme: () => void;
}

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      lang: 'zh',
      themeMode: 'light',
      setLang: (lang) => set({ lang }),
      toggleTheme: () =>
        set((s) => ({ themeMode: s.themeMode === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'erp-v2:ui' },
  ),
);

export default useUiStore;
