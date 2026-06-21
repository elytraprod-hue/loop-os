import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Github } from 'lucide-react';
import { useAuth } from './authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
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

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login com GitHub');
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
              Entrar
            </Button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={handleGithubLogin}
              isLoading={isGithubLoading}
              className="w-full"
            >
              <Github size={18} />
              Entrar com GitHub
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Link to="/forgot-password" className="text-sm text-orange-500 hover:underline">
            Esqueceu sua senha?
          </Link>
          <p className="text-sm text-gray-500">
            Não tem conta?{' '}
            <Link to="/signup" className="text-orange-500 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
