import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCallBlocker } from '@/hooks/useCallBlocker';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export function SecurityLevelSelector() {
  const { securityLevel, applySecurityRules } = useCallBlocker();
  const { user, syncService } = useSupabaseAuth();
  const [syncing, setSyncing] = useState(false);
  
  // Função para aplicar nível de segurança e sincronizar
  const handleApplyLevel = async (level: 'low' | 'medium' | 'high') => {
    // Aplicar regras de segurança
    applySecurityRules(level);
    
    // Se o usuário estiver autenticado, sincronizar configurações
    if (user) {
      try {
        setSyncing(true);
        await syncService.syncBlockSettings({
          blockAll: level === 'high',
          blockAnonymous: level !== 'low',
          blockUnknownServers: level === 'high',
          blockNoValidNumber: true,
          blockSuspiciousIP: level !== 'low'
        });
      } catch (error) {
        console.error('Erro ao sincronizar configurações:', error);
      } finally {
        setSyncing(false);
      }
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nível de Segurança</CardTitle>
        <CardDescription>
          Escolha o nível de proteção para seu dispositivo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={securityLevel === 'low' ? "default" : "outline"}
            className="flex flex-col items-center justify-center h-24"
            onClick={() => handleApplyLevel('low')}
            disabled={syncing}
          >
            <Shield className="h-8 w-8 mb-2" />
            <span>Básico</span>
          </Button>
          
          <Button
            variant={securityLevel === 'medium' ? "default" : "outline"}
            className="flex flex-col items-center justify-center h-24"
            onClick={() => handleApplyLevel('medium')}
            disabled={syncing}
          >
            <ShieldCheck className="h-8 w-8 mb-2" />
            <span>Médio</span>
          </Button>
          
          <Button
            variant={securityLevel === 'high' ? "default" : "outline"}
            className="flex flex-col items-center justify-center h-24"
            onClick={() => handleApplyLevel('high')}
            disabled={syncing}
          >
            <ShieldAlert className="h-8 w-8 mb-2" />
            <span>Máximo</span>
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          {securityLevel === 'low' && "Bloqueia apenas chamadas com padrões de fraude conhecidos."}
          {securityLevel === 'medium' && "Bloqueia chamadas anônimas e a maioria dos números de telemarketing."}
          {securityLevel === 'high' && "Proteção máxima, bloqueia todas as chamadas suspeitas."}
          {user && " Suas configurações são sincronizadas automaticamente."}
        </p>
      </CardContent>
    </Card>
  );
}