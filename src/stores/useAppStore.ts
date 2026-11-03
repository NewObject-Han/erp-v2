/**
 * 全局应用状态（侧栏折叠、面包屑等）
 */

import { create } from 'zustand';

interface AppState {
  /** 侧栏折叠状态 */
  sidebarCollapsed: boolean;
  /** 当前模块 key */
  currentModule: string;
  /** 面包屑路径 */
  breadcrumb: { label: string; path?: string }[];
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentModule: (module: string) => void;
  setBreadcrumb: (breadcrumb: { label: string; path?: string }[]) => void;
}

const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  currentModule: 'dashboard',
  breadcrumb: [{ label: '工作台' }],
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCurrentModule: (module) => set({ currentModule: module }),
  setBreadcrumb: (breadcrumb) => set({ breadcrumb }),
}));

export default useAppStore;
