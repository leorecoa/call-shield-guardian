import { BlockedCall } from "@/types";

/**
 * Classe para gerenciar chamadas bloqueadas com métodos otimizados
 */
export class CallManager {
  private static MAX_CALLS = 1000;
  
  /**
   * Adiciona uma nova chamada ao array, mantendo o limite máximo
   * Complexidade: O(1) - inserção no início é constante
   */
  static addCall(calls: BlockedCall[], newCall: BlockedCall): BlockedCall[] {
    // Limitar o número máximo de chamadas armazenadas
    const result = [newCall, ...calls];
    if (result.length > this.MAX_CALLS) {
      return result.slice(0, this.MAX_CALLS);
    }
    return result;
  }
  
  /**
   * Filtra chamadas por tipo de forma otimizada
   * Complexidade: O(n) - uma única passagem pelo array
   */
  static filterByType(calls: BlockedCall[], type: BlockedCall["callType"]): BlockedCall[] {
    return calls.filter(call => call.callType === type);
  }
  
  /**
   * Filtra chamadas por data de forma otimizada
   * Complexidade: O(n) - uma única passagem pelo array
   */
  static filterByDate(calls: BlockedCall[], startDate: number, endDate: number): BlockedCall[] {
    return calls.filter(call => call.timestamp >= startDate && call.timestamp <= endDate);
  }
  
  /**
   * Obtém chamadas de hoje de forma otimizada
   * Complexidade: O(n) - uma única passagem pelo array
   */
  static getTodayCalls(calls: BlockedCall[]): BlockedCall[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    return calls.filter(call => call.timestamp >= todayTimestamp);
  }
  
  /**
   * Busca chamadas por número ou IP de forma otimizada
   * Complexidade: O(n) - uma única passagem pelo array
   */
  static searchCalls(calls: BlockedCall[], searchTerm: string): BlockedCall[] {
    const term = searchTerm.toLowerCase();
    return calls.filter(call => 
      (call.phoneNumber && call.phoneNumber.toLowerCase().includes(term)) || 
      (call.sourceIP && call.sourceIP.toLowerCase().includes(term))
    );
  }
}

/**
 * Gera estatísticas de chamadas de forma otimizada
 * Complexidade: O(n) - uma única passagem pelo array
 */
export function generateCallStats(calls: BlockedCall[]) {
  if (!calls.length) return { totalBlocked: 0, todayBlocked: 0, byType: { anonymous: 0, unknown_server: 0, no_valid_number: 0, suspicious_ip: 0, user_blocked: 0 } };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  
  // Usar um único loop para calcular todas as estatísticas
  const stats = calls.reduce((acc, call) => {
    // Incrementar contagem por tipo
    acc.byType[call.callType]++;
    
    // Verificar se é de hoje
    if (call.timestamp >= todayTimestamp) {
      acc.todayBlocked++;
    }
    
    return acc;
  }, {
    totalBlocked: calls.length,
    todayBlocked: 0,
    byType: {
      anonymous: 0,
      unknown_server: 0,
      no_valid_number: 0,
      suspicious_ip: 0,
      user_blocked: 0
    }
  });
  
  return stats;
}