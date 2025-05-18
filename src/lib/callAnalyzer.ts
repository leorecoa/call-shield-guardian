import { BlockedCall } from "@/types";

/**
 * Analisador de chamadas - fornece insights sobre padrões de chamadas bloqueadas
 */
export class CallAnalyzer {
  /**
   * Identifica padrões de chamadas repetidas do mesmo número ou IP
   */
  static identifyRepeatCallers(calls: BlockedCall[], threshold: number = 3): { 
    phoneNumbers: Array<{ value: string; count: number }>;
    ips: Array<{ value: string; count: number }>;
  } {
    const phoneCount: Record<string, number> = {};
    const ipCount: Record<string, number> = {};
    
    // Contar ocorrências
    calls.forEach(call => {
      if (call.phoneNumber) {
        phoneCount[call.phoneNumber] = (phoneCount[call.phoneNumber] || 0) + 1;
      }
      
      if (call.sourceIP) {
        ipCount[call.sourceIP] = (ipCount[call.sourceIP] || 0) + 1;
      }
    });
    
    // Filtrar por threshold e ordenar por contagem
    const phoneNumbers = Object.entries(phoneCount)
      .filter(([_, count]) => count >= threshold)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
    
    const ips = Object.entries(ipCount)
      .filter(([_, count]) => count >= threshold)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
    
    return { phoneNumbers, ips };
  }
  
  /**
   * Analisa padrões de tempo para identificar horários com mais chamadas bloqueadas
   */
  static analyzeTimePatterns(calls: BlockedCall[]): Array<{ hour: number; count: number }> {
    const hourCount: Record<number, number> = {};
    
    // Contar chamadas por hora do dia
    calls.forEach(call => {
      const hour = new Date(call.timestamp).getHours();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });
    
    // Converter para array e ordenar por hora
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hourCount[hour] || 0
    }));
  }
  
  /**
   * Analisa a distribuição de tipos de chamadas bloqueadas
   */
  static analyzeCallTypes(calls: BlockedCall[]): Record<BlockedCall["callType"], number> {
    return calls.reduce((acc, call) => {
      acc[call.callType] = (acc[call.callType] || 0) + 1;
      return acc;
    }, {} as Record<BlockedCall["callType"], number>);
  }
  
  /**
   * Identifica possíveis ataques baseados em padrões de chamadas
   */
  static identifyPotentialAttacks(calls: BlockedCall[]): Array<{
    type: "spam" | "robocall" | "targeted";
    evidence: string;
    callIds: string[];
  }> {
    const attacks = [];
    const recentCalls = calls.filter(call => 
      call.timestamp > Date.now() - 24 * 60 * 60 * 1000
    );
    
    // Detectar spam (muitas chamadas em curto período)
    if (recentCalls.length >= 10) {
      const callIds = recentCalls.slice(0, 10).map(call => call.id);
      attacks.push({
        type: "spam",
        evidence: `${recentCalls.length} chamadas nas últimas 24 horas`,
        callIds
      });
    }
    
    // Detectar robocalls (chamadas em intervalos regulares)
    const intervals: number[] = [];
    for (let i = 1; i < recentCalls.length; i++) {
      intervals.push(recentCalls[i-1].timestamp - recentCalls[i].timestamp);
    }
    
    const isRegular = this.hasRegularPattern(intervals, 60000); // 1 minuto de tolerância
    if (isRegular && intervals.length >= 3) {
      attacks.push({
        type: "robocall",
        evidence: "Chamadas em intervalos regulares detectadas",
        callIds: recentCalls.slice(0, 4).map(call => call.id)
      });
    }
    
    // Detectar ataques direcionados (mesmo número/IP repetidamente)
    const { phoneNumbers, ips } = this.identifyRepeatCallers(recentCalls, 5);
    
    if (phoneNumbers.length > 0) {
      const targetCalls = recentCalls.filter(call => 
        call.phoneNumber === phoneNumbers[0].value
      );
      
      attacks.push({
        type: "targeted",
        evidence: `${phoneNumbers[0].count} chamadas do número ${phoneNumbers[0].value}`,
        callIds: targetCalls.slice(0, 5).map(call => call.id)
      });
    }
    
    if (ips.length > 0) {
      const targetCalls = recentCalls.filter(call => 
        call.sourceIP === ips[0].value
      );
      
      attacks.push({
        type: "targeted",
        evidence: `${ips[0].count} chamadas do IP ${ips[0].value}`,
        callIds: targetCalls.slice(0, 5).map(call => call.id)
      });
    }
    
    return attacks;
  }
  
  /**
   * Verifica se um array de intervalos tem um padrão regular
   */
  private static hasRegularPattern(intervals: number[], tolerance: number): boolean {
    if (intervals.length < 3) return false;
    
    const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
    
    // Verificar se os intervalos estão dentro da tolerância
    return intervals.every(interval => 
      Math.abs(interval - avgInterval) <= tolerance
    );
  }
}