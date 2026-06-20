import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Play, FileText, DollarSign, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  useProjectQuery,
  useWorkspaceQuery,
  useDeliverablesQuery,
  useDocumentsQuery,
  useTransactionsQuery,
  useUpdateProjectMutation,
  useCreateDeliverableMutation,
  useCreateDocumentMutation,
  useCreateTransactionMutation
} from '../../hooks/useDbQuery';
import { toast } from 'sonner';

const statusOrder = ['briefing', 'pre_production', 'production', 'post_production', 'review', 'delivered'];

const statusLabels: Record<string, string> = {
  briefing: 'Briefing',
  pre_production: 'Pré-Prod',
  production: 'Produção',
  post_production: 'Pós-Prod',
  review: 'Revisão',
  delivered: 'Entregue',
  archived: 'Arquivado',
};

const documentTypes = [
  { value: 'briefing', label: 'Briefing' },
  { value: 'roteiro', label: 'Roteiro' },
  { value: 'proposta', label: 'Proposta comercial' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'ordem_servico', label: 'Ordem de Serviço (OS)' },
];

export const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: workspace } = useWorkspaceQuery();
  const workspaceId = workspace?.id;

  const { data: project, isLoading: projectLoading, error: projectError, refetch } = useProjectQuery(projectId);
  const { data: deliverables, isLoading: delivLoading } = useDeliverablesQuery(workspaceId);
  const { data: documents, isLoading: docLoading } = useDocumentsQuery(workspaceId);
  const { data: transactions, isLoading: txLoading } = useTransactionsQuery(workspaceId);

  const updateProject = useUpdateProjectMutation();
  const createDeliverable = useCreateDeliverableMutation();
  const createDocument = useCreateDocumentMutation();
  const createTx = useCreateTransactionMutation();

  // Modals state
  const [delivModalOpen, setDelivModalOpen] = useState(false);
  const [delivTitle, setDelivTitle] = useState('');
  const [delivUrl, setDelivUrl] = useState('');

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('briefing');

  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txDescription, setTxDescription] = useState('');
  const [txType, setTxType] = useState('expense');
  const [txAmount, setTxAmount] = useState('');

  // Date edit state
  const [editingDates, setEditingDates] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (projectLoading) {
    return (
      <div className="animate-fadeUp" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="animate-fadeUp" style={{ paddingTop: 40 }}>
        <Link to="/app/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
          <ArrowLeft size={14} /> Voltar aos Projetos
        </Link>
        <ErrorState description="Não foi possível carregar o projeto." onRetry={() => refetch()} />
      </div>
    );
  }

  // Filters
  const projectDeliverables = (deliverables ?? []).filter(d => d.project_id === projectId);
  const projectDocuments = (documents ?? []).filter(d => d.project_id === projectId);
  const projectTransactions = (transactions ?? []).filter(t => t.project_id === projectId);

  // Financial sums
  const totalIncome = projectTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = projectTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const profit = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? Math.round((profit / totalIncome) * 100) : 0;

  // Stepper update click
  const handleStepClick = (statusKey: string) => {
    updateProject.mutate(
      { id: project.id, status: statusKey },
      {
        onSuccess: () => {
          toast.success(`Projeto alterado para: ${statusLabels[statusKey]}`);
          refetch();
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  // Submit Deliverable
  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delivTitle.trim() || !projectId) return;

    createDeliverable.mutate(
      {
        project_id: projectId,
        title: delivTitle.trim(),
        video_url: delivUrl.trim() || 'https://test-streams.mux.dev/x36xhqq/playlist.m3u8', // Default HLS fallback
      },
      {
        onSuccess: () => {
          toast.success('Novo entregável adicionado!');
          setDelivModalOpen(false);
          setDelivTitle('');
          setDelivUrl('');
          refetch();
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  // Submit Document
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !workspaceId || !projectId) return;

    createDocument.mutate(
      {
        workspace_id: workspaceId,
        project_id: projectId,
        title: docTitle.trim(),
        type: docType,
        content: { body: '' },
      },
      {
        onSuccess: () => {
          toast.success('Documento criado!');
          setDocModalOpen(false);
          setDocTitle('');
          setDocType('briefing');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  // Submit Transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDescription.trim() || !txAmount || !workspaceId || !projectId) return;

    createTx.mutate(
      {
        workspace_id: workspaceId,
        project_id: projectId,
        type: txType,
        amount: parseFloat(txAmount),
        description: txDescription.trim(),
      },
      {
        onSuccess: () => {
          toast.success('Lançamento financeiro adicionado!');
          setTxModalOpen(false);
          setTxDescription('');
          setTxAmount('');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  // Update Dates
  const handleUpdateDates = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject.mutate(
      {
        id: project.id,
        start_date: startDate || null,
        end_date: endDate || null,
      },
      {
        onSuccess: () => {
          toast.success('Cronograma atualizado!');
          setEditingDates(false);
          refetch();
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  // Visual Gantt calculation
  const startStr = project.start_date;
  const endStr = project.end_date;
  let ganttProgress = 0;
  if (startStr && endStr) {
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    const now = Date.now();
    if (now >= end) ganttProgress = 100;
    else if (now <= start) ganttProgress = 0;
    else ganttProgress = Math.round(((now - start) / (end - start)) * 100);
  }

  return (
    <div className="animate-fadeUp">
      <Link to="/app/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Voltar aos Projetos
      </Link>

      {/* Hero Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {project.type.replace('_', ' ')}
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 4, fontFamily: "'Syne', sans-serif" }}>{project.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Cliente: <span style={{ fontWeight: 600, color: '#fff' }}>{project.clients?.name || 'Cliente Direto'}</span>
          </p>
        </div>
        <div className="glass" style={{ padding: '10px 16px', borderRadius: 12, fontSize: 13, borderLeft: '3px solid var(--accent)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Status Atual: </span>
          <span style={{ fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
            {statusLabels[project.status] || project.status}
          </span>
        </div>
      </div>

      {/* Stepper / Production Phases */}
      <div className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color="var(--accent)" /> Fases de Produção Audiovisual
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflowX: 'auto', padding: '10px 0' }}>
          {/* Connector Line */}
          <div style={{ position: 'absolute', left: '8%', right: '8%', top: '50%', transform: 'translateY(-14px)', height: 2, background: 'rgba(255,255,255,0.08)', zIndex: 0 }} />
          
          {statusOrder.map((stepKey, idx) => {
            const isActive = project.status === stepKey;
            const isPast = statusOrder.indexOf(project.status) > idx;
            
            return (
              <button
                key={stepKey}
                onClick={() => handleStepClick(stepKey)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  zIndex: 1,
                  minWidth: 90,
                  opacity: isActive || isPast ? 1 : 0.45,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: isActive ? 'var(--accent)' : isPast ? 'var(--success-dim)' : 'var(--bg-secondary)',
                  border: `2px solid ${isActive ? 'var(--accent)' : isPast ? 'var(--success)' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all .25s',
                  boxShadow: isActive ? '0 0 14px var(--accent-glow)' : 'none',
                }}>
                  {isPast ? (
                    <CheckCircle2 size={16} color="var(--success)" />
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? '#000' : '#fff' }}>0{idx + 1}</span>
                  )}
                </div>
                <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--accent)' : '#fff', whiteSpace: 'nowrap' }}>
                  {statusLabels[stepKey]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gantt & Schedule Section */}
      <div className="glass" style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} color="var(--accent)" /> Cronograma do Projeto (Gantt)
          </h3>
          <button
            onClick={() => {
              setStartDate(startStr || '');
              setEndDate(endStr || '');
              setEditingDates(!editingDates);
            }}
            className="btn btn--sm"
            style={{ fontSize: 12, color: 'var(--accent)' }}
          >
            {editingDates ? 'Cancelar' : 'Ajustar Datas'}
          </button>
        </div>

        {editingDates ? (
          <form onSubmit={handleUpdateDates} style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap', padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Data de Início</label>
              <input type="date" className="input-base" style={{ fontSize: 13 }} value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Data de Conclusão</label>
              <input type="date" className="input-base" style={{ fontSize: 13 }} value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn--primary" style={{ padding: '10px 16px', fontSize: 13 }}>Salvar</button>
          </form>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
              <span>Início: <strong style={{ color: '#fff' }}>{startStr ? new Date(startStr).toLocaleDateString('pt-BR') : 'Definir data'}</strong></span>
              {startStr && endStr && (
                <span>Progresso Temporal: <strong style={{ color: 'var(--accent)' }}>{ganttProgress}%</strong></span>
              )}
              <span>Prazo Final: <strong style={{ color: '#fff' }}>{endStr ? new Date(endStr).toLocaleDateString('pt-BR') : 'Definir data'}</strong></span>
            </div>
            {startStr && endStr ? (
              <div style={{ width: '100%', height: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  width: `${ganttProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-dim), var(--accent))',
                  borderRadius: 99,
                  boxShadow: '0 0 10px var(--accent-glow)',
                  transition: 'width .3s ease',
                }} />
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '10px 0' }}>
                Defina as datas de início e conclusão do projeto para visualizar a barra de cronograma Gantt.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Grid Layout of sub-modules */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start', flexWrap: 'wrap' }}>
        
        {/* Deliverables / Video Review */}
        <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--glass-border)', paddingBottom: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Play size={16} color="var(--accent)" /> Video Review & Deliverables
            </h3>
            <button onClick={() => setDelivModalOpen(true)} className="btn-icon btn-ghost" title="Adicionar Vídeo">
              <Plus size={16} color="var(--accent)" />
            </button>
          </div>

          {delivLoading ? (
            <LoadingSpinner />
          ) : projectDeliverables.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              Nenhum vídeo cadastrado. Clique no botão de mais (+) para adicionar sua primeira versão.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {projectDeliverables.map(d => (
                <div key={d.id} className="glass-soft" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>{d.title}</h4>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Criado em: {new Date(d.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Link to={`/app/video-review/${d.id}`} className="btn btn--sm" style={{ padding: '6px 12px', fontSize: 11, background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: '#fff', borderRadius: 8 }}>
                      Revisar
                    </Link>
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/review/${d.public_token}`;
                        navigator.clipboard.writeText(link);
                        toast.success('Link público de review copiado!');
                      }}
                      className="btn btn--sm btn--secondary"
                      style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8 }}
                    >
                      Copiar Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents Section */}
        <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--glass-border)', paddingBottom: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={16} color="var(--accent)" /> Estúdio de Documentos
            </h3>
            <button onClick={() => setDocModalOpen(true)} className="btn-icon btn-ghost" title="Adicionar Documento">
              <Plus size={16} color="var(--accent)" />
            </button>
          </div>

          {docLoading ? (
            <LoadingSpinner />
          ) : projectDocuments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              Nenhum documento gerado para este projeto.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {projectDocuments.map(doc => (
                <div key={doc.id} className="glass-soft" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>{doc.title}</h4>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Tipo: <strong style={{ color: 'var(--accent)' }}>{doc.type.toUpperCase()}</strong> · Status: {doc.status}
                    </span>
                  </div>
                  <Link to={`/app/documents`} className="btn btn--sm" style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8 }}>
                    Abrir Editor
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Financial ledger of the project */}
        <div className="glass" style={{ padding: 24, borderRadius: 20, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--glass-border)', paddingBottom: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarSign size={16} color="var(--accent)" /> Lançamentos e Margem Financeira do Projeto
            </h3>
            <button onClick={() => setTxModalOpen(true)} className="btn btn--sm" style={{ padding: '6px 12px', fontSize: 12, background: 'var(--accent-dim)', color: '#fff', borderRadius: 8, display: 'flex', gap: 4 }}>
              <Plus size={14} /> Lançar Valor
            </button>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Orçamento (Faturado)', value: totalIncome, color: 'var(--success)' },
              { label: 'Custos de Produção', value: totalExpense, color: 'var(--danger)' },
              { label: 'Resultado Operacional', value: profit, color: profit >= 0 ? 'var(--accent)' : 'var(--danger)' },
              { label: 'Margem do Projeto', value: `${margin}%`, color: 'var(--info)' },
            ].map((metric, i) => (
              <div key={i} className="glass-soft" style={{ padding: '14px 16px', borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>{metric.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: metric.color }}>
                  {typeof metric.value === 'string' ? metric.value : `R$ ${metric.value.toLocaleString('pt-BR')}`}
                </div>
              </div>
            ))}
          </div>

          {txLoading ? (
            <LoadingSpinner />
          ) : projectTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              Nenhuma transação financeira vinculada a este projeto. Lance receitas/despesas para monitorar o orçamento.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', fontSize: 11, color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500 }}>Descrição</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500 }}>Tipo</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500 }}>Valor</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTransactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>{tx.description}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className={`badge ${tx.type === 'income' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 10 }}>
                          {tx.type === 'income' ? 'Orçamento' : 'Despesa'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                        {tx.type === 'income' ? '+' : '-'} R$ {Number(tx.amount).toLocaleString('pt-BR')}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className={`badge ${tx.status === 'paid' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>
                          {tx.status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Deliverable Modal */}
      <Modal open={delivModalOpen} onClose={() => setDelivModalOpen(false)} title="Adicionar Deliverable / Versão de Vídeo">
        <form onSubmit={handleAddDeliverable} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Título da Versão *"
            placeholder="Ex: Corte Diretor v1, Versão Final"
            value={delivTitle}
            onChange={e => setDelivTitle(e.target.value)}
            required
          />
          <Input
            label="URL do Vídeo (HLS m3u8 ou MP4)"
            placeholder="Deixe em branco para usar vídeo de demonstração"
            value={delivUrl}
            onChange={e => setDelivUrl(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn--secondary" onClick={() => setDelivModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary">Adicionar</button>
          </div>
        </form>
      </Modal>

      {/* Add Document Modal */}
      <Modal open={docModalOpen} onClose={() => setDocModalOpen(false)} title="Criar Documento do Projeto">
        <form onSubmit={handleAddDocument} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Título do Documento *"
            placeholder="Ex: Roteiro da Cena 1, Proposta Comercial"
            value={docTitle}
            onChange={e => setDocTitle(e.target.value)}
            required
          />
          <Select
            label="Tipo de Documento *"
            value={docType}
            onChange={setDocType}
            options={documentTypes}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn--secondary" onClick={() => setDocModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary">Criar Documento</button>
          </div>
        </form>
      </Modal>

      {/* Add Transaction Modal */}
      <Modal open={txModalOpen} onClose={() => setTxModalOpen(false)} title="Lançar Valor Financeiro">
        <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Descrição *"
            placeholder="Ex: Pagamento 1ª Parcela, Compra de Lentes"
            value={txDescription}
            onChange={e => setTxDescription(e.target.value)}
            required
          />
          <Select
            label="Tipo de Lançamento *"
            value={txType}
            onChange={setTxType}
            options={[
              { value: 'income', label: 'Receita (Orçamento)' },
              { value: 'expense', label: 'Despesa / Custo' }
            ]}
          />
          <Input
            label="Valor (R$) *"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={txAmount}
            onChange={e => setTxAmount(e.target.value)}
            required
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn--secondary" onClick={() => setTxModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary">Adicionar Lançamento</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
