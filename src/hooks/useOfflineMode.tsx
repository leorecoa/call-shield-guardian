import { useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from '@/lib/networkManager';
import { OfflineStorage } from '@/lib/offlineStorage';
import { BlockedCall, BlockSettings, CustomListEntry } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export function useOfflineMode() {
  const { isOnline, connectionType } = useNetworkStatus();
  const [isOfflineMode, setIsOfflineMode] = useState(!isOnline);
  const [syncPending, setSyncPending] = useState(false);
  const { toast } = useToast();
  
  // Inicializar o armazenamento offline
  const offlineStorage = OfflineStorage.getInstance();
  
  // Atualizar o modo offline com base no estado da rede
  useEffect(() => {
    setIsOfflineMode(!isOnline);
    
    // Notificar o usuário sobre mudanças no estado da conexão
    if (!isOnline) {
      toast({
        title: "Modo offline ativado",
        description: "O aplicativo está funcionando sem conexão com a internet",
        variant: "default"
      });
    } else if (syncPending) {
      toast({
        title: "Conexão restaurada",
        description: "Sincronizando dados pendentes...",
        variant: "default"
      });
    }
  }, [isOnline, syncPending, toast]);
  
  // Verificar se há dados pendentes para sincronização
  useEffect(() => {
    const hasPending = offlineStorage.hasPendingSync();
    setSyncPending(hasPending);
  }, []);
  
  // Adicionar uma chamada bloqueada no armazenamento offline
  const addBlockedCallOffline = useCallback((call: BlockedCall) => {
    offlineStorage.addBlockedCall(call);
    setSyncPending(true);
  }, []);
  
  // Atualizar configurações no armazenamento offline
  const updateSettingsOffline = useCallback((settings: BlockSettings) => {
    offlineStorage.updateSettings(settings);
  }, []);
  
  // Atualizar lista personalizada no armazenamento offline
  const updateCustomListOffline = useCallback((customList: CustomListEntry[]) => {
    offlineStorage.updateCustomList(customList);
  }, []);
  
  // Obter dados do armazenamento offline
  const getOfflineData = useCallback(() => {
    return offlineStorage.getData();
  }, []);
  
  // Marcar dados como sincronizados
  const markSynced = useCallback(() => {
    offlineStorage.markSynced();
    setSyncPending(false);
  }, []);
  
  // Obter chamadas pendentes para sincronização
  const getPendingSyncCalls = useCallback(() => {
    return offlineStorage.getPendingSyncCalls();
  }, []);
  
  return {
    isOfflineMode,
    syncPending,
    connectionType,
    addBlockedCallOffline,
    updateSettingsOffline,
    updateCustomListOffline,
    getOfflineData,
    markSynced,
    getPendingSyncCalls
  };
}