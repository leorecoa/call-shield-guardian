
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsSummary } from "@/types";

interface StatsCardProps {
  stats: StatsSummary;
  className?: string;
}

export function StatsCard({ stats, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-center">Estatísticas Call Shield</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-shield-50 p-3 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Total Bloqueadas</p>
            <p className="text-2xl font-bold text-shield-700">{stats.totalBlocked}</p>
          </div>
          <div className="bg-shield-50 p-3 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Hoje</p>
            <p className="text-2xl font-bold text-shield-700">{stats.todayBlocked}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Bloqueadas por Tipo</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Anônimas</span>
              <span className="font-medium text-shield-700">{stats.byType.anonymous}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Servidores Desconhecidos</span>
              <span className="font-medium text-shield-700">{stats.byType.unknown_server}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sem Número Válido</span>
              <span className="font-medium text-shield-700">{stats.byType.no_valid_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">IP Suspeito</span>
              <span className="font-medium text-shield-700">{stats.byType.suspicious_ip}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Bloqueadas pelo Usuário</span>
              <span className="font-medium text-shield-700">{stats.byType.user_blocked}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
