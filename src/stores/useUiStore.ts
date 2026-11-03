/**
 * UI 状态（弹窗/抽屉/通知）
 */

import { create } from 'zustand';

interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  createdAt: number;
}

interface UiState {
  /** 通知列表 */
  notifications: NotificationItem[];
  /** 全局加载 */
  globalLoading: boolean;
  /** 添加通知 */
  addNotification: (type: NotificationItem['type'], message: string) => void;
  /** 移除通知 */
  removeNotification: (id: string) => void;
  /** 设置全局加载 */
  setGlobalLoading: (loading: boolean) => void;
}

const useUiStore = create<UiState>((set) => ({
  notifications: [],
  globalLoading: false,
  addNotification: (type, message) =>
    set((s) => ({
      notifications: [
        ...s.notifications,
        {
          id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          type,
          message,
          createdAt: Date.now(),
        },
      ],
    })),
  removeNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));

export default useUiStore;
