
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
