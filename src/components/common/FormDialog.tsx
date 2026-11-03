import { Modal, Button, type ModalProps } from 'antd';
import type { ReactNode } from 'react';

interface FormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave?: () => void;
  children: ReactNode;
  width?: number;
  saveText?: string;
  hideSave?: boolean;
}

export default function FormDialog({
  open,
  title,
  onClose,
  onSave,
  children,
  width = 640,
  saveText = '保存',
  hideSave = false,
}: FormDialogProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={title}
      width={width}
      footer={
        <>
          <Button onClick={onClose} size="small">取消</Button>
          {!hideSave && <Button type="primary" onClick={onSave} size="small">{saveText}</Button>}
        </>
      }
      styles={{ body: { minHeight: 100 } }}
    >
      <div style={{ marginTop: 8 }}>{children}</div>
    </Modal>
  );
}

export type FormDialogModalProps = ModalProps;
