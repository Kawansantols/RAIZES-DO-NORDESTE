import { estoqueRepository } from '../../infrastructure/repositories/estoqueRepository';
import { produtoRepository } from '../../infrastructure/repositories/produtoRepository';
import { AppError } from '../../shared/errors/AppError';

export const estoqueService = {
  async consultarPorUnidade(unidadeId: number) {
    return estoqueRepository.findByUnidade(unidadeId);
  },

  async consultarPorProduto(produtoId: number) {
    const estoque = await estoqueRepository.findByProduto(produtoId);
    if (!estoque) {
      throw new AppError('Estoque não encontrado para este produto.', 404, 'ESTOQUE_NAO_ENCONTRADO');
    }
    return estoque;
  },

  async atualizar(produtoId: number, quantidade: number) {
    const produto = await produtoRepository.findById(produtoId);
    if (!produto) {
      throw new AppError('Produto não encontrado.', 404, 'PRODUTO_NAO_ENCONTRADO');
    }

    if (quantidade < 0) {
      throw new AppError('Quantidade não pode ser negativa.', 400, 'QUANTIDADE_INVALIDA');
    }

    return estoqueRepository.upsert(produtoId, produto.unidadeId, quantidade);
  },
};