
import { useState, useEffect } from 'react';
import { BlockedCall, StatsSummary, BlockSettings, CustomListEntry } from '@/types';
import { useToast } from "@/components/ui/use-toast";

const INITIAL_STATS: StatsSummary = {
  totalBlocked: 0,
  todayBlocked: 0,
  byType: {
    anonymous: 0,
    unknown_server: 0,
    no_valid_number: 0,
    suspicious_ip: 0,
    user_blocked: 0
  }
};

const DEFAULT_SETTINGS: BlockSettings = {
  blockAll: false,
  blockAnonymous: true,
  blockUnknownServers: true,
  blockNoValidNumber: true,
  blockSuspiciousIP: true
};

// Mock data for demonstration 
const MOCK_BLOCKED_CALLS: BlockedCall[] = [
  {
    id: '1',
    sourceIP: '203.0.113.1',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    callType: 'suspicious_ip',
    isVoIP: true
  },
  {
    id: '2',
    phoneNumber: 'Anonymous',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    callType: 'anonymous',
    isVoIP: true
  },
  {
    id: '3',
    phoneNumber: '+1234567890',
    sourceIP: '198.51.100.1',
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    callType: 'user_blocked',
    isVoIP: true
  },
  {
    id: '4',
    sourceIP: '192.0.2.123',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    callType: 'unknown_server',
    isVoIP: true
  },
  {
    id: '5',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    callType: 'no_valid_number',
    isVoIP: true
  }
];

// This would connect to native Android code in a real implementation
export function useCallBlocker() {
  const [blockedCalls, setBlockedCalls] = useState<BlockedCall[]>(MOCK_BLOCKED_CALLS);
  const [stats, setStats] = useState<StatsSummary>(INITIAL_STATS);
  const [settings, setSettings] = useState<BlockSettings>(DEFAULT_SETTINGS);
  const [customList, setCustomList] = useState<CustomListEntry[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Calculate stats from blocked calls
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    const todayBlocked = blockedCalls.filter(call => call.timestamp >= todayTimestamp).length;
    
    // Group by type
    const byType = blockedCalls.reduce((acc, call) => {
      acc[call.callType as keyof typeof acc]++;
      return acc;
    }, {
      anonymous: 0,
      unknown_server: 0,
      no_valid_number: 0,
      suspicious_ip: 0,
      user_blocked: 0
    });
    
    setStats({
      totalBlocked: blockedCalls.length,
      todayBlocked,
      byType
    });
  }, [blockedCalls]);
  
  // Add a new blocked call
  const addBlockedCall = (call: Omit<BlockedCall, 'id'>) => {
    const newCall = {
      ...call,
      id: crypto.randomUUID()
    };
    
    setBlockedCalls(prev => [newCall, ...prev]);
    
    // Show notification when a call is blocked
    toast({
      title: "Call Blocked",
      description: `A ${call.callType.replace('_', ' ')} call was blocked`,
      variant: "default"
    });
  };
  
  // Toggle the active state of the call blocker
  const toggleActive = () => {
    setIsActive(prev => !prev);
  };
  
  // Update settings
  const updateSettings = (newSettings: Partial<BlockSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Add custom entry to blocklist or allowlist
  const addCustomEntry = (entry: Omit<CustomListEntry, 'id' | 'addedAt'>) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
      addedAt: Date.now()
    };
    
    setCustomList(prev => [newEntry, ...prev]);
  };
  
  // Remove custom entry from list
  const removeCustomEntry = (id: string) => {
    setCustomList(prev => prev.filter(entry => entry.id !== id));
  };
  
  // Clear all blocked calls history
  const clearBlockedCalls = () => {
    setBlockedCalls([]);
    toast({
      title: "History Cleared",
      description: "All blocked call records have been deleted",
      variant: "default"
    });
  };
  
  // Simulate an incoming call
  const simulateIncomingCall = (type: BlockedCall['callType']) => {
    // Create a new call based on the type
    const newCall: Omit<BlockedCall, 'id'> = {
      timestamp: Date.now(),
      callType: type,
      isVoIP: true
    };
    
    // Add specific properties based on the call type
    switch(type) {
      case 'anonymous':
        newCall.phoneNumber = 'Anonymous';
        break;
      case 'suspicious_ip':
        newCall.sourceIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        break;
      case 'no_valid_number':
        newCall.phoneNumber = `+${Math.floor(Math.random() * 10000000000)}`;
        break;
      case 'unknown_server':
        newCall.sourceIP = `203.0.113.${Math.floor(Math.random() * 255)}`;
        break;
      case 'user_blocked':
        newCall.phoneNumber = `+${Math.floor(Math.random() * 10000000000)}`;
        newCall.sourceIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        break;
    }
    
    addBlockedCall(newCall);
  };

  return {
    blockedCalls,
    stats,
    settings,
    customList,
    isActive,
    addBlockedCall,
    toggleActive,
    updateSettings,
    addCustomEntry,
    removeCustomEntry,
    clearBlockedCalls,
    simulateIncomingCall
  };
}
