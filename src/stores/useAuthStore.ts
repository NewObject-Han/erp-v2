/**
 * 认证状态（当前用户/角色）
 */

import { create } from 'zustand';
import type { User, Role, Permission } from '../types';

interface AuthState {
  /** 当前登录用户 */
  currentUser: User | null;
  /** 角色列表 */
  roles: Role[];
  /** 权限列表 */
  permissions: Permission[];
  /** 登录 */
  login: (user: User, roles: Role[], permissions: Permission[]) => void;
  /** 登出 */
  logout: () => void;
  /** 更新当前用户 */
  setCurrentUser: (user: User | null) => void;
  /** 判断是否有某权限 */
  hasPermission: (module: string, action: string) => boolean;
}

const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  roles: [],
  permissions: [],
  login: (user, rls, perms) => set({ currentUser: user, roles: rls, permissions: perms }),
  logout: () => set({ currentUser: null }),
  setCurrentUser: (user) => set({ currentUser: user }),
  hasPermission: (module, action) => {
    const { currentUser, roles, permissions } = get();
    if (!currentUser) return false;
    const userRoles = roles.filter((r) => currentUser.roleIds.includes(r.id));
    return permissions.some(
      (p) =>
        userRoles.some((r) => r.permissionIds.includes(p.id)) &&
        p.module === module &&
        p.action === action,
    );
  },
}));

export default useAuthStore;
