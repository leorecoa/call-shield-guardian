import { useMemo } from 'react';
import { BlockedCall, DetailedStats } from '@/types';
import { StatsAnalyzer } from '@/lib/statsAnalyzer';

/**
 * Hook para gerar estatísticas detalhadas de chamadas bloqueadas
 */
export function useDetailedStats(blockedCalls: BlockedCall[]): DetailedStats {
  return useMemo(() => {
    return StatsAnalyzer.generateDetailedStats(blockedCalls);
  }, [blockedCalls]);
}