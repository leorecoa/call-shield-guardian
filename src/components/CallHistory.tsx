
import { BlockedCall } from "@/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PhoneOff, Trash2 } from "lucide-react";

interface CallHistoryProps {
  calls: BlockedCall[];
  onClearHistory: () => void;
  className?: string;
}

export function CallHistory({ calls, onClearHistory, className }: CallHistoryProps) {
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
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Chamadas Bloqueadas</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearHistory}
          className="h-8 gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Limpar
        </Button>
      </CardHeader>
      <CardContent>
        {calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PhoneOff className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhuma chamada foi bloqueada ainda</p>
            <p className="text-xs text-muted-foreground mt-1">
              Quando chamadas forem bloqueadas, aparecerão aqui
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-3">
              {calls.map((call) => (
                <div key={call.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">
                        {call.phoneNumber || "Sem Número"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {call.sourceIP ? `IP: ${call.sourceIP}` : "IP não disponível"}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-danger-light text-danger font-medium">
                      {getCallTypeLabel(call.callType)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Bloqueada em {format(new Date(call.timestamp), "dd/MM/yyyy 'às' HH:mm")}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
