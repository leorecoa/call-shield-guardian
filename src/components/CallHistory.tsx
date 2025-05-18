import { BlockedCall } from "@/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, ScrollArea, Button } from "@/components/ui";
import { PhoneOff, Trash2 } from "lucide-react";
import { SectionImage } from "./SectionImage";
import { memo, useCallback } from "react";

interface CallHistoryProps {
  calls: BlockedCall[];
  onClearHistory: () => void;
  className?: string;
}

const CallItem = memo(({ call }: { call: BlockedCall }) => {
  const getCallTypeLabel = (type: BlockedCall["callType"]) => {
    switch (type) {
      case "anonymous":
        return "Chamada Anônima";
      case "unknown_server":
        return "Servidor Desconhecido";
      case "no_valid_number":
        return "Número Inválido";
      case "suspicious_ip":
        return "IP Suspeito";
      case "user_blocked":
        return "Bloqueada pelo Usuário";
      default:
        return type;
    }
  };

  return (
    <div className="bg-darkNeon-700 rounded-lg p-3 border border-neonBlue/20">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-sm text-neonBlue">
            {call.phoneNumber || "Sem Número"}
          </div>
          <div className="text-xs text-muted-foreground">
            {call.sourceIP ? `IP: ${call.sourceIP}` : "IP não disponível"}
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-neonPink/20 text-neonPink font-medium">
          {getCallTypeLabel(call.callType)}
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Bloqueada em {format(new Date(call.timestamp), "dd/MM/yyyy 'às' HH:mm")}
      </div>
    </div>
  );
});

CallItem.displayName = "CallItem";

function CallHistoryComponent({ calls, onClearHistory, className }: CallHistoryProps) {
  const handleClearHistory = useCallback(() => {
    onClearHistory();
  }, [onClearHistory]);

  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <SectionImage section="history" size="sm" />
          <CardTitle className="text-lg font-semibold text-neonPink">Chamadas Bloqueadas</CardTitle>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearHistory}
          className="h-8 gap-1 border-neonPink text-neonPink hover:bg-neonPink/20"
        >
          <Trash2 className="h-4 w-4" />
          Limpar
        </Button>
      </CardHeader>
      <CardContent>
        {calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PhoneOff className="h-12 w-12 text-neonPurple mb-2" />
            <p className="text-neonPink">Nenhuma chamada foi bloqueada ainda</p>
            <p className="text-xs text-muted-foreground mt-1">
              Quando chamadas forem bloqueadas, aparecerão aqui
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-3">
              {calls.map((call) => (
                <CallItem key={call.id} call={call} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export const CallHistory = memo(CallHistoryComponent);