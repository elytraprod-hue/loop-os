// src/modules/crm/components/ClientForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').or(z.literal('')).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  defaultValues?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ClientForm = ({ defaultValues, onSubmit, onCancel, isLoading }: ClientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('name')}
        label="Nome"
        placeholder="Nome do cliente"
        error={errors.name?.message}
      />
      <Input
        {...register('email')}
        label="Email"
        type="email"
        placeholder="cliente@email.com"
        error={errors.email?.message}
      />
      <Input
        {...register('phone')}
        label="Telefone"
        placeholder="(11) 99999-0000"
        error={errors.phone?.message}
      />
      <Input
        {...register('company')}
        label="Empresa"
        placeholder="Nome da empresa"
        error={errors.company?.message}
      />
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
