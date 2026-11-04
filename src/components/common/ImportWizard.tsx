/**
 * Excel / CSV 导入向导
 *
 * 四步：上传解析 → 字段映射 → 校验与错误预览 → 导入完成。
 * 解析用 SheetJS(xlsx) 按需动态加载；可下载示例模板。
 */
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Alert,
  Button,
  Modal,
  Select,
  Steps,
  Switch,
  Table,
  Typography,
  Upload,
  message,
  Space,
} from 'antd';
import { DownloadOutlined, InboxOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

const { Text } = Typography;

export interface TargetField {
  /** 写入行数据的字段 key */
  name: string;
  /** 中文标签（用于自动映射与展示） */
  label: string;
  /** 必填：未映射时不可进入校验步骤 */
  required?: boolean;
  /** 自定义校验：返回错误文案或 null */
  validate?: (value: unknown) => string | null;
}

interface ImportError {
  rowNo: number;
  field: string;
  message: string;
}

interface ImportWizardProps {
  open: boolean;
  onClose: () => void;
  /** 导入目标名，如：客户 */
  targetLabel: string;
  fields: TargetField[];
  /** 执行导入，返回成功条数 */
  onImport: (rows: Record<string, unknown>[]) => Promise<number> | number;
}

const norm = (s: string) => s.toLowerCase().replace(/[\s_\-()（）:：]/g, '');

const STEP_TITLES = ['上传文件', '字段映射', '校验预览', '导入完成'];

export default function ImportWizard({ open, onClose, targetLabel, fields, onImport }: ImportWizardProps) {
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [sourceRows, setSourceRows] = useState<unknown[][]>([]);
  const [mapping, setMapping] = useState<Record<string, number | undefined>>({});
  const [skipErrors, setSkipErrors] = useState(true);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ ok: number } | null>(null);

  // 每次打开重置
  useEffect(() => {
    if (!open) {
      setStep(0);
      setFileName('');
      setHeaders([]);
      setSourceRows([]);
      setMapping({});
      setSkipErrors(true);
      setResult(null);
    }
  }, [open]);

  /** 解析上传文件（仅取第一个工作表） */
  const handleFile = async (file: File) => {
    try {
      const buf = await file.arrayBuffer();
      const XLSX = await import('xlsx');
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const matrix = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '', blankrows: false });
      const hs = (matrix[0] ?? []).map((h) => String(h ?? '').trim());
      const rows = matrix.slice(1).filter((r) => r.some((c) => String(c ?? '').trim() !== ''));
      if (!hs.length || !rows.length) {
        message.error('未解析到表头或数据行');
        return;
      }
      setHeaders(hs);
      setSourceRows(rows);
      setFileName(file.name);
      // 按标签 / 字段名自动匹配列
      const m: Record<string, number | undefined> = {};
      fields.forEach((f) => {
        let idx = hs.findIndex((h) => norm(h) === norm(f.label) || norm(h) === norm(f.name));
        if (idx < 0 && f.label) idx = hs.findIndex((h) => norm(h).includes(norm(f.label)));
        m[f.name] = idx >= 0 ? idx : undefined;
      });
      setMapping(m);
      setStep(1);
      message.success(`已解析 ${rows.length} 行数据`);
    } catch {
      message.error('解析失败，请确认为 .xlsx / .xls / .csv 文件');
    }
  };

  /** 下载示例模板 */
  const downloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const aoa = [fields.map((f) => (f.required ? `${f.label}*` : f.label))];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, targetLabel);
    XLSX.writeFile(wb, `${targetLabel}导入模板.xlsx`);
  };

  const requiredUnmapped = fields.filter((f) => f.required && mapping[f.name] == null);

  /** 按当前映射生成行并逐格校验 */
  const { validRows, errors } = useMemo(() => {
    const errs: ImportError[] = [];
    const rows: Record<string, unknown>[] = [];
    sourceRows.forEach((raw, i) => {
      const rowNo = i + 2;
      const obj: Record<string, unknown> = {};
      let ok = true;
      fields.forEach((f) => {
        const idx = mapping[f.name];
        if (idx == null) return;
        const v = raw[idx];
        const val = typeof v === 'string' ? v.trim() : v;
        if (f.required && (val === '' || val == null)) {
          errs.push({ rowNo, field: f.label, message: `${f.label}不能为空` });
          ok = false;
          return;
        }
        if (val !== '' && val != null && f.validate) {
          const msg = f.validate(val);
          if (msg) {
            errs.push({ rowNo, field: f.label, message: msg });
            ok = false;
            return;
          }
        }
        obj[f.name] = val;
      });
      if (ok) rows.push(obj);
    });
    return { validRows: rows, errors: errs };
  }, [sourceRows, mapping, fields]);

  const canImport = requiredUnmapped.length === 0 && (errors.length === 0 || skipErrors);

  const handleImport = async () => {
    setImporting(true);
    try {
      const ok = await onImport(validRows);
      setResult({ ok });
      setStep(3);
    } catch (e) {
      message.error(`导入失败：${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setImporting(false);
    }
  };

  // ===== 各步骤内容 =====
  const renderUpload = () => (
    <div>
      <Upload.Dragger
        accept=".xlsx,.xls,.csv"
        maxCount={1}
        showUploadList={false}
        beforeUpload={(file) => {
          void handleFile(file as unknown as File);
          return false;
        }}
        style={{ padding: '16px 0' }}
      >
        <p style={{ fontSize: 30, lineHeight: 1, marginBottom: 8 }}><InboxOutlined /></p>
        <p style={{ fontSize: 13, marginBottom: 4 }}>点击或拖拽文件到此区域上传</p>
        <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>支持 .xlsx / .xls / .csv，仅读取第一个工作表</p>
      </Upload.Dragger>
      <Space style={{ marginTop: 12 }}>
        <Button size="small" icon={<DownloadOutlined />} onClick={downloadTemplate}>
          下载「{targetLabel}」导入模板
        </Button>
        {fileName && <Text type="secondary" style={{ fontSize: 12 }}>{fileName} · {sourceRows.length} 行</Text>}
      </Space>
    </div>
  );

  const mappedFields = fields.filter((f) => mapping[f.name] != null);
  const previewCols: TableProps<Record<string, unknown>>['columns'] = mappedFields.map((f) => ({
    title: f.label,
    dataIndex: f.name,
    key: f.name,
    ellipsis: true,
    width: 120,
  }));
  const previewRows = sourceRows.slice(0, 5).map((raw, i) => {
    const obj: Record<string, unknown> = { __key: i };
    mappedFields.forEach((f) => { obj[f.name] = raw[mapping[f.name] as number]; });
    return obj;
  });

  const renderMapping = () => (
    <div>
      {requiredUnmapped.length > 0 && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 10 }}
          message={`必填字段未映射：${requiredUnmapped.map((f) => f.label).join('、')}（请为其选择来源列）`}
        />
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', maxHeight: 240, overflow: 'auto', paddingRight: 4 }}>
        {fields.map((f) => (
          <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 12.5, width: 96, flexShrink: 0 }}>
              {f.label}{f.required && <span style={{ color: '#f5222d' }}> *</span>}
            </Text>
            <Select
              size="small"
              style={{ flex: 1 }}
              allowClear
              placeholder="不导入"
              value={mapping[f.name]}
              onChange={(v) => setMapping((m) => ({ ...m, [f.name]: v }))}
              options={headers.map((h, i) => ({ label: h || `第 ${i + 1} 列`, value: i }))}
            />
          </div>
        ))}
      </div>
      <Text type="secondary" style={{ fontSize: 11.5, display: 'block', margin: '10px 0 4px' }}>
        前 5 行预览（按映射结果）：
      </Text>
      <Table
        size="small"
        columns={previewCols}
        dataSource={previewRows}
        rowKey="__key"
        pagination={false}
        scroll={{ x: 'max-content' }}
        style={{ fontSize: 12 }}
      />
    </div>
  );

  const errCols: TableProps<ImportError>['columns'] = [
    { title: '行号', dataIndex: 'rowNo', width: 60 },
    { title: '字段', dataIndex: 'field', width: 100 },
    { title: '原因', dataIndex: 'message' },
  ];

  const renderValidate = () => (
    <div>
      <Alert
        type={errors.length ? 'warning' : 'success'}
        showIcon
        message={
          errors.length
            ? `共 ${sourceRows.length} 行：可导入 ${validRows.length} 行，错误 ${errors.length} 处（涉及 ${new Set(errors.map((e) => e.rowNo)).size} 行）`
            : `共 ${sourceRows.length} 行，全部校验通过`
        }
        style={{ marginBottom: 10 }}
      />
      {errors.length > 0 && (
        <>
          <div style={{ maxHeight: 220, overflow: 'auto', marginBottom: 8 }}>
            <Table
              size="small"
              columns={errCols}
              dataSource={errors}
              rowKey={(e, i) => `${e.rowNo}-${e.field}-${i}`}
              pagination={false}
              scroll={{ y: 200 }}
              style={{ fontSize: 12 }}
            />
          </div>
          <Space>
            <Text style={{ fontSize: 12.5 }}>跳过错误行，仅导入合法数据</Text>
            <Switch size="small" checked={skipErrors} onChange={setSkipErrors} />
            {!skipErrors && (
              <Text type="danger" style={{ fontSize: 12 }}>严格模式：请先修正文件后重新上传</Text>
            )}
          </Space>
        </>
      )}
    </div>
  );

  const renderDone = () => (
    <Alert
      type="success"
      showIcon
      message={`导入完成：成功写入 ${result?.ok ?? 0} 条「${targetLabel}」记录`}
      description={errors.length ? `另有 ${errors.length} 处校验错误行已被跳过` : undefined}
    />
  );

  const bodyByStep = [renderUpload, renderMapping, renderValidate, renderDone][step];

  const footerByStep: ReactNode[][] = [
    [<Button key="cancel" onClick={onClose}>取消</Button>],
    [
      <Button key="back" size="small" onClick={() => setStep(0)}>上一步</Button>,
      <Button key="next" size="small" type="primary" disabled={requiredUnmapped.length > 0} onClick={() => setStep(2)}>下一步：校验</Button>,
    ],
    [
      <Button key="back" size="small" onClick={() => setStep(1)}>上一步</Button>,
      <Button key="import" size="small" type="primary" loading={importing} disabled={!canImport || !validRows.length} onClick={handleImport}>
        导入 {validRows.length} 行
      </Button>,
    ],
    [
      <Button key="again" size="small" onClick={() => setStep(0)}>再导入一份</Button>,
      <Button key="done" size="small" type="primary" onClick={onClose}>完成</Button>,
    ],
  ];

  return (
    <Modal
      open={open}
      title={`导入${targetLabel}（Excel）`}
      width={640}
      onCancel={onClose}
      footer={footerByStep[step]}
      destroyOnHidden
    >
      <Steps
        size="small"
        current={step}
        items={STEP_TITLES.map((t) => ({ title: t }))}
        style={{ marginBottom: 16 }}
      />
      {bodyByStep()}
    </Modal>
  );
}
