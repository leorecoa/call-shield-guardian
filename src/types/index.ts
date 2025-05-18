export interface BlockedCall {
  id: string;
  sourceIP?: string;
  phoneNumber?: string;
  timestamp: number;
  callType: 'anonymous' | 'unknown_server' | 'no_valid_number' | 'suspicious_ip' | 'user_blocked';
  isVoIP: boolean;
}

export interface StatsSummary {
  totalBlocked: number;
  todayBlocked: number;
  byType: {
    anonymous: number;
    unknown_server: number;
    no_valid_number: number;
    suspicious_ip: number;
    user_blocked: number;
  };
}

export interface DetailedStats extends StatsSummary {
  // Estatísticas por período
  byPeriod: {
    daily: TimeSeriesData[];
    weekly: TimeSeriesData[];
    monthly: TimeSeriesData[];
  };
  // Estatísticas por hora do dia
  byHour: {
    hour: number;
    count: number;
  }[];
  // Estatísticas por dia da semana
  byDayOfWeek: {
    day: number; // 0-6, onde 0 é domingo
    count: number;
  }[];
  // Chamadores mais frequentes
  topCallers: {
    value: string;
    count: number;
    type: 'phone' | 'ip';
  }[];
  // Duração da proteção
  protectionDuration: {
    days: number;
    hours: number;
    minutes: number;
  };
  // Eficiência do bloqueio
  blockEfficiency: {
    percentage: number;
    potentialThreats: number;
  };
}

export interface TimeSeriesData {
  date: number; // timestamp
  count: number;
}

export interface BlockSettings {
  blockAll: boolean;
  blockAnonymous: boolean;
  blockUnknownServers: boolean;
  blockNoValidNumber: boolean;
  blockSuspiciousIP: boolean;
}

export interface CustomListEntry {
  id: string;
  value: string;
  type: 'ip' | 'phone' | 'pattern';
  isBlocked: boolean;
  addedAt: number;
  notes?: string;
}

export interface NotificationSetting {
  showBlockedNotifications: boolean;
  showSummaryNotifications: boolean;
  notificationSound: boolean;
  notificationVibration: boolean;
}