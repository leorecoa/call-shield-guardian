
import { useState, useEffect } from 'react';
import { BlockedCall, StatsSummary, BlockSettings, CustomListEntry } from '@/types';
import { useToast } from "@/components/ui/use-toast";

const INITIAL_STATS: StatsSummary = {
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

const DEFAULT_SETTINGS: BlockSettings = {
  blockAll: false,
  blockAnonymous: true,
  blockUnknownServers: true,
  blockNoValidNumber: true,
  blockSuspiciousIP: true
};

// Dados fictícios para demonstração 
const MOCK_BLOCKED_CALLS: BlockedCall[] = [
  {
    id: '1',
    sourceIP: '203.0.113.1',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutos atrás
    callType: 'suspicious_ip',
    isVoIP: true
  },
  {
    id: '2',
    phoneNumber: 'Anônimo',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 horas atrás
    callType: 'anonymous',
    isVoIP: true
  },
  {
    id: '3',
    phoneNumber: '+1234567890',
    sourceIP: '198.51.100.1',
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 horas atrás
    callType: 'user_blocked',
    isVoIP: true
  },
  {
    id: '4',
    sourceIP: '192.0.2.123',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 dia atrás
    callType: 'unknown_server',
    isVoIP: true
  },
  {
    id: '5',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 dias atrás
    callType: 'no_valid_number',
    isVoIP: true
  }
];

// Em uma implementação real, isso se conectaria ao código nativo do Android
export function useCallBlocker() {
  const [blockedCalls, setBlockedCalls] = useState<BlockedCall[]>(MOCK_BLOCKED_CALLS);
  const [stats, setStats] = useState<StatsSummary>(INITIAL_STATS);
  const [settings, setSettings] = useState<BlockSettings>(DEFAULT_SETTINGS);
  const [customList, setCustomList] = useState<CustomListEntry[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const { toast } = useToast();
  
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
  
  // Adicionar uma nova chamada bloqueada
  const addBlockedCall = (call: Omit<BlockedCall, 'id'>) => {
    const newCall = {
      ...call,
      id: crypto.randomUUID()
    };
    
    setBlockedCalls(prev => [newCall, ...prev]);
    
    // Mostrar notificação quando uma chamada é bloqueada
    toast({
      title: "Chamada Bloqueada",
      description: `Uma chamada ${call.callType.replace('_', ' ')} foi bloqueada`,
      variant: "default"
    });
  };
  
  // Alternar o estado ativo do bloqueador de chamadas
  const toggleActive = () => {
    setIsActive(prev => !prev);
  };
  
  // Atualizar configurações
  const updateSettings = (newSettings: Partial<BlockSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Adicionar entrada personalizada à lista de bloqueio ou permissão
  const addCustomEntry = (entry: Omit<CustomListEntry, 'id' | 'addedAt'>) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
      addedAt: Date.now()
    };
    
    setCustomList(prev => [newEntry, ...prev]);
  };
  
  // Remover entrada personalizada da lista
  const removeCustomEntry = (id: string) => {
    setCustomList(prev => prev.filter(entry => entry.id !== id));
  };
  
  // Limpar todo o histórico de chamadas bloqueadas
  const clearBlockedCalls = () => {
    setBlockedCalls([]);
    toast({
      title: "Histórico Limpo",
      description: "Todos os registros de chamadas bloqueadas foram excluídos",
      variant: "default"
    });
  };
  
  // Simular uma chamada recebida
  const simulateIncomingCall = (type: BlockedCall['callType']) => {
    // Criar uma nova chamada com base no tipo
    const newCall: Omit<BlockedCall, 'id'> = {
      timestamp: Date.now(),
      callType: type,
      isVoIP: true
    };
    
    // Adicionar propriedades específicas com base no tipo de chamada
    switch(type) {
      case 'anonymous':
        newCall.phoneNumber = 'Anônimo';
        break;
      case 'suspicious_ip':
        newCall.sourceIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        break;
      case 'no_valid_number':
        newCall.phoneNumber = `+${Math.floor(Math.random() * 10000000000)}`;
        break;
      case 'unknown_server':
        newCall.sourceIP = `203.0.113.${Math.floor(Math.random() * 255)}`;
        break;
      case 'user_blocked':
        newCall.phoneNumber = `+${Math.floor(Math.random() * 10000000000)}`;
        newCall.sourceIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        break;
    }
    
    addBlockedCall(newCall);
  };

  return {
    blockedCalls,
    stats,
    settings,
    customList,
    isActive,
    addBlockedCall,
    toggleActive,
    updateSettings,
    addCustomEntry,
    removeCustomEntry,
    clearBlockedCalls,
    simulateIncomingCall
  };
}
