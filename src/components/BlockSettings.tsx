
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlockSettings as BlockSettingsType } from "@/types";
import { useState } from "react";

interface BlockSettingsProps {
  settings: BlockSettingsType;
  onUpdateSettings: (settings: Partial<BlockSettingsType>) => void;
  isActive: boolean;
  onToggleActive: () => void;
  className?: string;
}

export function BlockSettings({ 
  settings, 
  onUpdateSettings, 
  isActive,
  onToggleActive,
  className 
}: BlockSettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Protection Settings
          <Switch 
            checked={isActive} 
            onCheckedChange={onToggleActive}
            className="data-[state=checked]:bg-shield-500"
          />
        </CardTitle>
        <CardDescription>
          Configure how Call Shield protects your device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="block-all" className="flex flex-col">
            <span>Block All VoIP Calls</span>
            <span className="text-xs text-muted-foreground">Block all incoming VoIP calls</span>
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
          {showAdvanced ? "Hide" : "Show"} Advanced Filters
        </div>

        {showAdvanced && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="block-anonymous" className="flex flex-col">
                <span>Block Anonymous</span>
                <span className="text-xs text-muted-foreground">Block calls without caller ID</span>
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
                <span>Block Unknown Servers</span>
                <span className="text-xs text-muted-foreground">Block calls from unverified VoIP servers</span>
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
                <span>Block Invalid Numbers</span>
                <span className="text-xs text-muted-foreground">Block calls without valid carrier registration</span>
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
                <span>Block Suspicious IPs</span>
                <span className="text-xs text-muted-foreground">Block calls from known spam sources</span>
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
