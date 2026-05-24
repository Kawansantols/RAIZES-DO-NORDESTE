export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'CLIENTE' | 'ATENDENTE' | 'COZINHA' | 'GERENTE' | 'ADMIN';
}

export interface Unidade {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  ativo: boolean;
}

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  ativo: boolean;
  unidadeId: number;
  estoque?: { quantidade: number };
}

export interface ItemPedido {
  id: number;
  quantidade: number;
  precoUnitario: number;
  produtoId: number;
  produto?: Produto;
}

export interface Pedido {
  id: number;
  canalPedido: 'APP' | 'TOTEM' | 'BALCAO' | 'PICKUP' | 'WEB';
  status: 'AGUARDANDO_PAGAMENTO' | 'PAGO' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';
  total: number;
  usuarioId: number;
  unidadeId: number;
  itens: ItemPedido[];
  createdAt: string;
}

export interface Estoque {
  id: number;
  quantidade: number;
  produtoId: number;
  unidadeId: number;
  produto?: Produto;
}

export interface Fidelidade {
  id: number;
  pontos: number;
  usuarioId: number;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: Usuario;
}