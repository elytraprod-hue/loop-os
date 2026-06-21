// src/modules/notifications/NotificationCenter.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { useAuth } from '../auth/AuthProvider';
import { useNotificationsQuery, useMarkNotificationReadMutation } from '../../hooks/useDbQuery';
import { supabase } from '../../lib/supabase';
import { Bell, X, Check } from 'lucide-react';

const formatDistanceToNow = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'agora mesmo';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h atrás`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
  return d.toLocaleDateString('pt-BR');
};

export const NotificationCenter = () => {
  const { user } = useAuth();
  const { data: notifications, refetch } = useNotificationsQuery(user?.id);
  const markAsRead = useMarkNotificationReadMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  useEffect(() => {
    const unread = notifications?.filter(n => !n.read).length || 0;
    setUnreadCount(unread);
  }, [notifications]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead.mutateAsync(id);
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications?.filter(n => !n.read) || [];
    await Promise.all(unread.map(n => markAsRead.mutateAsync(n.id)));
    refetch();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check size={16} color="#10b981" />;
      case 'warning': return <Bell size={16} color="#f59e0b" />;
      case 'error': return <Bell size={16} color="#ef4444" />;
      default: return <Bell size={16} color="#3b82f6" />;
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 50 }}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          border: '1px solid var(--glass-border)',
        }}
      >
        <Bell size={20} color="var(--accent)" />
        {unreadCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          className="glass animate-scaleIn"
          style={{
            position: 'absolute',
            bottom: 64,
            right: 0,
            width: 384,
            maxHeight: 500,
            borderRadius: 16,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Card style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
            <CardHeader style={{ paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <CardTitle style={{ fontSize: 16 }}>Notificações</CardTitle>
                  <CardDescription style={{ fontSize: 12 }}>Atualizações em tempo real</CardDescription>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>
            </CardHeader>
            <CardContent style={{ paddingTop: 0, overflowY: 'auto', maxHeight: 400 }}>
              {notifications && notifications.length > 0 ? (
                <>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        marginBottom: 12,
                        borderRadius: 8,
                        background: 'var(--accent-dim)',
                        border: '1px solid var(--accent-border)',
                        color: 'var(--accent)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`glass-soft ${!n.read ? 'glass-hover' : ''}`}
                        style={{
                          padding: 12,
                          borderRadius: 10,
                          cursor: 'pointer',
                          border: !n.read ? '1px solid var(--accent-border)' : '1px solid transparent',
                          background: !n.read ? 'var(--accent-soft)' : 'transparent',
                        }}
                        onClick={() => !n.read && handleMarkAsRead(n.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          {getNotificationIcon(n.type)}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</span>
                              {!n.read && (
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                              )}
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 6 }}>
                              {n.body}
                            </p>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {formatDistanceToNow(new Date(n.created_at))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                  <Bell size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <p style={{ fontSize: 14 }}>Nenhuma notificação</p>
                  <p style={{ fontSize: 12, marginTop: 4 }}>As notificações aparecerão aqui</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
