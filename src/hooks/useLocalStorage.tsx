import { useState, useEffect, useCallback } from 'react';
import { BlockedCall, StatsSummary, BlockSettings, CustomListEntry } from '@/types';

export const INITIAL_STATS: StatsSummary = {
  totalBlocked: 0,
  todayBlocked: 0,
  byType: {
    anonymous: 0,
    unknown_server: 0,
    no_valid_number: 0,
    suspicious_ip: 0,
    user_blocked: 0
  }
};

export const DEFAULT_SETTINGS: BlockSettings = {
  blockAll: false,
  blockAnonymous: true,
  blockUnknownServers: true,
  blockNoValidNumber: true,
  blockSuspiciousIP: true
};

export function useLocalStorage() {
  const [blockedCalls, setBlockedCallsState] = useState<BlockedCall[]>([]);
  const [settings, setSettingsState] = useState<BlockSettings>(DEFAULT_SETTINGS);
  const [customList, setCustomListState] = useState<CustomListEntry[]>([]);
  const [isActive, setIsActiveState] = useState<boolean>(true);
  
  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    try {
      const savedCalls = localStorage.getItem('blockedCalls');
      if (savedCalls) {
        setBlockedCallsState(JSON.parse(savedCalls));
      }
      
      const savedSettings = localStorage.getItem('blockSettings');
      if (savedSettings) {
        setSettingsState(JSON.parse(savedSettings));
      }
      
      const savedCustomList = localStorage.getItem('customList');
      if (savedCustomList) {
        setCustomListState(JSON.parse(savedCustomList));
      }
      
      const savedIsActive = localStorage.getItem('isActive');
      if (savedIsActive !== null) {
        setIsActiveState(JSON.parse(savedIsActive));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
  }, []);
  
  // Memoize setters para evitar recriações desnecessárias
  const setBlockedCalls = useCallback((value: BlockedCall[] | ((prev: BlockedCall[]) => BlockedCall[])) => {
    setBlockedCallsState(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem('blockedCalls', JSON.stringify(newValue));
      } catch (error) {
        console.error('Erro ao salvar chamadas bloqueadas:', error);
      }
      return newValue;
    });
  }, []);
  
  const setSettings = useCallback((value: BlockSettings | ((prev: BlockSettings) => BlockSettings)) => {
    setSettingsState(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem('blockSettings', JSON.stringify(newValue));
      } catch (error) {
        console.error('Erro ao salvar configurações:', error);
      }
      return newValue;
    });
  }, []);
  
  const setCustomList = useCallback((value: CustomListEntry[] | ((prev: CustomListEntry[]) => CustomListEntry[])) => {
    setCustomListState(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem('customList', JSON.stringify(newValue));
      } catch (error) {
        console.error('Erro ao salvar lista personalizada:', error);
      }
      return newValue;
    });
  }, []);
  
  const setIsActive = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setIsActiveState(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem('isActive', JSON.stringify(newValue));
      } catch (error) {
        console.error('Erro ao salvar estado ativo:', error);
      }
      return newValue;
    });
  }, []);
  
  return {
    blockedCalls,
    setBlockedCalls,
    settings,
    setSettings,
    customList,
    setCustomList,
    isActive,
    setIsActive
  };
}