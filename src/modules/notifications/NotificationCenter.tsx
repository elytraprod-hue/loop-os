// src/modules/notifications/NotificationCenter.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export const NotificationCenter = () => {
  return (
    <div className="fixed bottom-4 right-4 w-96 space-y-2 z-50">
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Centro de notificações em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-text-muted">
            <p>Nenhuma notificação nova</p>
            <p className="text-sm mt-1">As notificações aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
