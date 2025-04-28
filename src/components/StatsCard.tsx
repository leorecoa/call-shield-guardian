
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
        <CardTitle className="text-lg font-semibold text-center">Call Shield Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-shield-50 p-3 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Total Blocked</p>
            <p className="text-2xl font-bold text-shield-700">{stats.totalBlocked}</p>
          </div>
          <div className="bg-shield-50 p-3 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-2xl font-bold text-shield-700">{stats.todayBlocked}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Blocked by Type</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Anonymous</span>
              <span className="font-medium text-shield-700">{stats.byType.anonymous}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Unknown Servers</span>
              <span className="font-medium text-shield-700">{stats.byType.unknown_server}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">No Valid Number</span>
              <span className="font-medium text-shield-700">{stats.byType.no_valid_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Suspicious IP</span>
              <span className="font-medium text-shield-700">{stats.byType.suspicious_ip}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">User Blocked</span>
              <span className="font-medium text-shield-700">{stats.byType.user_blocked}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
