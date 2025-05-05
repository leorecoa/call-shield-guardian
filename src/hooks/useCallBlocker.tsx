
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

// Interface para simular a ponte nativa
interface NativeBridge {
  startCallBlockingService?: () => Promise<{ success: boolean }>;
  stopCallBlockingService?: () => Promise<{ success: boolean }>;
  updateBlockingRules?: (rules: string) => Promise<{ success: boolean }>;
  requestCallPermissions?: () => Promise<{ granted: boolean }>;
}

// Checa se estamos em um ambiente capacitor/nativo
const isNativeApp = () => {
  return window.hasOwnProperty('Capacitor');
};

// Detecta se estamos no Android
const isAndroid = () => {
  return isNativeApp() && (window as any).Capacitor?.getPlatform() === 'android';
};

export function useCallBlocker() {
  const [blockedCalls, setBlockedCalls] = useState<BlockedCall[]>([]);
  const [stats, setStats] = useState<StatsSummary>(INITIAL_STATS);
  const [settings, setSettings] = useState<BlockSettings>(DEFAULT_SETTINGS);
  const [customList, setCustomList] = useState<CustomListEntry[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [nativeBridge, setNativeBridge] = useState<NativeBridge>({});
  const { toast } = useToast();
  
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

  // Inicializar a ponte nativa com o Android
  useEffect(() => {
    const initNativeBridge = async () => {
      if (isAndroid()) {
        try {
          // Simula a obtenção da ponte nativa
          console.log("Inicializando ponte com código nativo Android...");
          
          // Em um aplicativo real, você registraria os métodos nativos
          const bridge: NativeBridge = {
            startCallBlockingService: async () => {
              console.log("Serviço de bloqueio iniciado nativamente");
              return { success: true };
            },
            stopCallBlockingService: async () => {
              console.log("Serviço de bloqueio parado nativamente");
              return { success: true };
            },
            updateBlockingRules: async (rules: string) => {
              console.log("Regras de bloqueio atualizadas:", rules);
              return { success: true };
            },
            requestCallPermissions: async () => {
              console.log("Permissões de chamada solicitadas");
              // Em um aplicativo real, isto solicitaria permissões do Android
              setHasPermissions(true);
              return { granted: true };
            }
          };
          
          setNativeBridge(bridge);
          
          // Solicitar permissões ao iniciar
          if (bridge.requestCallPermissions) {
            const { granted } = await bridge.requestCallPermissions();
            setHasPermissions(granted);
          }
        } catch (error) {
          console.error("Erro ao inicializar ponte nativa:", error);
          toast({
            title: "Erro de Inicialização",
            description: "Não foi possível conectar ao sistema de bloqueio nativo.",
            variant: "destructive"
          });
        }
      }
    };
    
    initNativeBridge();
  }, [toast]);
  
  // Atualizar o serviço nativo quando as configurações mudarem
  useEffect(() => {
    const updateNativeService = async () => {
      if (isAndroid() && nativeBridge) {
        try {
          // Iniciar ou parar o serviço baseado no status de ativação
          if (isActive && hasPermissions) {
            if (nativeBridge.startCallBlockingService) {
              await nativeBridge.startCallBlockingService();
            }
            
            // Atualizar regras de bloqueio
            if (nativeBridge.updateBlockingRules) {
              const rules = JSON.stringify({
                settings,
                customList: customList.filter(entry => entry.isBlocked)
              });
              await nativeBridge.updateBlockingRules(rules);
            }
          } else if (!isActive && nativeBridge.stopCallBlockingService) {
            await nativeBridge.stopCallBlockingService();
          }
        } catch (error) {
          console.error("Erro ao atualizar serviço nativo:", error);
        }
      }
    };
    
    updateNativeService();
  }, [isActive, settings, customList, hasPermissions, nativeBridge]);
  
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
  const toggleActive = async () => {
    // Se estamos ativando e não temos permissões, solicitar primeiro
    if (!isActive && isAndroid() && !hasPermissions && nativeBridge.requestCallPermissions) {
      try {
        const { granted } = await nativeBridge.requestCallPermissions();
        
        if (!granted) {
          toast({
            title: "Permissões Necessárias",
            description: "O bloqueio de chamadas requer permissões de telefone.",
            variant: "destructive"
          });
          return;
        }
        
        setHasPermissions(granted);
      } catch (error) {
        console.error("Erro ao solicitar permissões:", error);
        return;
      }
    }
    
    setIsActive(prev => !prev);
    
    toast({
      title: isActive ? "Proteção Desativada" : "Proteção Ativada",
      description: isActive 
        ? "O serviço de bloqueio de chamadas foi desativado." 
        : "O serviço de bloqueio de chamadas está ativo e protegendo seu dispositivo.",
      variant: "default"
    });
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
    
    toast({
      title: entry.isBlocked ? "Número Bloqueado" : "Número Permitido",
      description: `${entry.value} foi adicionado à ${entry.isBlocked ? 'lista de bloqueio' : 'lista de permissão'}.`,
      variant: "default"
    });
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
    // Verificar se o bloqueio está ativo
    if (!isActive) {
      toast({
        title: "Bloqueio Inativo",
        description: "Ative o bloqueio de chamadas primeiro.",
        variant: "destructive"
      });
      return;
    }
    
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
    hasPermissions,
    addBlockedCall,
    toggleActive,
    updateSettings,
    addCustomEntry,
    removeCustomEntry,
    clearBlockedCalls,
    simulateIncomingCall
  };
}
