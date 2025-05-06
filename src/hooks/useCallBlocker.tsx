
import { BlockedCall, BlockSettings, CustomListEntry } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from './useLocalStorage';
import { useCallStats } from './useCallStats';
import { useBridgeNative } from './useBridgeNative';
import { useNativeService } from './useNativeService';

export function useCallBlocker() {
  const {
    blockedCalls,
    setBlockedCalls,
    settings, 
    setSettings,
    customList,
    setCustomList,
    isActive,
    setIsActive
  } = useLocalStorage();
  
  const { 
    nativeBridge,
    hasPermissions,
    requestPermissions
  } = useBridgeNative();
  
  const stats = useCallStats(blockedCalls);
  
  // Integra o hook do serviço nativo
  useNativeService(isActive, settings, customList, hasPermissions, nativeBridge);
  
  const { toast } = useToast();
  
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
    if (!isActive && !hasPermissions) {
      try {
        const { granted } = await requestPermissions();
        
        if (!granted) {
          toast({
            title: "Permissões Necessárias",
            description: "O bloqueio de chamadas requer permissões de telefone.",
            variant: "destructive"
          });
          return;
        }
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
