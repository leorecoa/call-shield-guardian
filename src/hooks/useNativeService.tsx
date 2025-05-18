import { useEffect, useRef } from 'react';
import { BlockSettings, CustomListEntry } from '@/types';
import { NativeBridge, isAndroid } from './useBridgeNative';

export function useNativeService(
  isActive: boolean,
  settings: BlockSettings,
  customList: CustomListEntry[],
  hasPermissions: boolean,
  nativeBridge: NativeBridge
) {
  const prevSettingsRef = useRef<string>("");
  
  useEffect(() => {
    if (!isAndroid() || !nativeBridge) return;
    
    // Serialize current settings to compare with previous
    const currentSettings = JSON.stringify({
      isActive,
      settings,
      customList: customList.filter(entry => entry.isBlocked)
    });
    
    // Skip if nothing changed
    if (currentSettings === prevSettingsRef.current) return;
    prevSettingsRef.current = currentSettings;
    
    // Update native service
    const updateNativeService = async () => {
      try {
        if (isActive && hasPermissions) {
          // Start service and update rules
          if (nativeBridge.startCallBlockingService) {
            await nativeBridge.startCallBlockingService();
          }
          
          if (nativeBridge.updateBlockingRules) {
            const rules = JSON.stringify({ settings, customList: customList.filter(entry => entry.isBlocked) });
            await nativeBridge.updateBlockingRules(rules);
          }
        } else if (!isActive && nativeBridge.stopCallBlockingService) {
          await nativeBridge.stopCallBlockingService();
        }
      } catch (error) {
        console.error("Error updating native service:", error);
      }
    };
    
    updateNativeService();
  }, [isActive, settings, customList, hasPermissions, nativeBridge]);
}