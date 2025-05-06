
import { useState, useEffect } from 'react';
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
  const [blockedCalls, setBlockedCalls] = useState<BlockedCall[]>([]);
  const [settings, setSettings] = useState<BlockSettings>(DEFAULT_SETTINGS);
  const [customList, setCustomList] = useState<CustomListEntry[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  
  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    try {
      const savedCalls = localStorage.getItem('blockedCalls');
      if (savedCalls) {
        setBlockedCalls(JSON.parse(savedCalls));
      }
      
      const savedSettings = localStorage.getItem('blockSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      const savedCustomList = localStorage.getItem('customList');
      if (savedCustomList) {
        setCustomList(JSON.parse(savedCustomList));
      }
      
      const savedIsActive = localStorage.getItem('isActive');
      if (savedIsActive !== null) {
        setIsActive(JSON.parse(savedIsActive));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
  }, []);
  
  // Salvar dados no localStorage quando atualizados
  useEffect(() => {
    try {
      localStorage.setItem('blockedCalls', JSON.stringify(blockedCalls));
      localStorage.setItem('blockSettings', JSON.stringify(settings));
      localStorage.setItem('customList', JSON.stringify(customList));
      localStorage.setItem('isActive', JSON.stringify(isActive));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  }, [blockedCalls, settings, customList, isActive]);
  
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
