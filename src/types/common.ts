/**
 * 公共类型定义
 */

/** 基础实体：所有持久化实体共有字段 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** 标准 API 响应格式（为将来后端预留） */
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
  total?: number;
}

/** 分页查询参数 */
export interface PageQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: unknown;
}

/** 分页结果 */
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 键值对选项 */
export interface OptionItem {
  value: string | number;
  label: string;
}

/** 字典类型 */
export type Dict<T = string> = Record<string, T>;

/** 审计日志条目 */
export interface AuditLogEntry {
  at: string;
  action: string;
  detail: string;
}
