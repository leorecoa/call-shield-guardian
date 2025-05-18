import { BlockSettings as BlockSettingsType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, Switch, Label } from "@/components/ui";
import { SectionImage } from "./SectionImage";
import { memo, useCallback } from "react";

interface BlockSettingsProps {
  settings: BlockSettingsType;
  onUpdateSettings: (settings: Partial<BlockSettingsType>) => void;
  className?: string;
}

// Componente de configuração individual memoizado
const SettingItem = memo(({ 
  id,
  label, 
  description,
  checked, 
  onChange 
}: { 
  id: string;
  label: string; 
  description: string;
  checked: boolean; 
  onChange: (checked: boolean) => void;
}) => {
  const handleChange = useCallback((checked: boolean) => {
    onChange(checked);
  }, [onChange]);

  return (
    <div className="flex items-start space-x-3 py-3">
      <Switch 
        id={id}
        checked={checked} 
        onCheckedChange={handleChange}
        className="mt-1"
      />
      <div className="space-y-1">
        <Label 
          htmlFor={id}
          className="text-sm font-medium"
        >
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
});

SettingItem.displayName = "SettingItem";

function BlockSettingsComponent({ 
  settings, 
  onUpdateSettings, 
  className 
}: BlockSettingsProps) {
  // Handlers memoizados para cada configuração
  const handleBlockAllChange = useCallback((checked: boolean) => {
    onUpdateSettings({ blockAll: checked });
  }, [onUpdateSettings]);

  const handleBlockAnonymousChange = useCallback((checked: boolean) => {
    onUpdateSettings({ blockAnonymous: checked });
  }, [onUpdateSettings]);

  const handleBlockUnknownServersChange = useCallback((checked: boolean) => {
    onUpdateSettings({ blockUnknownServers: checked });
  }, [onUpdateSettings]);

  const handleBlockNoValidNumberChange = useCallback((checked: boolean) => {
    onUpdateSettings({ blockNoValidNumber: checked });
  }, [onUpdateSettings]);

  const handleBlockSuspiciousIPChange = useCallback((checked: boolean) => {
    onUpdateSettings({ blockSuspiciousIP: checked });
  }, [onUpdateSettings]);

  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center space-x-2">
        <SectionImage section="settings" size="sm" />
        <CardTitle className="text-lg font-semibold text-neonGreen">Configurações de Bloqueio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <SettingItem
            id="block-all"
            label="Bloquear Todas as Chamadas"
            description="Bloqueia todas as chamadas recebidas, independente da origem"
            checked={settings.blockAll}
            onChange={handleBlockAllChange}
          />
          
          <SettingItem
            id="block-anonymous"
            label="Bloquear Chamadas Anônimas"
            description="Bloqueia chamadas sem identificação de número"
            checked={settings.blockAnonymous}
            onChange={handleBlockAnonymousChange}
          />
          
          <SettingItem
            id="block-unknown-servers"
            label="Bloquear Servidores Desconhecidos"
            description="Bloqueia chamadas de servidores VoIP não reconhecidos"
            checked={settings.blockUnknownServers}
            onChange={handleBlockUnknownServersChange}
          />
          
          <SettingItem
            id="block-invalid-numbers"
            label="Bloquear Números Inválidos"
            description="Bloqueia chamadas com formato de número inválido"
            checked={settings.blockNoValidNumber}
            onChange={handleBlockNoValidNumberChange}
          />
          
          <SettingItem
            id="block-suspicious-ip"
            label="Bloquear IPs Suspeitos"
            description="Bloqueia chamadas de IPs marcados como suspeitos"
            checked={settings.blockSuspiciousIP}
            onChange={handleBlockSuspiciousIPChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Exportar componente memoizado
export const BlockSettings = memo(BlockSettingsComponent);