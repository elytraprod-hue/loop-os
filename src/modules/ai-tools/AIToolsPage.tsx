// src/modules/ai-tools/AIToolsPage.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export const AIToolsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ferramentas de IA</h1>
        <p className="text-text-muted">
          Gerencie suas ferramentas de IA para produção audiovisual
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de Ferramentas</CardTitle>
            <CardDescription>Ferramentas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-text-muted">Nenhuma ferramenta cadastrada</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ativas</CardTitle>
            <CardDescription>Ferramentas ativas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-text-muted">Nenhuma ferramenta ativa</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Execuções</CardTitle>
            <CardDescription>Execuções de ferramentas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-text-muted">Nenhuma execução registrada</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ferramentas Recentes</CardTitle>
          <CardDescription>Últimas ferramentas utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-text-muted">
            <p>Nenhuma ferramenta utilizada ainda</p>
            <p className="text-sm mt-1">Comece utilizando uma ferramenta de IA</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
