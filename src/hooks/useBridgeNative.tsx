import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Interface para simular a ponte nativa
export interface NativeBridge {
  startCallBlockingService?: () => Promise<{ success: boolean }>;
  stopCallBlockingService?: () => Promise<{ success: boolean }>;
  updateBlockingRules?: (rules: string) => Promise<{ success: boolean }>;
  requestCallPermissions?: () => Promise<{ granted: boolean }>;
}

// Checa se estamos em um ambiente capacitor/nativo
export const isNativeApp = () => window.hasOwnProperty('Capacitor');

// Detecta se estamos no Android
export const isAndroid = () => isNativeApp() && (window as any).Capacitor?.getPlatform() === 'android';

export function useBridgeNative() {
  const [nativeBridge, setNativeBridge] = useState<NativeBridge>({});
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const { toast } = useToast();

  // Inicializar a ponte nativa com o Android
  useEffect(() => {
    if (!isAndroid()) return;
    
    const initNativeBridge = async () => {
      try {
        // Simula a obtenção da ponte nativa
        const bridge: NativeBridge = {
          startCallBlockingService: async () => ({ success: true }),
          stopCallBlockingService: async () => ({ success: true }),
          updateBlockingRules: async (rules: string) => ({ success: true }),
          requestCallPermissions: async () => {
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
    };
    
    initNativeBridge();
  }, [toast]);

  const requestPermissions = useCallback(async () => {
    if (isAndroid() && nativeBridge.requestCallPermissions) {
      try {
        const { granted } = await nativeBridge.requestCallPermissions();
        setHasPermissions(granted);
        return { granted };
      } catch (error) {
        console.error("Erro ao solicitar permissões:", error);
        return { granted: false };
      }
    }
    return { granted: false };
  }, [nativeBridge]);

  return {
    nativeBridge,
    hasPermissions,
    requestPermissions
  };
}