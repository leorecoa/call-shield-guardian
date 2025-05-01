
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlockedCall } from "@/types";
import { Flask } from "lucide-react";

interface TestControlsProps {
  onSimulateCall: (type: BlockedCall["callType"]) => void;
  className?: string;
}

export function TestControls({ onSimulateCall, className }: TestControlsProps) {
  return (
    <Card className={`${className} bg-darkNeon-700/40 border-neonBlue/20`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-neonBlue">Funções de Teste</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neonGreen mb-4">
          Simule diferentes tipos de chamadas bloqueadas para testar o aplicativo
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="bg-darkNeon-600/50 border-neonBlue/30 text-neonBlue hover:bg-darkNeon-600/80 hover:border-neonBlue/50 transition-all"
            onClick={() => onSimulateCall("anonymous")}
          >
            <Flask className="mr-2 h-4 w-4" />
            Chamada Anônima
          </Button>
          <Button 
            variant="outline" 
            className="bg-darkNeon-600/50 border-neonBlue/30 text-neonBlue hover:bg-darkNeon-600/80 hover:border-neonBlue/50 transition-all"
            onClick={() => onSimulateCall("unknown_server")}
          >
            <Flask className="mr-2 h-4 w-4" />
            Servidor Desconhecido
          </Button>
          <Button 
            variant="outline" 
            className="bg-darkNeon-600/50 border-neonBlue/30 text-neonBlue hover:bg-darkNeon-600/80 hover:border-neonBlue/50 transition-all"
            onClick={() => onSimulateCall("no_valid_number")}
          >
            <Flask className="mr-2 h-4 w-4" />
            Número Inválido
          </Button>
          <Button 
            variant="outline" 
            className="bg-darkNeon-600/50 border-neonBlue/30 text-neonBlue hover:bg-darkNeon-600/80 hover:border-neonBlue/50 transition-all"
            onClick={() => onSimulateCall("suspicious_ip")}
          >
            <Flask className="mr-2 h-4 w-4" />
            IP Suspeito
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
