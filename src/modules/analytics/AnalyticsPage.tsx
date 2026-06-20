// src/modules/analytics/AnalyticsPage.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Análises</h1>
        <p className="text-text-muted">
          Acompanhe métricas operacionais
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Visualizações</CardTitle>
            <CardDescription>Métricas operacionais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0%</div>
            <p className="text-sm text-text-muted">Nenhuma métrica disponível</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
            <CardDescription>Relatórios operacionais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-text-muted">Nenhum relatório gerado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>KPIs</CardTitle>
            <CardDescription>Indicadores-chave de performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-text-muted">Nenhum KPI configurado</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Análises Recentes</CardTitle>
          <CardDescription>Últimas análises geradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-text-muted">
            <p>Nenhuma análise gerada ainda</p>
            <p className="text-sm mt-1">Comece gerando análises operacionais</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
