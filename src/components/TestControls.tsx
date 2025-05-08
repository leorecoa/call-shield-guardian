
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlockedCall } from "@/types";
import { BeakerIcon } from "lucide-react";

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
        <p className="text-xs text-neonGreen mb-4">
          Simule diferentes tipos de chamadas bloqueadas
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="bg-darkNeon-600/50 border-neonBlue/30 text-neonBlue hover:bg-darkNeon-600/80 hover:border-neonBlue/50 transition-all text-[10px] py-1 px-2 h-auto flex flex-nowrap items-center"
            onClick={() => onSimulateCall("anonymous")}
          >
            <BeakerIcon className="mr-1 h-3 w-3 shrink-0" />
            <span className="truncate">Anônima</span>
          </Button>
          <Button 
            variant="outline" 
            className="bg-darkNeon-600/50 border-neonBlue/30 text-neonBlue hover:bg-darkNeon-600/80 hover:border-neonBlue/50 transition-all text-[10px] py-1 px-2 h-auto flex flex-nowrap items-center"
            onClick={() => onSimulateCall("unknown_server")}
          >
            <BeakerIcon className="mr-1 h-3 w-3 shrink-0" />
            <span className="truncate">Servidor</span>
          </Button>
          <Button 
            variant="outline" 
            className="bg-darkNeon-600/50 border-neonBlue/30 text-neonBlue hover:bg-darkNeon-600/80 hover:border-neonBlue/50 transition-all text-[10px] py-1 px-2 h-auto flex flex-nowrap items-center"
            onClick={() => onSimulateCall("no_valid_number")}
          >
            <BeakerIcon className="mr-1 h-3 w-3 shrink-0" />
            <span className="truncate">Inválido</span>
          </Button>
          <Button 
            variant="outline" 
            className="bg-darkNeon-600/50 border-neonBlue/30 text-neonBlue hover:bg-darkNeon-600/80 hover:border-neonBlue/50 transition-all text-[10px] py-1 px-2 h-auto flex flex-nowrap items-center"
            onClick={() => onSimulateCall("suspicious_ip")}
          >
            <BeakerIcon className="mr-1 h-3 w-3 shrink-0" />
            <span className="truncate">IP Suspeito</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
