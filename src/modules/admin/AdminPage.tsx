// src/modules/admin/AdminPage.tsx
import { useState } from 'react';
import { Users as UsersIcon, Settings, Save } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { useWorkspaceQuery, useWorkspaceMembersQuery, useUpdateWorkspaceMutation } from '../../hooks/useDbQuery';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export const AdminPage = () => {
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = (workspace as { id?: string } | null)?.id;
  const { data: members, isLoading, error, refetch } = useWorkspaceMembersQuery(workspaceId);
  const updateWorkspace = useUpdateWorkspaceMutation();

  const [workspaceName, setWorkspaceName] = useState(workspace?.name || '');
  const [workspaceSlug, setWorkspaceSlug] = useState(workspace?.slug || '');
  const [primaryColor, setPrimaryColor] = useState('#0d0d0d');
  const [accentColor, setAccentColor] = useState('#f97316');

  const handleSaveSettings = async () => {
    if (!workspaceId) return;
    
    try {
      const { error } = await supabase
        .from('workspaces')
        .update({
          name: workspaceName,
          slug: workspaceSlug,
          config: { primaryColor, accentColor },
        })
        .eq('id', workspaceId);

      if (error) throw error;
      
      toast.success('Configurações salvas com sucesso');
      refetch();
    } catch (err) {
      toast.error('Erro ao salvar configurações');
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fadeUp" style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeUp">
        <ErrorState description="Erro ao carregar membros" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="animate-fadeUp">
      <div className="mb-8">
        <h1 className="font-display font-black text-4xl text-[#e8e8e8]">Admin</h1>
        <p className="text-[#aaaaaa] text-sm mt-1">Configurações e gestão do workspace</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <UsersIcon size={18} className="text-orange-500" />
          <h2 className="font-display font-bold text-base text-[#e8e8e8]">Membros</h2>
        </div>
        <div className="flex flex-col gap-2">
          {(members ?? []).length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhum membro encontrado.</p>
          ) : (
            (members ?? []).map((m) => (
              <div key={m.id ?? m.user_id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{m.users?.email ?? 'Sem nome'}</div>
                  <div className="text-gray-500 text-xs">{m.users?.email}</div>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${m.role === 'owner' ? 'bg-green-500/10 text-green-400' : m.role === 'admin' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  {m.role}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Settings size={18} className="text-orange-500" />
          <h2 className="font-display font-bold text-base text-[#e8e8e8]">Configurações do Workspace</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Nome do Workspace
            </label>
            <input
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Nome do workspace"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Slug (URL)
            </label>
            <input
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none w-full"
              value={workspaceSlug}
              onChange={(e) => setWorkspaceSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="slug-do-workspace"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Cor Primária
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-10 rounded-lg border-none cursor-pointer"
              />
              <input
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none flex-1"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#0d0d0d"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Cor de Destaque
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-12 h-10 rounded-lg border-none cursor-pointer"
              />
              <input
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#e8e8e8] placeholder:text-[#666] focus:border-orange-500/50 focus:outline-none flex-1"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                placeholder="#f97316"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} loading={updateWorkspace.isPending}>
            <Save size={16} />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};
