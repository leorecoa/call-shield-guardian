import { BlockedCall, BlockSettings, CustomListEntry } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from './useLocalStorage';
import { useCallStats } from './useCallStats';
import { useBridgeNative } from './useBridgeNative';
import { useNativeService } from './useNativeService';
import { useCallback, useMemo, useState } from 'react';
import { CallManager } from '@/lib/callUtils';
import { CallBlockingEngine } from '@/lib/callBlockingEngine';
import { CallAnalyzer } from '@/lib/callAnalyzer';
import { SecurityRules } from '@/lib/securityRules';

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
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Integra o hook do serviço nativo
  useNativeService(isActive, settings, customList, hasPermissions, nativeBridge);
  
  const { toast } = useToast();
  
  // Adicionar uma nova chamada bloqueada
  const addBlockedCall = useCallback((call: Omit<BlockedCall, 'id'>) => {
    const newCall = {
      ...call,
      id: crypto.randomUUID()
    };
    
    // Usar CallManager para adicionar chamada de forma otimizada
    setBlockedCalls(prev => CallManager.addCall(prev, newCall));
    
    toast({
      title: "Chamada Bloqueada",
      description: `Uma chamada ${call.callType.replace('_', ' ')} foi bloqueada`,
      variant: "default"
    });
    
    // Analisar padrões após adicionar nova chamada
    analyzeCallPatterns([newCall, ...blockedCalls]);
  }, [blockedCalls, setBlockedCalls, toast]);
  
  // Analisar padrões de chamadas para detectar possíveis ataques
  const analyzeCallPatterns = useCallback((calls: BlockedCall[]) => {
    if (calls.length < 5) return; // Precisa de dados suficientes
    
    const attacks = CallAnalyzer.identifyPotentialAttacks(calls);
    
    // Notificar sobre possíveis ataques
    attacks.forEach(attack => {
      if (attack.type === "spam") {
        toast({
          title: "Possível Ataque de Spam Detectado",
          description: attack.evidence,
          variant: "destructive"
        });
      } else if (attack.type === "robocall") {
        toast({
          title: "Possível Robocall Detectado",
          description: attack.evidence,
          variant: "destructive"
        });
      } else if (attack.type === "targeted") {
        toast({
          title: "Possível Ataque Direcionado",
          description: attack.evidence,
          variant: "destructive"
        });
      }
    });
    
    // Identificar chamadores repetidos
    const { phoneNumbers, ips } = CallAnalyzer.identifyRepeatCallers(calls);
    
    // Sugerir bloqueio para chamadores frequentes
    if (phoneNumbers.length > 0 && phoneNumbers[0].count >= 5) {
      const number = phoneNumbers[0].value;
      toast({
        title: "Chamador Frequente Detectado",
        description: `O número ${number} ligou ${phoneNumbers[0].count} vezes. Deseja bloquear?`,
        action: (
          <button 
            onClick={() => addCustomEntry({ value: number, type: 'phone', isBlocked: true, notes: 'Bloqueado automaticamente' })}
            className="bg-neonPink text-white px-3 py-1 rounded-md text-xs"
          >
            Bloquear
          </button>
        ),
        variant: "default"
      });
    }
  }, [toast, addCustomEntry]);
  
  // Alternar o estado ativo do bloqueador de chamadas
  const toggleActive = useCallback(async () => {
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
  }, [isActive, hasPermissions, requestPermissions, setIsActive, toast]);
  
  // Atualizar configurações
  const updateSettings = useCallback((newSettings: Partial<BlockSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, [setSettings]);
  
  // Adicionar entrada personalizada à lista de bloqueio ou permissão
  const addCustomEntry = useCallback((entry: Omit<CustomListEntry, 'id' | 'addedAt'>) => {
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
  }, [setCustomList, toast]);
  
  // Remover entrada personalizada da lista
  const removeCustomEntry = useCallback((id: string) => {
    setCustomList(prev => prev.filter(entry => entry.id !== id));
  }, [setCustomList]);
  
  // Limpar todo o histórico de chamadas bloqueadas
  const clearBlockedCalls = useCallback(() => {
    setBlockedCalls([]);
    toast({
      title: "Histórico Limpo",
      description: "Todos os registros de chamadas bloqueadas foram excluídos",
      variant: "default"
    });
  }, [setBlockedCalls, toast]);
  
  // Simular uma chamada recebida
  const simulateIncomingCall = useCallback((type: BlockedCall['callType']) => {
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
  }, [isActive, addBlockedCall, toast]);

  // Verificar se uma chamada deve ser bloqueada
  const shouldBlockCall = useCallback((phoneNumber?: string, sourceIP?: string, isVoIP: boolean = false): { blocked: boolean; reason: BlockedCall["callType"] | null } => {
    // Se o bloqueio não está ativo, não bloquear
    if (!isActive) return { blocked: false, reason: null };
    
    return CallBlockingEngine.shouldBlockCall(phoneNumber, sourceIP, isVoIP, settings, customList);
  }, [isActive, settings, customList]);
  
  // Aplicar regras de segurança predefinidas
  const applySecurityRules = useCallback((level: 'low' | 'medium' | 'high') => {
    setSecurityLevel(level);
    
    let rulesToApply: CustomListEntry[] = [];
    
    // Aplicar regras com base no nível de segurança
    switch (level) {
      case 'low':
        // Apenas regras de emergência e fraudes óbvias
        rulesToApply = [
          ...SecurityRules.getEmergencyAllowRules(),
          ...SecurityRules.getFraudPatternRules()
        ];
        break;
        
      case 'medium':
        // Regras de nível baixo + telemarketing
        rulesToApply = [
          ...SecurityRules.getEmergencyAllowRules(),
          ...SecurityRules.getFraudPatternRules(),
          ...SecurityRules.getTelemarketingRules()
        ];
        break;
        
      case 'high':
        // Todas as regras
        rulesToApply = SecurityRules.getAllSecurityRules();
        break;
    }
    
    // Mesclar com regras existentes, mantendo as personalizadas
    const existingCustomRules = customList.filter(entry => 
      !entry.id.startsWith('tm-') && 
      !entry.id.startsWith('ip-') && 
      !entry.id.startsWith('fraud-') && 
      !entry.id.startsWith('emerg-')
    );
    
    setCustomList([...existingCustomRules, ...rulesToApply]);
    
    // Ajustar configurações com base no nível
    const newSettings: BlockSettings = {
      ...settings,
      blockAnonymous: level !== 'low',
      blockNoValidNumber: true,
      blockSuspiciousIP: level !== 'low',
      blockUnknownServers: level === 'high',
      blockAll: false
    };
    
    setSettings(newSettings);
    
    toast({
      title: "Nível de Segurança Atualizado",
      description: `Nível de segurança definido como ${
        level === 'low' ? 'Baixo' : level === 'medium' ? 'Médio' : 'Alto'
      }`,
      variant: "default"
    });
  }, [customList, settings, setCustomList, setSettings, toast]);

  // Memoize o objeto de retorno para evitar recriações desnecessárias
  return useMemo(() => ({
    blockedCalls,
    stats,
    settings,
    customList,
    isActive,
    hasPermissions,
    securityLevel,
    addBlockedCall,
    toggleActive,
    updateSettings,
    addCustomEntry,
    removeCustomEntry,
    clearBlockedCalls,
    simulateIncomingCall,
    shouldBlockCall,
    applySecurityRules,
    analyzeCallPatterns
  }), [
    blockedCalls,
    stats,
    settings,
    customList,
    isActive,
    hasPermissions,
    securityLevel,
    addBlockedCall,
    toggleActive,
    updateSettings,
    addCustomEntry,
    removeCustomEntry,
    clearBlockedCalls,
    simulateIncomingCall,
    shouldBlockCall,
    applySecurityRules,
    analyzeCallPatterns
  ]);
}