import { useEffect } from 'react';
import { Shield } from '@/components/Shield';
import { StatsCard } from '@/components/StatsCard';
import { BlockSettings } from '@/components/BlockSettings';
import { CallHistory } from '@/components/CallHistory';
import { CustomListManager } from '@/components/CustomListManager';
import { SecurityLevelSelector } from '@/components/SecurityLevelSelector';
import { TestControls } from '@/components/TestControls';
import { ConfigGuide } from '@/components/ConfigGuide';
import { BackupSync } from '@/components/BackupSync';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { SyncManager } from '@/components/SyncManager';
import { BatteryOptimizationGuide } from '@/components/BatteryOptimizationGuide';
import { useCallBlocker } from '@/hooks/useCallBlocker';
import { SplashScreen } from '@/components/SplashScreen';
import { useBridgeNative } from '@/hooks/useBridgeNative';

export function Index() {
  const { isActive, hasPermissions, toggleActive, stats, isOfflineMode, syncPending } = useCallBlocker();
  const { batteryOptimizationStatus } = useBridgeNative();
  
  // Efeito para verificar se é a primeira execução
  useEffect(() => {
    const isFirstRun = localStorage.getItem('firstRun') !== 'false';
    
    if (isFirstRun) {
      // Marcar que não é mais a primeira execução
      localStorage.setItem('firstRun', 'false');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SplashScreen />
      
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <Shield isActive={isActive} hasPermissions={hasPermissions} onClick={toggleActive} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <StatsCard stats={stats} />
            <SecurityLevelSelector />
          </div>
          
          {/* Mostrar gerenciador de sincronização se houver dados pendentes */}
          {syncPending && (
            <div className="w-full">
              <SyncManager />
            </div>
          )}
          
          {/* Mostrar guia de otimização de bateria se necessário */}
          {!batteryOptimizationStatus.isExempt && (
            <div className="w-full">
              <BatteryOptimizationGuide />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BlockSettings />
          <BackupSync />
        </div>
        
        <CustomListManager />
        
        <CallHistory />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TestControls />
          <ConfigGuide />
        </div>
      </div>
      
      {/* Indicador de modo offline */}
      <OfflineIndicator />
    </div>
  );
}