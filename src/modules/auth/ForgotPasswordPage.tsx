import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from './authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';

const forgotSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const { resetPassword, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  if (user) return <Navigate to="/" replace />;

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(data.email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar email');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '0 16px' }}>
        <Card style={{ width: '100%', maxWidth: 448 }}>
          <CardHeader style={{ textAlign: 'center' }}>
            <CardTitle>Email enviado!</CardTitle>
            <CardDescription>
              Verifique sua caixa de entrada para redefinir sua senha.
            </CardDescription>
          </CardHeader>
          <CardFooter style={{ justifyContent: 'center' }}>
            <Link to="/signin" style={{ fontSize: 14, color: 'var(--accent)', textDecoration: 'none' }}>
              Voltar ao login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '0 16px' }}>
      <Card style={{ width: '100%', maxWidth: 448 }}>
        <CardHeader style={{ textAlign: 'center' }}>
          <CardTitle>Redefinir senha</CardTitle>
          <CardDescription>
            Digite seu email para receber o link de redefinição
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              {...register('email')}
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
            />

            {error && (
              <div style={{ background: 'rgba(239,68,68,.1)', borderRadius: 8, padding: 12, fontSize: 14, color: 'var(--text-error)' }}>
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading}>
              Enviar link
            </Button>
          </form>
        </CardContent>

        <CardFooter style={{ justifyContent: 'center' }}>
          <Link to="/signin" style={{ fontSize: 14, color: 'var(--accent)', textDecoration: 'none' }}>
            Voltar ao login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
