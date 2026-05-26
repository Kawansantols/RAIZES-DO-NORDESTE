import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/admin/Dashboard';
import Pedidos from './pages/admin/Pedidos';
import Produtos from './pages/admin/Produtos';
import Cardapio from './pages/cliente/Cardapio';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/pedidos" element={<Pedidos />} />
        <Route path="/admin/produtos" element={<Produtos />} />
        <Route path="/cardapio" element={<Cardapio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;