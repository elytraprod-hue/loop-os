// src/modules/admin/AdminPage.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export const AdminPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administração</h1>
        <p className="text-text-muted">
          Gerencie usuários e configurações do sistema
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de Usuários</CardTitle>
            <CardDescription>Usuários no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-text-muted">Nenhum usuário cadastrado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Workspaces</CardTitle>
            <CardDescription>Workspaces ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-text-muted">Nenhum workspace ativo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Permissões</CardTitle>
            <CardDescription>Permissões configuradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-text-muted">Nenhuma permissão configurada</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuários Recentes</CardTitle>
          <CardDescription>Últimos usuários adicionados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-text-muted">
            <p>Nenhum usuário cadastrado ainda</p>
            <p className="text-sm mt-1">Comece adicionando seu primeiro usuário</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
