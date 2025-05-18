import { useEffect } from 'react';
import { BlockSettings, CustomListEntry } from '@/types';
import { Platform } from '@/lib/utils';

interface NativeBridge {
  enableCallBlocking?: (enable: boolean) => Promise<void>;
  updateBlockSettings?: (settings: BlockSettings) => Promise<void>;
  updateCustomList?: (list: CustomListEntry[]) => Promise<void>;
  requestNotificationPermission?: () => Promise<{ granted: boolean }>;
}

export function useNativeService(
  isActive: boolean,
  settings: BlockSettings,
  customList: CustomListEntry[],
  hasPermissions: boolean,
  nativeBridge: NativeBridge
) {
  // Efeito para ativar/desativar o serviço de bloqueio de chamadas
  useEffect(() => {
    if (Platform.isNative && nativeBridge.enableCallBlocking && hasPermissions) {
      nativeBridge.enableCallBlocking(isActive)
        .catch(err => console.error('Erro ao ativar/desativar bloqueio:', err));
    }
  }, [isActive, hasPermissions, nativeBridge]);

  // Efeito para atualizar as configurações de bloqueio
  useEffect(() => {
    if (Platform.isNative && nativeBridge.updateBlockSettings && isActive) {
      nativeBridge.updateBlockSettings(settings)
        .catch(err => console.error('Erro ao atualizar configurações:', err));
    }
  }, [settings, isActive, nativeBridge]);

  // Efeito para atualizar a lista personalizada
  useEffect(() => {
    if (Platform.isNative && nativeBridge.updateCustomList && isActive) {
      nativeBridge.updateCustomList(customList)
        .catch(err => console.error('Erro ao atualizar lista personalizada:', err));
    }
  }, [customList, isActive, nativeBridge]);

  // Efeito para solicitar permissão de notificação quando o app é iniciado
  useEffect(() => {
    if (Platform.isNative && nativeBridge.requestNotificationPermission) {
      nativeBridge.requestNotificationPermission()
        .catch(err => console.error('Erro ao solicitar permissão de notificação:', err));
    }
  }, [nativeBridge]);
}