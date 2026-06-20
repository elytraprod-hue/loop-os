import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from './authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (user) return <Navigate to="/" replace />;

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '0 16px' }}>
      <Card>
        <CardHeader style={{ textAlign: 'center' }}>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
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

            <Input
              {...register('password')}
              label="Senha"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
            />

            {error && (
              <div style={{ borderRadius: 6, background: 'rgba(239,68,68,0.1)', padding: 12, fontSize: 14, color: 'var(--text-error)' }}>
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading}>
              Entrar
            </Button>
          </form>
        </CardContent>

        <CardFooter style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link to="/forgot-password" style={{ fontSize: 14, color: 'var(--accent)', textDecoration: 'underline' }}>
            Esqueceu sua senha?
          </Link>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Não tem conta?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
