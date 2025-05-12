
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
  // Update native service when settings change
  useEffect(() => {
    if (!isAndroid() || !nativeBridge) return;
    
    const updateNativeService = async () => {
      try {
        // Start or stop service based on activation status
        if (isActive && hasPermissions) {
          if (nativeBridge.startCallBlockingService) {
            await nativeBridge.startCallBlockingService();
          }
          
          // Update blocking rules
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
        console.error("Error updating native service:", error);
      }
    };
    
    // Wrap in try/catch to prevent unhandled promise rejections in production
    try {
      updateNativeService();
    } catch (error) {
      console.error("Failed to update native service:", error);
    }
  }, [isActive, settings, customList, hasPermissions, nativeBridge]);

  return null;
}
