import { useEffect, useState } from 'react';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudOff, CloudSync, RefreshCw } from 'lucide-react';

export function SyncManager() {
  const { isOfflineMode, syncPending, getPendingSyncCalls, markSynced } = useOfflineMode();
  const { user, syncService } = useSupabaseAuth();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Tentar sincronizar automaticamente quando voltar online
  useEffect(() => {
    if (!isOfflineMode && syncPending && user) {
      handleSync();
    }
  }, [isOfflineMode, syncPending, user]);
  
  // Função para sincronizar dados pendentes
  const handleSync = async () => {
    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Faça login para sincronizar seus dados",
        variant: "destructive"
      });
      return;
    }
    
    if (!syncPending) {
      toast({
        title: "Nada para sincronizar",
        description: "Não há dados pendentes para sincronização",
        variant: "default"
      });
      return;
    }
    
    try {
      setIsSyncing(true);
      
      // Obter chamadas pendentes
      const pendingCalls = getPendingSyncCalls();
      
      if (pendingCalls.length > 0) {
        // Sincronizar com o servidor
        await syncService.syncBlockedCalls(pendingCalls);
        
        // Marcar como sincronizado
        markSynced();
        
        toast({
          title: "Sincronização concluída",
          description: `${pendingCalls.length} chamadas sincronizadas com sucesso`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar os dados pendentes",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Se não há dados pendentes ou usuário não está autenticado, não mostrar nada
  if (!syncPending || !user) {
    return null;
  }
  
  return (
    <Card className="border-amber-500 shadow-amber-500/20 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {isOfflineMode ? (
            <CloudOff className="h-5 w-5 text-amber-500" />
          ) : (
            <CloudSync className="h-5 w-5 text-blue-500" />
          )}
          Sincronização Pendente
        </CardTitle>
        <CardDescription>
          Há dados que precisam ser sincronizados com a nuvem
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isOfflineMode ? (
          <p className="text-sm text-muted-foreground mb-4">
            Os dados serão sincronizados automaticamente quando você estiver online novamente.
          </p>
        ) : (
          <div className="flex justify-end">
            <Button 
              onClick={handleSync} 
              disabled={isSyncing}
              size="sm"
              className="gap-2"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CloudSync className="h-4 w-4" />
              )}
              {isSyncing ? "Sincronizando..." : "Sincronizar agora"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}