
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlockedCall } from "@/types";
import { PhoneMissed } from "lucide-react";

interface TestControlsProps {
  onSimulateCall: (type: BlockedCall["callType"]) => void;
  className?: string;
}

export function TestControls({ onSimulateCall, className }: TestControlsProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Funções de Teste</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Simule diferentes tipos de chamadas bloqueadas para ver como o aplicativo funciona
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="bg-shield-50 border-shield-100 text-shield-700 hover:bg-shield-100"
            onClick={() => onSimulateCall("anonymous")}
          >
            <PhoneMissed className="mr-2 h-4 w-4" />
            Chamada Anônima
          </Button>
          <Button 
            variant="outline" 
            className="bg-shield-50 border-shield-100 text-shield-700 hover:bg-shield-100"
            onClick={() => onSimulateCall("unknown_server")}
          >
            <PhoneMissed className="mr-2 h-4 w-4" />
            Servidor Desconhecido
          </Button>
          <Button 
            variant="outline" 
            className="bg-shield-50 border-shield-100 text-shield-700 hover:bg-shield-100"
            onClick={() => onSimulateCall("no_valid_number")}
          >
            <PhoneMissed className="mr-2 h-4 w-4" />
            Número Inválido
          </Button>
          <Button 
            variant="outline" 
            className="bg-shield-50 border-shield-100 text-shield-700 hover:bg-shield-100"
            onClick={() => onSimulateCall("suspicious_ip")}
          >
            <PhoneMissed className="mr-2 h-4 w-4" />
            IP Suspeito
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
