import { StatsSummary } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { SectionImage } from "./SectionImage";
import { memo } from "react";

interface StatsCardProps {
  stats: StatsSummary;
  className?: string;
}

function StatsCardComponent({ stats, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center space-x-2">
        <SectionImage section="stats" size="sm" />
        <CardTitle className="text-lg font-semibold text-neonPurple">Estatísticas de Bloqueio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatItem 
            label="Total Bloqueadas" 
            value={stats.totalBlocked} 
            className="bg-neonBlue/10"
          />
          <StatItem 
            label="Hoje" 
            value={stats.todayBlocked} 
            className="bg-neonPurple/10"
          />
          <StatItem 
            label="Anônimas" 
            value={stats.byType.anonymous} 
            className="bg-neonPink/10"
          />
          <StatItem 
            label="Servidores Desconhecidos" 
            value={stats.byType.unknown_server} 
            className="bg-neonGreen/10"
          />
          <StatItem 
            label="Números Inválidos" 
            value={stats.byType.no_valid_number} 
            className="bg-neonBlue/10"
          />
          <StatItem 
            label="IPs Suspeitos" 
            value={stats.byType.suspicious_ip} 
            className="bg-neonPurple/10"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de estatística individual memoizado
const StatItem = memo(({ label, value, className }: { label: string; value: number; className?: string }) => (
  <div className={`p-3 rounded-lg ${className}`}>
    <div className="text-sm font-medium text-muted-foreground">{label}</div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
  </div>
));

StatItem.displayName = "StatItem";

// Exportar componente memoizado
export const StatsCard = memo(StatsCardComponent);