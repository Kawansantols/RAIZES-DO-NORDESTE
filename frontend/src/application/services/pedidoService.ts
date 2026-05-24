import { CanalPedido, StatusPedido } from '@prisma/client';
import { pedidoRepository } from '../../infrastructure/repositories/pedidoRepository';
import { produtoRepository } from '../../infrastructure/repositories/produtoRepository';
import { estoqueRepository } from '../../infrastructure/repositories/estoqueRepository';
import { AppError } from '../../shared/errors/AppError';

export const pedidoService = {
  async criar(data: {
    usuarioId: number;
    unidadeId: number;
    canalPedido: CanalPedido;
    itens: { produtoId: number; quantidade: number }[];
  }) {
    if (!data.canalPedido) {
      throw new AppError('Canal do pedido é obrigatório.', 400, 'CANAL_PEDIDO_OBRIGATORIO');
    }

    let total = 0;
    const itensComPreco = [];

    for (const item of data.itens) {
      const produto = await produtoRepository.findById(item.produtoId);
      if (!produto) {
        throw new AppError(`Produto ${item.produtoId} não encontrado.`, 404, 'PRODUTO_NAO_ENCONTRADO');
      }

      const estoque = await estoqueRepository.findByProduto(item.produtoId);
      if (!estoque || estoque.quantidade < item.quantidade) {
        throw new AppError(
          `Estoque insuficiente para o produto ${produto.nome}.`,
          409,
          'ESTOQUE_INSUFICIENTE'
        );
      }

      await estoqueRepository.decrementar(item.produtoId, item.quantidade);

      total += produto.preco * item.quantidade;
      itensComPreco.push({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: produto.preco,
      });
    }

    return pedidoRepository.create({
      usuarioId: data.usuarioId,
      unidadeId: data.unidadeId,
      canalPedido: data.canalPedido,
      total,
      itens: itensComPreco,
    });
  },

  async buscarPorId(id: number) {
    const pedido = await pedidoRepository.findById(id);
    if (!pedido) {
      throw new AppError('Pedido não encontrado.', 404, 'PEDIDO_NAO_ENCONTRADO');
    }
    return pedido;
  },

  async listar(filters: { canalPedido?: CanalPedido; status?: StatusPedido }) {
    return pedidoRepository.findAll(filters);
  },

  async atualizarStatus(id: number, status: StatusPedido) {
    await pedidoService.buscarPorId(id);
    return pedidoRepository.updateStatus(id, status);
  },
};