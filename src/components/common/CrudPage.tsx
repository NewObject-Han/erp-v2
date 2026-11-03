import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GridColDef } from '@mui/x-data-grid';
import type { BaseEntity } from '../types/common';
import DataTable from './DataTable';
import PageHeader from './PageHeader';
import StatusBadge from './StatusBadge';
import FormDialog from './FormDialog';

interface CrudPageProps<T extends BaseEntity> {
  title: string;
  subtitle?: string;
  queryKey: string;
  resourceName: string;
  listHook: (params?: { keyword?: string }) => ReturnType<typeof useQuery>;
  createHook: () => ReturnType<typeof useMutation>;
  updateHook: () => ReturnType<typeof useMutation>;
  deleteHook: () => ReturnType<typeof useMutation>;
  columns: (labels: Record<string, string>) => GridColDef[];
  formFields: (
    initial: Partial<T> | null,
    options: Record<string, { value: string; label: string }[]>
  ) => React.ReactNode;
  labels?: Record<string, string>;
  workflowSteps?: { label: string }[];
  currentStep?: string;
  codeGenerator?: (items: unknown[]) => string;
}

/** 通用 CRUD 页面：列表 + 搜索 + 新增/编辑/删除 + 弹窗表单 */
export default function CrudPage<T extends BaseEntity>({
  title,
  subtitle,
  queryKey,
  resourceName,
  listHook,
  createHook,
  updateHook,
  deleteHook,
  columns,
  formFields,
  labels = {},
  workflowSteps,
  currentStep,
}: CrudPageProps<T>) {
  const [keyword, setKeyword] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);

  const { data, isLoading } = listHook({ keyword });
  const createMut = createHook();
  const updateMut = updateHook();
  const deleteMut = deleteHook();
  const qc = useQueryClient();

  const rows = useMemo(() => (data as { list: T[] })?.list ?? [], [data]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (row: T) => {
    setEditing(row);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      // 编辑时从表单获取最新数据
      const formData = (document.getElementById('crud-form-data') as HTMLElement)?.dataset;
      if (formData) {
        updateMut.mutate(
          { id: editing.id, data: JSON.parse(formData.json) },
          {
            onSuccess: () => {
              setDialogOpen(false);
              qc.invalidateQueries({ queryKey: [queryKey] });
            },
          }
        );
      }
    } else {
      createMut.mutate({} as Partial<T>, {
        onSuccess: () => {
          setDialogOpen(false);
          qc.invalidateQueries({ queryKey: [queryKey] });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除？')) {
      deleteMut.mutate(id, {
        onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
      });
    }
  };

  const cols = columns(labels);

  // 添加操作列
  const allCols = [
    ...cols,
    {
      headerName: '操作',
      field: '__actions',
      width: 140,
      sortable: false,
      renderCell: (params: { row: T }) => (
        <Stack direction="row" spacing={0.5}>
          <Button
            size="small"
            variant="text"
            onClick={() => openEdit(params.row)}
            sx={{ minWidth: 0, py: 0, fontSize: 12 }}
          >
            编辑
          </Button>
          <Button
            size="small"
            variant="text"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            sx={{ minWidth: 0, py: 0, fontSize: 12 }}
          >
            删除
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={openCreate}
            sx={{ py: 0.3 }}
          >
            新增
          </Button>
        }
      />

      {workflowSteps && currentStep && (
        <Box sx={{ mb: 2 }}>
          <WorkflowGuideHelper steps={workflowSteps} current={currentStep} />
        </Box>
      )}

      <Paper elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} alignItems="center">
          <TextField
            size="small"
            placeholder="搜索..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            sx={{ width: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Box sx={{ height: 400 }}>
          {isLoading ? (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>加载中...</Box>
          ) : (
            <DataTable rows={rows} columns={allCols} />
          )}
        </Box>
      </Paper>

      <FormDialog
        open={dialogOpen}
        title={editing ? `编辑${title}` : `新增${title}`}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        width={720}
      >
        {/* 表单区域：由业务页面自定义 */}
        {formFields(editing, {})}
        {/* 隐藏数据容器：实际表单数据由业务页面自行管理 */}
        <Box id="crud-form-data" data-json="{}" sx={{ display: 'none' }} />
      </FormDialog>
    </Box>
  );
}

/** 内联 WorkflowGuide 简化版 */
function WorkflowGuideHelper({ steps, current }: { steps: { label: string }[]; current: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 0.5,
        px: 1.5,
        py: 1,
        backgroundColor: 'action.hover',
        borderRadius: 1,
        mb: 1.5,
      }}
    >
      {steps.map((step, i) => {
        const isCurrent = step.label === current;
        return (
          <Box key={step.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {i > 0 && (
              <Box sx={{ color: 'text.disabled', fontSize: 12 }}>→</Box>
            )}
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                fontSize: 12,
                fontWeight: isCurrent ? 600 : 400,
                bgcolor: isCurrent ? 'primary.main' : 'transparent',
                color: isCurrent ? '#fff' : 'text.secondary',
                whiteSpace: 'nowrap',
              }}
            >
              {step.label}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
