import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Produtos() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(1);
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', unidadeId: 1 });
  const [showForm, setShowForm] = useState(false);

  async function carregar() {
    try {
      const [u, p] = await Promise.all([
        api.get('/unidades'),
        api.get(`/produtos/unidade/${unidadeSelecionada}`),
      ]);
      setUnidades(u.data);
      setProdutos(p.data);
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [unidadeSelecionada]);

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/produtos', {
        nome: form.nome,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        unidadeId: unidadeSelecionada,
      });
      setForm({ nome: '', descricao: '', preco: '', unidadeId: 1 });
      setShowForm(false);
      carregar();
    } catch {
      alert('Erro ao criar produto.');
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
        .navbar { background: linear-gradient(135deg, #7c2d12, #c2410c); padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(124,45,18,0.3); }
        .navbar-brand { color: white; font-size: 1.4rem; font-weight: 900; }
        .navbar-user { color: rgba(255,255,255,0.9); font-size: 14px; display: flex; align-items: center; gap: 12px; }
        .btn-logout { background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; }
        .sidebar { position: fixed; left: 0; top: 60px; bottom: 0; width: 220px; background: white; border-right: 1px solid #e8c99a; padding: 1.5rem 0; }
        .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 12px 20px; color: #7c2d12; font-size: 14px; font-weight: 600; cursor: pointer; border-left: 3px solid transparent; }
        .sidebar-item:hover, .sidebar-item.active { background: #fef3c7; border-left-color: #d97706; }
        .main { margin-left: 220px; padding: 2rem; }
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: #7c2d12; }
        .btn-novo { background: linear-gradient(135deg, #7c2d12, #d97706); color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 700; }
        .btn-novo:hover { opacity: 0.9; }
        .filtros { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .select { border: 2px solid #e8c99a; border-radius: 10px; padding: 8px 14px; font-size: 14px; color: #3b1f0a; background: white; outline: none; }
        .select:focus { border-color: #d97706; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal { background: #fdf6ec; border-radius: 20px; padding: 2rem; width: 100%; max-width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .modal-title { font-size: 1.3rem; font-weight: 800; color: #7c2d12; margin-bottom: 1.5rem; }
        .form-group { margin-bottom: 1rem; }
        .label { display: block; font-size: 13px; font-weight: 700; color: #7c2d12; margin-bottom: 6px; }
        .input { width: 100%; border: 2px solid #e8c99a; border-radius: 10px; padding: 10px 14px; font-size: 14px; background: white; color: #3b1f0a; outline: none; }
        .input:focus { border-color: #d97706; }
        .modal-btns { display: flex; gap: 1rem; margin-top: 1.5rem; }
        .btn-salvar { flex: 1; background: linear-gradient(135deg, #7c2d12, #d97706); color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 15px; }
        .btn-cancelar { flex: 1; background: #f5f5f5; color: #7c2d12; border: 1px solid #e8c99a; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 15px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.2rem; }
        .produto-card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.07); border: 1px solid #e8c99a; transition: transform 0.2s; }
        .produto-card:hover { transform: translateY(-3px); }
        .produto-nome { font-size: 1.1rem; font-weight: 800; color: #7c2d12; margin-bottom: 6px; }
        .produto-desc { font-size: 13px; color: #a16207; margin-bottom: 10px; }
        .produto-preco { font-size: 1.4rem; font-weight: 900; color: #059669; }
        .produto-estoque { font-size: 12px; color: #6b7280; margin-top: 6px; }
        .badge-ativo { background: #d1fae5; color: #065f46; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .loading { display: flex; align-items: center; justify-content: center; height: 60vh; font-size: 2rem; }
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
          <div className="sidebar-item" onClick={() => navigate('/admin/pedidos')}>🛒 Pedidos</div>
          <div className="sidebar-item active">🍽️ Produtos</div>
          <div className="sidebar-item" onClick={() => navigate('/admin/estoque')}>📦 Estoque</div>
          <div className="sidebar-item" onClick={() => navigate('/admin/unidades')}>🏪 Unidades</div>
        </aside>

        <main className="main">
          <div className="page-header">
            <h1 className="page-title">🍽️ Produtos</h1>
            <button className="btn-novo" onClick={() => setShowForm(true)}>+ Novo Produto</button>
          </div>

          <div className="filtros">
            <select className="select" value={unidadeSelecionada} onChange={(e) => setUnidadeSelecionada(Number(e.target.value))}>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>{u.nome}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading">🌵 Carregando...</div>
          ) : (
            <div className="grid">
              {produtos.map((p) => (
                <div key={p.id} className="produto-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="produto-nome">{p.nome}</div>
                    <span className="badge-ativo">ativo</span>
                  </div>
                  <div className="produto-desc">{p.descricao || 'Sem descrição'}</div>
                  <div className="produto-preco">R$ {p.preco.toFixed(2)}</div>
                  <div className="produto-estoque">
                    📦 Estoque: {p.estoque?.quantidade ?? 0} unidades
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-title">🍽️ Novo Produto</div>
              <form onSubmit={handleCriar}>
                <div className="form-group">
                  <label className="label">Nome</label>
                  <input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required placeholder="Nome do produto" />
                </div>
                <div className="form-group">
                  <label className="label">Descrição</label>
                  <input className="input" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição (opcional)" />
                </div>
                <div className="form-group">
                  <label className="label">Preço (R$)</label>
                  <input className="input" type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required placeholder="0.00" />
                </div>
                <div className="modal-btns">
                  <button type="button" className="btn-cancelar" onClick={() => setShowForm(false)}>Cancelar</button>
                  <button type="submit" className="btn-salvar">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}