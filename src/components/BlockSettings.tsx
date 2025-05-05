
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlockSettings as BlockSettingsType } from "@/types";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BlockSettingsProps {
  settings: BlockSettingsType;
  onUpdateSettings: (settings: Partial<BlockSettingsType>) => void;
  isActive: boolean;
  onToggleActive: () => void;
  hasPermissions?: boolean;
  className?: string;
}

export function BlockSettings({ 
  settings, 
  onUpdateSettings, 
  isActive,
  onToggleActive,
  hasPermissions = true,
  className 
}: BlockSettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Configurações de Proteção
          <Switch 
            checked={isActive} 
            onCheckedChange={onToggleActive}
            className="data-[state=checked]:bg-shield-500"
          />
        </CardTitle>
        <CardDescription>
          Configure como o Call Shield protege seu dispositivo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasPermissions && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Permissões de telefone não concedidas. O bloqueio pode não funcionar corretamente.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="block-all" className="flex flex-col">
            <span>Bloquear Todas as Chamadas VoIP</span>
            <span className="text-xs text-muted-foreground">Bloqueia todas as chamadas VoIP recebidas</span>
          </Label>
          <Switch 
            id="block-all" 
            checked={settings.blockAll}
            onCheckedChange={(checked) => onUpdateSettings({ blockAll: checked })}
            disabled={!isActive}
            className="data-[state=checked]:bg-shield-500"
          />
        </div>

        <div 
          className="text-sm font-medium cursor-pointer flex items-center gap-1 text-shield-600"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Ocultar" : "Mostrar"} Filtros Avançados
        </div>

        {showAdvanced && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="block-anonymous" className="flex flex-col">
                <span>Bloquear Anônimas</span>
                <span className="text-xs text-muted-foreground">Bloquear chamadas sem identificador</span>
              </Label>
              <Switch 
                id="block-anonymous" 
                checked={settings.blockAnonymous} 
                onCheckedChange={(checked) => onUpdateSettings({ blockAnonymous: checked })}
                disabled={!isActive || settings.blockAll}
                className="data-[state=checked]:bg-shield-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="block-unknown" className="flex flex-col">
                <span>Bloquear Servidores Desconhecidos</span>
                <span className="text-xs text-muted-foreground">Bloquear chamadas de servidores VoIP não verificados</span>
              </Label>
              <Switch 
                id="block-unknown" 
                checked={settings.blockUnknownServers} 
                onCheckedChange={(checked) => onUpdateSettings({ blockUnknownServers: checked })}
                disabled={!isActive || settings.blockAll}
                className="data-[state=checked]:bg-shield-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="block-invalid" className="flex flex-col">
                <span>Bloquear Números Inválidos</span>
                <span className="text-xs text-muted-foreground">Bloquear chamadas sem registro válido de operadora</span>
              </Label>
              <Switch 
                id="block-invalid" 
                checked={settings.blockNoValidNumber} 
                onCheckedChange={(checked) => onUpdateSettings({ blockNoValidNumber: checked })}
                disabled={!isActive || settings.blockAll}
                className="data-[state=checked]:bg-shield-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="block-suspicious" className="flex flex-col">
                <span>Bloquear IPs Suspeitos</span>
                <span className="text-xs text-muted-foreground">Bloquear chamadas de fontes conhecidas de spam</span>
              </Label>
              <Switch 
                id="block-suspicious" 
                checked={settings.blockSuspiciousIP} 
                onCheckedChange={(checked) => onUpdateSettings({ blockSuspiciousIP: checked })}
                disabled={!isActive || settings.blockAll}
                className="data-[state=checked]:bg-shield-500"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
