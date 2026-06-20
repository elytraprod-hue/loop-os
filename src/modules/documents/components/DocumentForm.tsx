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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('title')}
        label="Título"
        placeholder="Título do documento"
        error={errors.title?.message}
      />

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Tipo</label>
        <select
          {...register('type')}
          className="block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {docTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
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
