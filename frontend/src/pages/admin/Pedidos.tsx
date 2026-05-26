import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: '#d97706',
  PAGO: '#059669',
  EM_PREPARO: '#2563eb',
  PRONTO: '#7c3aed',
  ENTREGUE: '#059669',
  CANCELADO: '#dc2626',
};

const statusBg: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: '#fef3c7',
  PAGO: '#d1fae5',
  EM_PREPARO: '#dbeafe',
  PRONTO: '#ede9fe',
  ENTREGUE: '#d1fae5',
  CANCELADO: '#fee2e2',
};

export default function Pedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCanal, setFiltroCanal] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  async function carregar() {
    try {
      const params: any = {};
      if (filtroCanal) params.canalPedido = filtroCanal;
      if (filtroStatus) params.status = filtroStatus;
      const { data } = await api.get('/pedidos', { params });
      setPedidos(data);
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [filtroCanal, filtroStatus]);

  async function atualizarStatus(id: number, status: string) {
    try {
      await api.patch(`/pedidos/${id}/status`, { status });
      carregar();
    } catch {
      alert('Erro ao atualizar status.');
    }
  }

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fdf6ec; color-scheme: light; }
        .layout { min-height: 100vh; background: #fdf6ec; font-family: sans-serif; }
        .navbar {
          background: linear-gradient(135deg, #7c2d12, #c2410c);
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 15px rgba(124,45,18,0.3);
        }
        .navbar-brand { color: white; font-size: 1.4rem; font-weight: 900; }
        .navbar-user { color: rgba(255,255,255,0.9); font-size: 14px; display: flex; align-items: center; gap: 12px; }
        .btn-logout { background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; }
        .btn-logout:hover { background: rgba(255,255,255,0.3); }
        .sidebar { position: fixed; left: 0; top: 60px; bottom: 0; width: 220px; background: white; border-right: 1px solid #e8c99a; padding: 1.5rem 0; }
        .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 12px 20px; color: #7c2d12; font-size: 14px; font-weight: 600; cursor: pointer; border-left: 3px solid transparent; }
        .sidebar-item:hover, .sidebar-item.active { background: #fef3c7; border-left-color: #d97706; }
        .main { margin-left: 220px; padding: 2rem; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: #7c2d12; margin-bottom: 1.5rem; }
        .filtros { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .select { border: 2px solid #e8c99a; border-radius: 10px; padding: 8px 14px; font-size: 14px; color: #3b1f0a; background: white; outline: none; cursor: pointer; }
        .select:focus { border-color: #d97706; }
        .table-container { background: white; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.07); border: 1px solid #e8c99a; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #fef3c7; padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 700; color: #7c2d12; }
        td { padding: 12px 16px; font-size: 14px; color: #3b1f0a; border-bottom: 1px solid #fef3c7; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fffbf5; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .status-select { border: 1px solid #e8c99a; border-radius: 8px; padding: 4px 8px; font-size: 12px; font-weight: 600; cursor: pointer; outline: none; }
        .loading { display: flex; align-items: center; justify-content: center; height: 60vh; font-size: 2rem; }
        .btn-refresh { background: #fef3c7; border: 1px solid #e8c99a; color: #7c2d12; padding: 8px 16px; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600; }
        .btn-refresh:hover { background: #fde68a; }
      `}</style>

      <div className="layout">
        <nav className="navbar">
          <div className="navbar-brand">🌵 Raízes do Nordeste</div>
          <div className="navbar-user">
            👤 Admin
            <button className="btn-logout" onClick={logout}>Sair</button>
          </div>
        </nav>

        <aside className="sidebar">
          <div className="sidebar-item" onClick={() => navigate('/admin')}>📊 Dashboard</div>
          <div className="sidebar-item active">🛒 Pedidos</div>
          <div className="sidebar-item" onClick={() => navigate('/admin/produtos')}>🍽️ Produtos</div>
          <div className="sidebar-item" onClick={() => navigate('/admin/estoque')}>📦 Estoque</div>
          <div className="sidebar-item" onClick={() => navigate('/admin/unidades')}>🏪 Unidades</div>
        </aside>

        <main className="main">
          <h1 className="page-title">🛒 Pedidos</h1>

          <div className="filtros">
            <select className="select" value={filtroCanal} onChange={(e) => setFiltroCanal(e.target.value)}>
              <option value="">Todos os canais</option>
              <option value="APP">APP</option>
              <option value="TOTEM">TOTEM</option>
              <option value="BALCAO">BALCÃO</option>
              <option value="PICKUP">PICKUP</option>
              <option value="WEB">WEB</option>
            </select>

            <select className="select" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="">Todos os status</option>
              <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
              <option value="PAGO">Pago</option>
              <option value="EM_PREPARO">Em Preparo</option>
              <option value="PRONTO">Pronto</option>
              <option value="ENTREGUE">Entregue</option>
              <option value="CANCELADO">Cancelado</option>
            </select>

            <button className="btn-refresh" onClick={carregar}>🔄 Atualizar</button>
          </div>

          {loading ? (
            <div className="loading">🌵 Carregando...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Canal</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Atualizar Status</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>{p.canalPedido}</td>
                      <td>R$ {p.total.toFixed(2)}</td>
                      <td>
                        <span className="badge" style={{ background: statusBg[p.status], color: statusColors[p.status] }}>
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={p.status}
                          onChange={(e) => atualizarStatus(p.id, e.target.value)}
                          style={{ background: statusBg[p.status], color: statusColors[p.status] }}
                        >
                          <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                          <option value="PAGO">Pago</option>
                          <option value="EM_PREPARO">Em Preparo</option>
                          <option value="PRONTO">Pronto</option>
                          <option value="ENTREGUE">Entregue</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </td>
                      <td>{new Date(p.createdAt).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}