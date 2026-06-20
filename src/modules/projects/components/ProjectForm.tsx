// src/modules/projects/components/ProjectForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const projectSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  type: z.enum(['film', 'commercial', 'documentary', 'web_series', 'other']),
  client_id: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormData>;
  clients?: { id: string; name: string }[];
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProjectForm = ({ defaultValues, clients, onSubmit, onCancel, isLoading }: ProjectFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input
        {...register('title')}
        label="Título"
        placeholder="Nome do projeto"
        error={errors.title?.message}
      />

      <div>
        <label htmlFor="type" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Tipo</label>
        <select
          id="type"
          {...register('type')}
          style={{ display: 'block', width: '100%', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', padding: '8px 12px', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
        >
          <option value="film">Filme</option>
          <option value="commercial">Comercial</option>
          <option value="documentary">Documentário</option>
          <option value="web_series">Web Série</option>
          <option value="other">Outro</option>
        </select>
      </div>

      {clients && clients.length > 0 && (
        <div>
          <label htmlFor="client_id" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Cliente</label>
          <select
            id="client_id"
            {...register('client_id')}
            style={{ display: 'block', width: '100%', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', padding: '8px 12px', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
          >
            <option value="">Sem cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input
          {...register('start_date')}
          label="Data de início"
          type="date"
        />
        <Input
          {...register('end_date')}
          label="Data de término"
          type="date"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Salvar
        </Button>
      </div>
    </form>
  );
};
