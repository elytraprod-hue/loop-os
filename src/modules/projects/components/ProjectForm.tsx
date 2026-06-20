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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('title')}
        label="Título"
        placeholder="Nome do projeto"
        error={errors.title?.message}
      />

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Tipo</label>
        <select
          {...register('type')}
          className="block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
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
          <label className="block text-sm font-medium text-text-primary mb-1">Cliente</label>
          <select
            {...register('client_id')}
            className="block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Sem cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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

      <div className="flex justify-end gap-2 pt-2">
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
