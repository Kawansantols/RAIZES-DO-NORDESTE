import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    async function carregar() {
      try {
        const [p, pr, u] = await Promise.all([
          api.get('/pedidos'),
          api.get('/produtos/unidade/1'),
          api.get('/unidades'),
        ]);
        setPedidos(p.data);
        setProdutos(pr.data);
        setUnidades(u.data);
      } catch {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  const pedidosHoje = pedidos.filter(p => 
    new Date(p.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const faturamento = pedidos
    .filter(p => p.status === 'PAGO' || p.status === 'ENTREGUE')
    .reduce((acc, p) => acc + p.total, 0);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fdf6ec; color-scheme: light; }

        .admin-layout {
          min-height: 100vh;
          background: #fdf6ec;
          font-family: sans-serif;
        }

        .navbar {
          background: linear-gradient(135deg, #7c2d12, #c2410c);
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 15px rgba(124,45,18,0.3);
        }

        .navbar-brand {
          color: white;
          font-size: 1.4rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .navbar-user {
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-logout {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          transition: background 0.2s;
        }

        .btn-logout:hover { background: rgba(255,255,255,0.3); }

        .sidebar {
          position: fixed;
          left: 0;
          top: 60px;
          bottom: 0;
          width: 220px;
          background: white;
          border-right: 1px solid #e8c99a;
          padding: 1.5rem 0;
          box-shadow: 2px 0 10px rgba(0,0,0,0.05);
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          color: #7c2d12;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
          border-left: 3px solid transparent;
        }

        .sidebar-item:hover, .sidebar-item.active {
          background: #fef3c7;
          border-left-color: #d97706;
        }

        .main {
          margin-left: 220px;
          padding: 2rem;
        }

        .page-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #7c2d12;
          margin-bottom: 1.5rem;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.2rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.07);
          border: 1px solid #e8c99a;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-icon { font-size: 2rem; margin-bottom: 8px; }
        .stat-value { font-size: 2rem; font-weight: 900; color: #7c2d12; }
        .stat-label { font-size: 13px; color: #a16207; margin-top: 4px; }

        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #7c2d12;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .table-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.07);
          border: 1px solid #e8c99a;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #fef3c7;
          padding: 12px 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          color: #7c2d12;
        }

        td {
          padding: 12px 16px;
          font-size: 14px;
          color: #3b1f0a;
          border-bottom: 1px solid #fef3c7;
        }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fffbf5; }

        .badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .badge-aguardando { background: #fef3c7; color: #d97706; }
        .badge-pago { background: #d1fae5; color: #065f46; }
        .badge-preparo { background: #dbeafe; color: #1e40af; }
        .badge-pronto { background: #ede9fe; color: #5b21b6; }
        .badge-entregue { background: #d1fae5; color: #065f46; }
        .badge-cancelado { background: #fee2e2; color: #dc2626; }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60vh;
          font-size: 2rem;
          animation: pulso 1s infinite;
        }

        @keyframes pulso {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div className="admin-layout">
        <nav className="navbar">
          <div className="navbar-brand">🌵 Raízes do Nordeste</div>
          <div className="navbar-user">
            👤 {usuario.nome}
            <button className="btn-logout" onClick={logout}>Sair</button>
          </div>
        </nav>

        <aside className="sidebar">
          <div className="sidebar-item active">📊 Dashboard</div>
          <div className="sidebar-item" onClick={() => navigate('/admin/pedidos')}>🛒 Pedidos</div>
          <div className="sidebar-item" onClick={() => navigate('/admin/produtos')}>🍽️ Produtos</div>
          <div className="sidebar-item" onClick={() => navigate('/admin/estoque')}>📦 Estoque</div>
          <div className="sidebar-item" onClick={() => navigate('/admin/unidades')}>🏪 Unidades</div>
        </aside>

        <main className="main">
          {loading ? (
            <div className="loading">🌵 Carregando...</div>
          ) : (
            <>
              <h1 className="page-title">📊 Dashboard</h1>

              <div className="cards-grid">
                <div className="stat-card">
                  <div className="stat-icon">🛒</div>
                  <div className="stat-value">{pedidos.length}</div>
                  <div className="stat-label">Total de Pedidos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-value">{pedidosHoje}</div>
                  <div className="stat-label">Pedidos Hoje</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-value">R$ {faturamento.toFixed(2)}</div>
                  <div className="stat-label">Faturamento Total</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🍽️</div>
                  <div className="stat-value">{produtos.length}</div>
                  <div className="stat-label">Produtos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏪</div>
                  <div className="stat-value">{unidades.length}</div>
                  <div className="stat-label">Unidades</div>
                </div>
              </div>

              <div className="section-title">🛒 Últimos Pedidos</div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Canal</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.slice(0, 8).map((p) => (
                      <tr key={p.id}>
                        <td>#{p.id}</td>
                        <td>{p.canalPedido}</td>
                        <td>R$ {p.total.toFixed(2)}</td>
                        <td>
                          <span className={`badge badge-${p.status.toLowerCase().replace('_', '-').replace('aguardando_pagamento', 'aguardando').replace('em_preparo', 'preparo')}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>{new Date(p.createdAt).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}