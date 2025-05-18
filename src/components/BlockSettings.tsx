import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCallBlocker } from '@/hooks/useCallBlocker';
import { useBridgeNative } from '@/hooks/useBridgeNative';
import { Button } from './ui/button';
import { BellRing, BellOff } from 'lucide-react';

export function BlockSettings() {
  const { settings, updateSettings } = useCallBlocker();
  const { requestNotificationPermission, hasNotificationPermission } = useBridgeNative();
  const [notificationRequested, setNotificationRequested] = useState(false);

  const handleNotificationPermission = async () => {
    const result = await requestNotificationPermission();
    setNotificationRequested(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configurações de Bloqueio</CardTitle>
        <CardDescription>Configure como o CallShield deve filtrar suas chamadas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="blockAnonymous">Bloquear chamadas anônimas</Label>
            <p className="text-sm text-muted-foreground">
              Bloquear chamadas sem identificação de número
            </p>
          </div>
          <Switch
            id="blockAnonymous"
            checked={settings.blockAnonymous}
            onCheckedChange={(checked) => updateSettings({ blockAnonymous: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="blockNoValidNumber">Bloquear números inválidos</Label>
            <p className="text-sm text-muted-foreground">
              Bloquear chamadas com formato de número inválido
            </p>
          </div>
          <Switch
            id="blockNoValidNumber"
            checked={settings.blockNoValidNumber}
            onCheckedChange={(checked) => updateSettings({ blockNoValidNumber: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="blockSuspiciousIP">Bloquear IPs suspeitos</Label>
            <p className="text-sm text-muted-foreground">
              Bloquear chamadas VoIP de endereços IP suspeitos
            </p>
          </div>
          <Switch
            id="blockSuspiciousIP"
            checked={settings.blockSuspiciousIP}
            onCheckedChange={(checked) => updateSettings({ blockSuspiciousIP: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="blockUnknownServers">Bloquear servidores desconhecidos</Label>
            <p className="text-sm text-muted-foreground">
              Bloquear chamadas de servidores VoIP não verificados
            </p>
          </div>
          <Switch
            id="blockUnknownServers"
            checked={settings.blockUnknownServers}
            onCheckedChange={(checked) => updateSettings({ blockUnknownServers: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="blockAll">Bloquear todas as chamadas</Label>
            <p className="text-sm text-muted-foreground">
              Modo "Não perturbe" - bloqueia todas as chamadas
            </p>
          </div>
          <Switch
            id="blockAll"
            checked={settings.blockAll}
            onCheckedChange={(checked) => updateSettings({ blockAll: checked })}
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações de chamadas bloqueadas</Label>
              <p className="text-sm text-muted-foreground">
                Receba notificações quando chamadas forem bloqueadas
              </p>
            </div>
            {hasNotificationPermission ? (
              <div className="flex items-center text-green-600">
                <BellRing className="mr-2 h-4 w-4" />
                <span className="text-sm">Ativadas</span>
              </div>
            ) : (
              <Button 
                onClick={handleNotificationPermission}
                variant="outline"
                size="sm"
                disabled={notificationRequested}
              >
                {notificationRequested ? (
                  <>
                    <BellOff className="mr-2 h-4 w-4" />
                    Solicitado
                  </>
                ) : (
                  <>
                    <BellRing className="mr-2 h-4 w-4" />
                    Ativar
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}