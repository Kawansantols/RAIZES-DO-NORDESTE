import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const { data } = await api.post('/auth/login', { email, senha });
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('usuario', JSON.stringify(data.user));
      if (data.user.role === 'ADMIN' || data.user.role === 'GERENTE') {
        navigate('/admin');
      } else {
        navigate('/cardapio');
      }
    } catch {
      setErro('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #c8955a; }

        .login-bg {
          min-height: 100vh;
          background: 
            radial-gradient(ellipse at top, #e8b87a 0%, #c8733a 40%, #8b4513 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
          overflow: hidden;
        }

        .sol {
          position: fixed;
          top: -60px;
          right: 80px;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, #ffd700 30%, #ff8c00 70%, transparent 100%);
          border-radius: 50%;
          opacity: 0.6;
          animation: pulso 3s ease-in-out infinite;
        }

        .cacto1 {
          position: fixed;
          bottom: 0;
          left: 30px;
          font-size: 7rem;
          opacity: 0.15;
          animation: balanco 4s ease-in-out infinite;
        }

        .cacto2 {
          position: fixed;
          bottom: 0;
          right: 20px;
          font-size: 5rem;
          opacity: 0.12;
          animation: balanco 5s ease-in-out infinite reverse;
        }

        .chao {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(to top, #8b6914, #c8973a, transparent);
          opacity: 0.4;
        }

        @keyframes pulso {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.75; }
        }

        @keyframes balanco {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card {
         background: #fdf6ec !important;
          color-scheme: light;
          border-radius: 24px;
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 30px 80px rgba(80, 30, 0, 0.4);
          animation: slideUp 0.6s ease;
          position: relative;
          z-index: 10;
          border: 1px solid rgba(200, 120, 50, 0.2);
        }

        .titulo {
          font-size: 2rem;
          font-weight: 900;
          color: #7c2d12;
          text-align: center;
          letter-spacing: -0.5px;
        }

        .subtitulo {
          color: #a16207;
          text-align: center;
          font-size: 14px;
          margin-top: 6px;
        }

        .label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #7c2d12;
          margin-bottom: 6px;
          letter-spacing: 0.3px;
        }

        .input {
          width: 100%;
          border: 2px solid #e8c99a;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 15px;
          background: #fffbf5;
          color: #3b1f0a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input:focus {
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
        }

        .input::placeholder { color: #c4a882; }

        .btn {
          width: 100%;
          background: linear-gradient(135deg, #7c2d12, #c2410c, #d97706);
          color: white;
          font-weight: 800;
          font-size: 16px;
          padding: 13px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 15px rgba(124, 45, 18, 0.4);
          letter-spacing: 0.3px;
          margin-top: 6px;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124, 45, 18, 0.5);
        }

        .btn:active { transform: translateY(0); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .erro {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
          color: #dc2626;
          font-size: 13px;
        }

        .rodape {
          text-align: center;
          font-size: 13px;
          color: #a16207;
          margin-top: 1.5rem;
        }

        .link {
          color: #7c2d12;
          font-weight: 700;
          text-decoration: none;
        }

        .link:hover { text-decoration: underline; }

        .divisor {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8c99a, transparent);
          margin: 1.5rem 0;
        }
      `}</style>

      <div className="login-bg">
        <div className="sol"/>
        <div className="cacto1">🌵</div>
        <div className="cacto2">🌵</div>
        <div className="chao"/>

        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🌵</div>
            <h1 className="titulo">Raízes do Nordeste</h1>
            <p className="subtitulo">Bem-vindo de volta! Faça seu login</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">📧 E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="label">🔒 Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            {erro && <div className="erro">⚠️ {erro}</div>}

            <button type="submit" className="btn" disabled={loading}>
              {loading ? '⏳ Entrando...' : '🚀 Entrar'}
            </button>
          </form>

          <div className="divisor"/>

          <p className="rodape">
            Não tem conta?{' '}
            <a href="/cadastro" className="link">Cadastre-se aqui</a>
          </p>
        </div>
      </div>
    </>
  );
}