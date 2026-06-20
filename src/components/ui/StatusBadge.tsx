// src/components/ui/StatusBadge.tsx
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'client' | 'project' | 'deliverable' | 'transaction';
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-text-muted/10 text-text-muted border-text-muted/20',
  prospect: 'bg-info/10 text-info border-info/20',
  briefing: 'bg-warning/10 text-warning border-warning/20',
  pre_production: 'bg-info/10 text-info border-info/20',
  production: 'bg-accent/10 text-accent border-accent/20',
  post_production: 'bg-primary/10 text-primary border-primary/20',
  review: 'bg-warning/10 text-warning border-warning/20',
  delivered: 'bg-success/10 text-success border-success/20',
  archived: 'bg-text-muted/10 text-text-muted border-text-muted/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  processing: 'bg-info/10 text-info border-info/20',
  ready: 'bg-success/10 text-success border-success/20',
  paid: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-error/10 text-error border-error/20',
  draft: 'bg-text-muted/10 text-text-muted border-text-muted/20',
  approved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-error/10 text-error border-error/20',
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
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status] ?? 'bg-surface text-text-muted border-border',
        className
      )}
    >
      {labels[status] ?? status}
    </span>
  );
};
