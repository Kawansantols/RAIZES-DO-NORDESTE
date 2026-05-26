import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Cardapio() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(1);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
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
    carregar();
  }, [unidadeSelecionada]);

  function adicionarCarrinho(produto: any) {
    setCarrinho((prev) => {
      const existe = prev.find((i) => i.produtoId === produto.id);
      if (existe) {
        return prev.map((i) => i.produtoId === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i);
      }
      return [...prev, { produtoId: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 }];
    });
  }

  function removerCarrinho(produtoId: number) {
    setCarrinho((prev) => {
      const item = prev.find((i) => i.produtoId === produtoId);
      if (item && item.quantidade > 1) {
        return prev.map((i) => i.produtoId === produtoId ? { ...i, quantidade: i.quantidade - 1 } : i);
      }
      return prev.filter((i) => i.produtoId !== produtoId);
    });
  }

  const total = carrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  async function fazerPedido() {
    if (carrinho.length === 0) return alert('Adicione itens ao carrinho!');
    try {
      await api.post('/pedidos', {
        unidadeId: unidadeSelecionada,
        canalPedido: 'APP',
        itens: carrinho.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
      });
      setCarrinho([]);
      alert('🎉 Pedido realizado com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao fazer pedido.');
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
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-brand { color: white; font-size: 1.4rem; font-weight: 900; }
        .navbar-right { display: flex; align-items: center; gap: 12px; }
        .navbar-user { color: rgba(255,255,255,0.9); font-size: 14px; }
        .btn-logout { background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; }

        .content { display: flex; gap: 0; }

        .main { flex: 1; padding: 2rem; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: #7c2d12; margin-bottom: 0.5rem; }
        .page-sub { color: #a16207; font-size: 14px; margin-bottom: 1.5rem; }

        .filtros { margin-bottom: 1.5rem; }
        .select { border: 2px solid #e8c99a; border-radius: 10px; padding: 8px 14px; font-size: 14px; color: #3b1f0a; background: white; outline: none; }
        .select:focus { border-color: #d97706; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.2rem; }

        .produto-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.07);
          border: 1px solid #e8c99a;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }

        .produto-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
        .produto-emoji { font-size: 2.5rem; margin-bottom: 10px; }
        .produto-nome { font-size: 1.1rem; font-weight: 800; color: #7c2d12; margin-bottom: 6px; }
        .produto-desc { font-size: 13px; color: #a16207; margin-bottom: 12px; flex: 1; }
        .produto-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
        .produto-preco { font-size: 1.3rem; font-weight: 900; color: #059669; }
        .produto-estoque { font-size: 11px; color: #9ca3af; margin-top: 4px; }

        .btn-add {
          background: linear-gradient(135deg, #7c2d12, #d97706);
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 1.3rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s;
        }

        .btn-add:hover { transform: scale(1.1); }
        .btn-add:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .carrinho {
          width: 320px;
          background: white;
          border-left: 1px solid #e8c99a;
          padding: 1.5rem;
          position: sticky;
          top: 60px;
          height: calc(100vh - 60px);
          overflow-y: auto;
          box-shadow: -4px 0 15px rgba(0,0,0,0.05);
        }

        .carrinho-title { font-size: 1.2rem; font-weight: 800; color: #7c2d12; margin-bottom: 1rem; }

        .carrinho-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #fef3c7;
        }

        .carrinho-item-nome { font-size: 13px; font-weight: 700; color: #3b1f0a; }
        .carrinho-item-preco { font-size: 12px; color: #a16207; }

        .qtd-controls { display: flex; align-items: center; gap: 8px; }
        .btn-qtd { background: #fef3c7; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 1rem; font-weight: 700; color: #7c2d12; display: flex; align-items: center; justify-content: center; }
        .btn-qtd:hover { background: #fde68a; }

        .carrinho-total {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 2px solid #e8c99a;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-label { font-size: 14px; font-weight: 700; color: #7c2d12; }
        .total-valor { font-size: 1.4rem; font-weight: 900; color: #059669; }

        .btn-pedido {
          width: 100%;
          background: linear-gradient(135deg, #7c2d12, #d97706);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 800;
          margin-top: 1rem;
          transition: opacity 0.2s;
        }

        .btn-pedido:hover { opacity: 0.9; }
        .btn-pedido:disabled { opacity: 0.5; cursor: not-allowed; }

        .carrinho-vazio { text-align: center; color: #a16207; font-size: 14px; padding: 2rem 0; }

        .loading { display: flex; align-items: center; justify-content: center; height: 60vh; font-size: 2rem; }
      `}</style>

      <div className="layout">
        <nav className="navbar">
          <div className="navbar-brand">🌵 Raízes do Nordeste</div>
          <div className="navbar-right">
            <span className="navbar-user">👤 {usuario.nome}</span>
            <button className="btn-logout" onClick={logout}>Sair</button>
          </div>
        </nav>

        <div className="content">
          <main className="main">
            <h1 className="page-title">🍽️ Cardápio</h1>
            <p className="page-sub">Escolha os itens e adicione ao carrinho</p>

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
                    <div className="produto-emoji">
                      {p.nome.toLowerCase().includes('cuscuz') ? '🌽' :
                       p.nome.toLowerCase().includes('tapioca') ? '🫓' :
                       p.nome.toLowerCase().includes('suco') ? '🥤' :
                       p.nome.toLowerCase().includes('café') ? '☕' :
                       p.nome.toLowerCase().includes('bolo') ? '🎂' : '🍽️'}
                    </div>
                    <div className="produto-nome">{p.nome}</div>
                    <div className="produto-desc">{p.descricao || 'Delícia nordestina!'}</div>
                    <div className="produto-estoque">📦 {p.estoque?.quantidade ?? 0} disponíveis</div>
                    <div className="produto-footer">
                      <div>
                        <div className="produto-preco">R$ {p.preco.toFixed(2)}</div>
                      </div>
                      <button
                        className="btn-add"
                        onClick={() => adicionarCarrinho(p)}
                        disabled={!p.estoque || p.estoque.quantidade === 0}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          <aside className="carrinho">
            <div className="carrinho-title">🛒 Carrinho</div>

            {carrinho.length === 0 ? (
              <div className="carrinho-vazio">
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛒</div>
                Seu carrinho está vazio
              </div>
            ) : (
              <>
                {carrinho.map((item) => (
                  <div key={item.produtoId} className="carrinho-item">
                    <div>
                      <div className="carrinho-item-nome">{item.nome}</div>
                      <div className="carrinho-item-preco">R$ {(item.preco * item.quantidade).toFixed(2)}</div>
                    </div>
                    <div className="qtd-controls">
                      <button className="btn-qtd" onClick={() => removerCarrinho(item.produtoId)}>-</button>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>{item.quantidade}</span>
                      <button className="btn-qtd" onClick={() => adicionarCarrinho({ id: item.produtoId, nome: item.nome, preco: item.preco })}>+</button>
                    </div>
                  </div>
                ))}

                <div className="carrinho-total">
                  <span className="total-label">Total</span>
                  <span className="total-valor">R$ {total.toFixed(2)}</span>
                </div>

                <button className="btn-pedido" onClick={fazerPedido}>
                  🚀 Fazer Pedido
                </button>
              </>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}