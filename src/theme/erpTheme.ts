import type { ThemeConfig } from 'antd';

/**
 * 高密度 ERP 主题 — Ant Design 5
 *
 * 设计目标：贴近 SAP / 用友 / 金蝶的操作习惯
 * - 紧凑控件尺寸（size=small）
 * - 基础字号 13px
 * - 表格行高 32px、紧凑密度
 * - 主色深蓝 #1668dc（AntD 蓝，适合 ERP 专业感）
 * - 圆角 2px（专业感，去消费化）
 */
export const erpTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1668dc',
    colorInfo: '#1668dc',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorTextBase: '#1f2937',
    colorBgLayout: '#f0f2f5',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    borderRadius: 2,
    fontSize: 13,
    fontFamily:
      '"Inter", "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
    controlHeight: 28,
    controlHeightSM: 24,
    controlHeightLG: 32,
    wireframe: false,
  },
  components: {
    Table: {
      headerBg: '#fafafa',
      headerColor: '#1f2937',
      headerSplitColor: '#f0f0f0',
      rowHoverBg: '#e6f4ff',
      borderColor: '#f0f0f0',
      paddingSM: 4,
      paddingMD: 8,
      cellPaddingBlockSM: 4,
      cellPaddingBlockMD: 8,
      fontSizeSM: 12,
    },
    Button: {
      controlHeight: 26,
      controlHeightSM: 22,
      controlHeightLG: 30,
      fontSize: 13,
      paddingInline: 12,
    },
    Input: {
      controlHeight: 28,
      controlHeightSM: 24,
      paddingInline: 8,
    },
    Select: {
      controlHeight: 28,
      controlHeightSM: 24,
      optionFontSize: 13,
    },
    InputNumber: {
      controlHeight: 28,
      controlHeightSM: 24,
    },
    Card: {
      paddingLG: 16,
      paddingSM: 12,
      borderRadiusLG: 4,
    },
    Menu: {
      itemHeight: 32,
      itemMarginInline: 8,
      itemBorderRadius: 4,
      itemFontSize: 13,
      iconSize: 15,
      subMenuItemBg: 'transparent',
    },
    Layout: {
      siderBg: '#ffffff',
      headerBg: '#ffffff',
      bodyBg: '#f0f2f5',
      triggerBg: '#f5f5f5',
    },
    Tabs: {
      cardPadding: '4px 12px',
      titleFontSize: 13,
    },
    Tag: {
      fontSize: 11,
      borderRadiusSM: 2,
    },
    Statistic: {
      contentFontSize: 20,
    },
    Space: {
      size: 8,
      sizeSM: 8,
      sizeLG: 12,
    },
    Modal: {
      titleFontSize: 14,
      contentFontSize: 13,
    },
    Tooltip: {
      fontSize: 12,
    },
    Badge: {
      fontSize: 10,
    },
    Popconfirm: {
      fontSize: 13,
    },
    Pagination: {
      itemSize: 24,
      itemLinkedOnlyBorderRadius: 2,
    },
    Dropdown: {
      controlHeight: 28,
      controlHeightSM: 24,
    },
    Checkbox: {
      size: 13,
    },
    Radio: {
      size: 13,
    },
    Switch: {
      width: 32,
      height: 18,
      handleSize: 14,
    },
    Form: {
      itemMarginBottom: 12,
      verticalLabelPadding: '0 0 4px',
    },
  },
};

export default erpTheme;
