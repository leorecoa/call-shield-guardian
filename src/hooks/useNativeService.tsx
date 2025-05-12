
import { useEffect } from 'react';
import { BlockSettings, CustomListEntry } from '@/types';
import { NativeBridge, isAndroid } from './useBridgeNative';

export function useNativeService(
  isActive: boolean,
  settings: BlockSettings,
  customList: CustomListEntry[],
  hasPermissions: boolean,
  nativeBridge: NativeBridge
) {
  // Atualizar o serviço nativo quando as configurações mudarem
  useEffect(() => {
    if (!isAndroid() || !nativeBridge) return;
    
    const updateNativeService = async () => {
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
    };
    
    updateNativeService();
  }, [isActive, settings, customList, hasPermissions, nativeBridge]);

  return null;
}
