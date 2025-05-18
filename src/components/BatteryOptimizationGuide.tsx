import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Battery, BatteryCharging, BatteryWarning, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useBridgeNative } from '@/hooks/useBridgeNative';

export function BatteryOptimizationGuide() {
  const { nativeBridge } = useBridgeNative();
  const [isExempt, setIsExempt] = useState<boolean | null>(null);
  const [hasRequested, setHasRequested] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar status de otimização de bateria
  useEffect(() => {
    const checkBatteryOptimization = async () => {
      try {
        if (nativeBridge.checkBatteryOptimization) {
          const result = await nativeBridge.checkBatteryOptimization();
          setIsExempt(result.isExempt);
          setHasRequested(result.hasRequested);
        }
      } catch (error) {
        console.error('Erro ao verificar otimização de bateria:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkBatteryOptimization();
  }, [nativeBridge]);
  
  // Solicitar isenção de otimização de bateria
  const requestExemption = async () => {
    try {
      if (nativeBridge.requestBatteryOptimizationExemption) {
        await nativeBridge.requestBatteryOptimizationExemption();
        
        // Verificar novamente após a solicitação
        setTimeout(async () => {
          if (nativeBridge.checkBatteryOptimization) {
            const result = await nativeBridge.checkBatteryOptimization();
            setIsExempt(result.isExempt);
            setHasRequested(true);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao solicitar isenção de otimização de bateria:', error);
    }
  };
  
  // Se ainda está carregando, mostrar indicador
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BatteryCharging className="h-5 w-5 text-blue-500 animate-pulse" />
            Verificando otimização de bateria...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }
  
  // Se já está isento, mostrar confirmação
  if (isExempt) {
    return (
      <Card className="w-full border-green-500 bg-green-50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            Otimização de bateria desativada
          </CardTitle>
          <CardDescription>
            O aplicativo está configurado para funcionar corretamente em segundo plano
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Se já solicitamos mas não foi concedido, mostrar alerta
  if (hasRequested && !isExempt) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BatteryWarning className="h-5 w-5 text-amber-500" />
            Otimização de bateria ativada
          </CardTitle>
          <CardDescription>
            O bloqueio de chamadas pode não funcionar corretamente em segundo plano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Para garantir que o CallShield funcione corretamente mesmo quando o aplicativo não estiver aberto,
              é necessário desativar a otimização de bateria para este aplicativo.
            </AlertDescription>
          </Alert>
          
          <Button onClick={requestExemption} className="w-full">
            <Battery className="mr-2 h-4 w-4" />
            Desativar otimização de bateria
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Caso padrão: primeira solicitação
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="h-5 w-5" />
          Otimização de bateria
        </CardTitle>
        <CardDescription>
          Melhore o desempenho do bloqueio de chamadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Para garantir que o CallShield funcione corretamente mesmo quando o aplicativo não estiver aberto,
          é recomendado desativar a otimização de bateria para este aplicativo.
        </p>
        
        <Button onClick={requestExemption} className="w-full">
          <BatteryCharging className="mr-2 h-4 w-4" />
          Desativar otimização de bateria
        </Button>
      </CardContent>
    </Card>
  );
}