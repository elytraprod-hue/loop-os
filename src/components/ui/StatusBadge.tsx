import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'client' | 'project' | 'deliverable' | 'transaction';
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: 'badge-success',
  inactive: 'badge-neutral',
  prospect: 'badge-info',
  briefing: 'badge-warning',
  pre_production: 'badge-info',
  production: 'badge-accent',
  post_production: 'badge-neutral',
  review: 'badge-warning',
  delivered: 'badge-success',
  archived: 'badge-neutral',
  pending: 'badge-warning',
  processing: 'badge-info',
  ready: 'badge-success',
  paid: 'badge-success',
  cancelled: 'badge-danger',
  draft: 'badge-neutral',
  approved: 'badge-success',
  rejected: 'badge-danger',
};

const labels: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  prospect: 'Prospect',
  briefing: 'Briefing',
  pre_production: 'Pré-produção',
  production: 'Produção',
  post_production: 'Pós-produção',
  review: 'Revisão',
  delivered: 'Entregue',
  archived: 'Arquivado',
  pending: 'Pendente',
  processing: 'Processando',
  ready: 'Pronto',
  paid: 'Pago',
  cancelled: 'Cancelado',
  draft: 'Rascunho',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const style = statusStyles[status] ?? 'badge-neutral';
  const label = labels[status] ?? status;

  return (
    <span className={cn('badge', style, className)}>
      {label}
    </span>
  );
};
