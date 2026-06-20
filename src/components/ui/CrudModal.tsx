import React from 'react';

interface CrudModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  onDelete?: () => void;
  saveLabel?: string;
  deleteLabel?: string;
  loading?: boolean;
}

export const CrudModal = ({ open, onClose, title, children, onSave, onDelete, saveLabel, deleteLabel, loading }: CrudModalProps) => {
  return (
    <CrudModalWrapper open={open} onClose={onClose} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          {onDelete && (
            <button className="btn btn-danger" onClick={onDelete} disabled={loading}>
              {deleteLabel || 'Excluir'}
            </button>
          )}
          {onSave && (
            <button className="btn btn-primary" onClick={onSave} disabled={loading}>
              {loading ? 'Salvando...' : saveLabel || 'Salvar'}
            </button>
          )}
        </div>
      </div>
    </CrudModalWrapper>
  );
};

function CrudModalWrapper({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {children}
    </Modal>
  );
}

import { Modal } from './Modal';

export type { CrudModalProps };
