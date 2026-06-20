// src/modules/notifications/NotificationCenter.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export const NotificationCenter = () => {
  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, width: 384, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 50 }}>
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Centro de notificações em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)' }}>
            <p>Nenhuma notificação nova</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>As notificações aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
