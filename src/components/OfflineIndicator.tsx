import { useOfflineMode } from '@/hooks/useOfflineMode';
import { Wifi, WifiOff, CloudOff, CloudSync } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const { isOfflineMode, syncPending, connectionType } = useOfflineMode();
  
  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-lg transition-all duration-300",
      isOfflineMode 
        ? "bg-amber-500 text-white" 
        : syncPending 
          ? "bg-blue-500 text-white" 
          : "bg-green-500 text-white opacity-0 hover:opacity-100"
    )}>
      {isOfflineMode ? (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Modo Offline</span>
        </>
      ) : syncPending ? (
        <>
          <CloudSync className="h-4 w-4 animate-spin" />
          <span>Sincronizando...</span>
        </>
      ) : (
        <>
          <Wifi className="h-4 w-4" />
          <span>Online</span>
        </>
      )}
      
      {connectionType === 'cellular' && !isOfflineMode && (
        <span className="ml-1 text-xs bg-white/20 px-1 rounded">Dados móveis</span>
      )}
    </div>
  );
}