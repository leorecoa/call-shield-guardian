
import { useState, useEffect } from 'react';
import { BlockedCall, StatsSummary } from '@/types';
import { INITIAL_STATS } from './useLocalStorage';

export function useCallStats(blockedCalls: BlockedCall[]) {
  const [stats, setStats] = useState<StatsSummary>(INITIAL_STATS);
  
  // Calcular estatísticas a partir das chamadas bloqueadas
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    const todayBlocked = blockedCalls.filter(call => call.timestamp >= todayTimestamp).length;
    
    // Agrupar por tipo
    const byType = blockedCalls.reduce((acc, call) => {
      acc[call.callType as keyof typeof acc]++;
      return acc;
    }, {
      anonymous: 0,
      unknown_server: 0,
      no_valid_number: 0,
      suspicious_ip: 0,
      user_blocked: 0
    });
    
    setStats({
      totalBlocked: blockedCalls.length,
      todayBlocked,
      byType
    });
  }, [blockedCalls]);
  
  return stats;
}
