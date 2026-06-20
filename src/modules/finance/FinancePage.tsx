// src/modules/finance/FinancePage.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export const FinancePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-text-muted">
          Gerencie suas finanças e previsões
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de Receitas</CardTitle>
            <CardDescription>Receitas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 0,00</div>
            <p className="text-sm text-text-muted">Nenhuma receita registrada</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total de Despesas</CardTitle>
            <CardDescription>Despesas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 0,00</div>
            <p className="text-sm text-text-muted">Nenhuma despesa registrada</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Previsão</CardTitle>
            <CardDescription>Previsão de receitas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 0,00</div>
            <p className="text-sm text-text-muted">Nenhuma previsão definida</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Últimas transações registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-text-muted">
            <p>Nenhuma transação registrada ainda</p>
            <p className="text-sm mt-1">Comece adicionando sua primeira transação</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
