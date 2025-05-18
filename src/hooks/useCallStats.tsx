import { useMemo } from 'react';
import { BlockedCall, StatsSummary } from '@/types';
import { INITIAL_STATS } from './useLocalStorage';
import { generateCallStats } from '@/lib/callUtils';

export function useCallStats(blockedCalls: BlockedCall[]) {
  return useMemo(() => {
    if (!blockedCalls.length) return INITIAL_STATS;
    return generateCallStats(blockedCalls);
  }, [blockedCalls]);
}