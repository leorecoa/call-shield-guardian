import { BlockedCall, DetailedStats, TimeSeriesData } from '@/types';

/**
 * Classe para análise detalhada de estatísticas de chamadas bloqueadas
 */
export class StatsAnalyzer {
  /**
   * Gera estatísticas detalhadas a partir de chamadas bloqueadas
   */
  static generateDetailedStats(calls: BlockedCall[]): DetailedStats {
    if (!calls.length) {
      return this.getEmptyDetailedStats();
    }
    
    // Calcular estatísticas básicas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    // Estatísticas por tipo
    const byType = {
      anonymous: 0,
      unknown_server: 0,
      no_valid_number: 0,
      suspicious_ip: 0,
      user_blocked: 0
    };
    
    // Contadores para estatísticas avançadas
    let todayBlocked = 0;
    const hourCounts = new Array(24).fill(0);
    const dayOfWeekCounts = new Array(7).fill(0);
    const callerCounts = new Map<string, number>();
    const callerTypes = new Map<string, 'phone' | 'ip'>();
    
    // Dados para séries temporais
    const dailyData = new Map<number, number>();
    const weeklyData = new Map<number, number>();
    const monthlyData = new Map<number, number>();
    
    // Processar cada chamada
    calls.forEach(call => {
      // Incrementar contagem por tipo
      byType[call.callType]++;
      
      // Verificar se é de hoje
      if (call.timestamp >= todayTimestamp) {
        todayBlocked++;
      }
      
      // Estatísticas por hora do dia
      const callDate = new Date(call.timestamp);
      const hour = callDate.getHours();
      hourCounts[hour]++;
      
      // Estatísticas por dia da semana
      const dayOfWeek = callDate.getDay();
      dayOfWeekCounts[dayOfWeek]++;
      
      // Contagem de chamadores
      if (call.phoneNumber) {
        const count = callerCounts.get(call.phoneNumber) || 0;
        callerCounts.set(call.phoneNumber, count + 1);
        callerTypes.set(call.phoneNumber, 'phone');
      } else if (call.sourceIP) {
        const count = callerCounts.get(call.sourceIP) || 0;
        callerCounts.set(call.sourceIP, count + 1);
        callerTypes.set(call.sourceIP, 'ip');
      }
      
      // Dados diários
      const dayKey = this.getDayKey(callDate);
      dailyData.set(dayKey, (dailyData.get(dayKey) || 0) + 1);
      
      // Dados semanais
      const weekKey = this.getWeekKey(callDate);
      weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + 1);
      
      // Dados mensais
      const monthKey = this.getMonthKey(callDate);
      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + 1);
    });
    
    // Converter mapas para arrays ordenados
    const topCallers = Array.from(callerCounts.entries())
      .map(([value, count]) => ({
        value,
        count,
        type: callerTypes.get(value) || 'phone'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const byHour = hourCounts.map((count, hour) => ({ hour, count }));
    
    const byDayOfWeek = dayOfWeekCounts.map((count, day) => ({ day, count }));
    
    // Converter dados de séries temporais
    const daily = Array.from(dailyData.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date - b.date);
    
    const weekly = Array.from(weeklyData.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date - b.date);
    
    const monthly = Array.from(monthlyData.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date - b.date);
    
    // Calcular duração da proteção
    const protectionDuration = this.calculateProtectionDuration(calls);
    
    // Calcular eficiência do bloqueio
    const blockEfficiency = this.calculateBlockEfficiency(calls);
    
    return {
      totalBlocked: calls.length,
      todayBlocked,
      byType,
      byPeriod: {
        daily,
        weekly,
        monthly
      },
      byHour,
      byDayOfWeek,
      topCallers,
      protectionDuration,
      blockEfficiency
    };
  }
  
  /**
   * Calcula a duração da proteção com base nas chamadas bloqueadas
   */
  private static calculateProtectionDuration(calls: BlockedCall[]): { days: number; hours: number; minutes: number } {
    if (!calls.length) {
      return { days: 0, hours: 0, minutes: 0 };
    }
    
    // Encontrar a primeira chamada (mais antiga)
    const firstCall = calls.reduce((oldest, call) => 
      call.timestamp < oldest.timestamp ? call : oldest, calls[0]);
    
    // Calcular a diferença de tempo até agora
    const now = Date.now();
    const diffMs = now - firstCall.timestamp;
    
    // Converter para dias, horas e minutos
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  }
  
  /**
   * Calcula a eficiência do bloqueio com base nas chamadas bloqueadas
   */
  private static calculateBlockEfficiency(calls: BlockedCall[]): { percentage: number; potentialThreats: number } {
    if (!calls.length) {
      return { percentage: 0, potentialThreats: 0 };
    }
    
    // Calcular ameaças potenciais (estimativa baseada em padrões de chamadas)
    // Aqui estamos usando uma heurística simples: chamadas repetidas do mesmo número
    // são consideradas parte de uma única ameaça potencial
    const uniqueCallers = new Set<string>();
    
    calls.forEach(call => {
      const identifier = call.phoneNumber || call.sourceIP || 'unknown';
      uniqueCallers.add(identifier);
    });
    
    const potentialThreats = uniqueCallers.size;
    
    // Calcular porcentagem de eficiência (baseado na proporção de chamadas bloqueadas vs. ameaças)
    const percentage = Math.min(100, Math.round((calls.length / potentialThreats) * 100));
    
    return { percentage, potentialThreats };
  }
  
  /**
   * Obtém a chave para agrupar por dia
   */
  private static getDayKey(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  
  /**
   * Obtém a chave para agrupar por semana
   */
  private static getWeekKey(date: Date): number {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para semana começando na segunda-feira
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  
  /**
   * Obtém a chave para agrupar por mês
   */
  private static getMonthKey(date: Date): number {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  
  /**
   * Retorna estatísticas detalhadas vazias
   */
  private static getEmptyDetailedStats(): DetailedStats {
    return {
      totalBlocked: 0,
      todayBlocked: 0,
      byType: {
        anonymous: 0,
        unknown_server: 0,
        no_valid_number: 0,
        suspicious_ip: 0,
        user_blocked: 0
      },
      byPeriod: {
        daily: [],
        weekly: [],
        monthly: []
      },
      byHour: Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 })),
      byDayOfWeek: Array.from({ length: 7 }, (_, day) => ({ day, count: 0 })),
      topCallers: [],
      protectionDuration: { days: 0, hours: 0, minutes: 0 },
      blockEfficiency: { percentage: 0, potentialThreats: 0 }
    };
  }
}