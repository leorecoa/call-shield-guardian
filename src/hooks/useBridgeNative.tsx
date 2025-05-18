import { useCallback, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@/lib/utils';

export function useBridgeNative() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [batteryOptimizationStatus, setBatteryOptimizationStatus] = useState({
    isExempt: false,
    hasRequested: false
  });

  // Objeto que representa a ponte nativa
  const nativeBridge = {
    // Ativa/desativa o serviço de bloqueio de chamadas
    enableCallBlocking: async (enable: boolean) => {
      if (Capacitor.isNativePlatform()) {
        return Capacitor.Plugins.CallSettingsPlugin.enableCallBlocking({ enable });
      }
      return Promise.resolve();
    },

    // Atualiza as configurações de bloqueio
    updateBlockSettings: async (settings: any) => {
      if (Capacitor.isNativePlatform()) {
        return Capacitor.Plugins.CallSettingsPlugin.updateBlockSettings({ settings });
      }
      return Promise.resolve();
    },

    // Atualiza a lista personalizada
    updateCustomList: async (list: any[]) => {
      if (Capacitor.isNativePlatform()) {
        return Capacitor.Plugins.CallSettingsPlugin.updateCustomList({ list });
      }
      return Promise.resolve();
    },

    // Verifica se tem permissões necessárias
    checkPermissions: async () => {
      if (Capacitor.isNativePlatform()) {
        return Capacitor.Plugins.CallSettingsPlugin.checkPermissions();
      }
      return Promise.resolve({ granted: false });
    },

    // Solicita permissões necessárias
    requestPermissions: async () => {
      if (Capacitor.isNativePlatform()) {
        return Capacitor.Plugins.CallSettingsPlugin.requestPermissions();
      }
      return Promise.resolve({ granted: false });
    },

    // Solicita permissão de notificação
    requestNotificationPermission: async () => {
      if (Capacitor.isNativePlatform()) {
        return Capacitor.Plugins.CallSettingsPlugin.requestNotificationPermission();
      }
      return Promise.resolve({ granted: false });
    },

    // Verifica permissão de notificação
    checkNotificationPermission: async () => {
      if (Capacitor.isNativePlatform()) {
        return Capacitor.Plugins.CallSettingsPlugin.checkNotificationPermission();
      }
      return Promise.resolve({ granted: false });
    },
    
    // Verifica status de otimização de bateria
    checkBatteryOptimization: async () => {
      if (Capacitor.isNativePlatform()) {
        return Capacitor.Plugins.CallSettingsPlugin.checkBatteryOptimization();
      }
      return Promise.resolve({ isExempt: false, hasRequested: false });
    },
    
    // Solicita isenção de otimização de bateria
    requestBatteryOptimizationExemption: async () => {
      if (Capacitor.isNativePlatform()) {
        return Capacitor.Plugins.CallSettingsPlugin.requestBatteryOptimizationExemption();
      }
      return Promise.resolve({ success: false });
    }
  };

  // Verifica permissões ao iniciar
  useEffect(() => {
    if (Platform.isNative) {
      nativeBridge.checkPermissions()
        .then(result => setHasPermissions(result.granted))
        .catch(err => console.error('Erro ao verificar permissões:', err));
      
      nativeBridge.checkNotificationPermission()
        .then(result => setHasNotificationPermission(result.granted))
        .catch(err => console.error('Erro ao verificar permissão de notificação:', err));
      
      nativeBridge.checkBatteryOptimization()
        .then(result => setBatteryOptimizationStatus(result))
        .catch(err => console.error('Erro ao verificar otimização de bateria:', err));
    }
  }, []);

  // Função para solicitar permissões
  const requestPermissions = useCallback(async () => {
    if (Platform.isNative) {
      try {
        const result = await nativeBridge.requestPermissions();
        setHasPermissions(result.granted);
        return result;
      } catch (error) {
        console.error('Erro ao solicitar permissões:', error);
        return { granted: false };
      }
    }
    return { granted: false };
  }, []);

  // Função para solicitar permissão de notificação
  const requestNotificationPermission = useCallback(async () => {
    if (Platform.isNative) {
      try {
        const result = await nativeBridge.requestNotificationPermission();
        setHasNotificationPermission(result.granted);
        return result;
      } catch (error) {
        console.error('Erro ao solicitar permissão de notificação:', error);
        return { granted: false };
      }
    }
    return { granted: false };
  }, []);
  
  // Função para solicitar isenção de otimização de bateria
  const requestBatteryOptimizationExemption = useCallback(async () => {
    if (Platform.isNative) {
      try {
        const result = await nativeBridge.requestBatteryOptimizationExemption();
        
        // Atualizar status após a solicitação
        const newStatus = await nativeBridge.checkBatteryOptimization();
        setBatteryOptimizationStatus(newStatus);
        
        return result;
      } catch (error) {
        console.error('Erro ao solicitar isenção de otimização de bateria:', error);
        return { success: false };
      }
    }
    return { success: false };
  }, []);

  return {
    nativeBridge,
    hasPermissions,
    hasNotificationPermission,
    batteryOptimizationStatus,
    requestPermissions,
    requestNotificationPermission,
    requestBatteryOptimizationExemption
  };
}