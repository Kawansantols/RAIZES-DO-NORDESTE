import { pagamentoRepository } from '../../infrastructure/repositories/pagamentoRepository';
import { pedidoRepository } from '../../infrastructure/repositories/pedidoRepository';
import { AppError } from '../../shared/errors/AppError';

export const pagamentoService = {
  async processar(pedidoId: number) {
    const pedido = await pedidoRepository.findById(pedidoId);
    if (!pedido) {
      throw new AppError('Pedido não encontrado.', 404, 'PEDIDO_NAO_ENCONTRADO');
    }

    if (pedido.status !== 'AGUARDANDO_PAGAMENTO') {
      throw new AppError('Pedido não está aguardando pagamento.', 409, 'STATUS_INVALIDO');
    }

    const pagamentoExistente = await pagamentoRepository.findByPedido(pedidoId);
    if (pagamentoExistente) {
      throw new AppError('Pagamento já registrado para este pedido.', 409, 'PAGAMENTO_JA_REGISTRADO');
    }

    await pagamentoRepository.create({ pedidoId, valor: pedido.total });

    // Simulação mock — 80% aprovado, 20% recusado
    const aprovado = Math.random() > 0.2;

    if (aprovado) {
      await pagamentoRepository.updateStatus(pedidoId, 'APROVADO', JSON.stringify({
        transacaoId: `MOCK-${Date.now()}`,
        mensagem: 'Pagamento aprovado com sucesso.',
      }));

      await pedidoRepository.updateStatus(pedidoId, 'PAGO');

      return {
        status: 'APROVADO',
        mensagem: 'Pagamento aprovado com sucesso.',
        pedidoStatus: 'PAGO',
      };
    } else {
      await pagamentoRepository.updateStatus(pedidoId, 'RECUSADO', JSON.stringify({
        transacaoId: `MOCK-${Date.now()}`,
        mensagem: 'Pagamento recusado pela operadora.',
      }));

      return {
        status: 'RECUSADO',
        mensagem: 'Pagamento recusado pela operadora.',
        pedidoStatus: 'AGUARDANDO_PAGAMENTO',
      };
    }
  },

  async consultar(pedidoId: number) {
    const pagamento = await pagamentoRepository.findByPedido(pedidoId);
    if (!pagamento) {
      throw new AppError('Pagamento não encontrado.', 404, 'PAGAMENTO_NAO_ENCONTRADO');
    }
    return pagamento;
  },
};