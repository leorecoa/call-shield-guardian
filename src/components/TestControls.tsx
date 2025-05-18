import { BlockedCall } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { SectionImage } from "./SectionImage";
import { memo, useCallback } from "react";

interface TestControlsProps {
  onSimulateCall: (type: BlockedCall["callType"]) => void;
  isActive: boolean;
  className?: string;
}

// Botão de teste memoizado
const TestButton = memo(({ 
  label, 
  callType, 
  onSimulate,
  disabled
}: { 
  label: string; 
  callType: BlockedCall["callType"];
  onSimulate: (type: BlockedCall["callType"]) => void;
  disabled: boolean;
}) => {
  const handleClick = useCallback(() => {
    onSimulate(callType);
  }, [callType, onSimulate]);

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={disabled}
      className="border-neonBlue/50 hover:bg-neonBlue/20 text-neonBlue"
    >
      {label}
    </Button>
  );
});

TestButton.displayName = "TestButton";

function TestControlsComponent({ 
  onSimulateCall, 
  isActive,
  className 
}: TestControlsProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center space-x-2">
        <SectionImage section="shield" size="sm" animated={isActive} />
        <CardTitle className="text-lg font-semibold text-neonBlue">Testar Bloqueio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Simule diferentes tipos de chamadas para testar o bloqueio
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            <TestButton
              label="Chamada Anônima"
              callType="anonymous"
              onSimulate={onSimulateCall}
              disabled={!isActive}
            />
            
            <TestButton
              label="Servidor Desconhecido"
              callType="unknown_server"
              onSimulate={onSimulateCall}
              disabled={!isActive}
            />
            
            <TestButton
              label="Número Inválido"
              callType="no_valid_number"
              onSimulate={onSimulateCall}
              disabled={!isActive}
            />
            
            <TestButton
              label="IP Suspeito"
              callType="suspicious_ip"
              onSimulate={onSimulateCall}
              disabled={!isActive}
            />
            
            <TestButton
              label="Número Bloqueado"
              callType="user_blocked"
              onSimulate={onSimulateCall}
              disabled={!isActive}
            />
          </div>
          
          {!isActive && (
            <p className="text-xs text-neonPink">
              Ative a proteção para testar o bloqueio de chamadas
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Exportar componente memoizado
export const TestControls = memo(TestControlsComponent);