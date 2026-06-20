// src/modules/documents/components/DocumentForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const documentSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  type: z.enum(['briefing', 'roteiro', 'proposta', 'contrato', 'ordem_servico']),
});

export type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentFormProps {
  defaultValues?: Partial<DocumentFormData>;
  onSubmit: (data: DocumentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const docTypes: { value: string; label: string }[] = [
  { value: 'briefing', label: 'Briefing' },
  { value: 'roteiro', label: 'Roteiro' },
  { value: 'proposta', label: 'Proposta' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'ordem_servico', label: 'Ordem de Serviço' },
];

export const DocumentForm = ({ defaultValues, onSubmit, onCancel, isLoading }: DocumentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input
        {...register('title')}
        label="Título"
        placeholder="Título do documento"
        error={errors.title?.message}
      />

      <div>
        <label htmlFor="doc-type" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Tipo</label>
        <select
          id="doc-type"
          {...register('type')}
          style={{ display: 'block', width: '100%', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', padding: '8px 12px', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
        >
          {docTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Criar
        </Button>
      </div>
    </form>
  );
};
