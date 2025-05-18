import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCallBlocker } from './useCallBlocker';
import { BlockedCall, BlockSettings, CustomListEntry } from '@/types';

// Mock dos hooks dependentes
vi.mock('./useLocalStorage', () => ({
  useLocalStorage: () => ({
    blockedCalls: [],
    setBlockedCalls: vi.fn(),
    settings: {
      blockAll: false,
      blockAnonymous: true,
      blockNoValidNumber: true,
      blockSuspiciousIP: true,
      blockUnknownServers: true
    },
    setSettings: vi.fn(),
    customList: [],
    setCustomList: vi.fn(),
    isActive: true,
    setIsActive: vi.fn()
  })
}));

vi.mock('./useBridgeNative', () => ({
  useBridgeNative: () => ({
    nativeBridge: {
      enableCallBlocking: vi.fn(),
      updateBlockSettings: vi.fn(),
      updateCustomList: vi.fn()
    },
    hasPermissions: true,
    requestPermissions: vi.fn(() => Promise.resolve({ granted: true }))
  })
}));

vi.mock('./useNativeService', () => ({
  useNativeService: vi.fn()
}));

vi.mock('./useCallStats', () => ({
  useCallStats: () => ({
    totalBlocked: 0,
    todayBlocked: 0,
    byType: {
      anonymous: 0,
      unknown_server: 0,
      no_valid_number: 0,
      suspicious_ip: 0,
      user_blocked: 0
    }
  })
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('useCallBlocker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar os valores e funções esperados', () => {
    const { result } = renderHook(() => useCallBlocker());

    expect(result.current).toHaveProperty('blockedCalls');
    expect(result.current).toHaveProperty('stats');
    expect(result.current).toHaveProperty('settings');
    expect(result.current).toHaveProperty('customList');
    expect(result.current).toHaveProperty('isActive');
    expect(result.current).toHaveProperty('hasPermissions');
    expect(result.current).toHaveProperty('securityLevel');
    
    // Verificar se as funções estão definidas
    expect(typeof result.current.addBlockedCall).toBe('function');
    expect(typeof result.current.toggleActive).toBe('function');
    expect(typeof result.current.updateSettings).toBe('function');
    expect(typeof result.current.addCustomEntry).toBe('function');
    expect(typeof result.current.removeCustomEntry).toBe('function');
    expect(typeof result.current.clearBlockedCalls).toBe('function');
    expect(typeof result.current.simulateIncomingCall).toBe('function');
    expect(typeof result.current.shouldBlockCall).toBe('function');
    expect(typeof result.current.applySecurityRules).toBe('function');
  });

  it('deve determinar corretamente se uma chamada deve ser bloqueada', () => {
    const { result } = renderHook(() => useCallBlocker());

    // Chamada anônima deve ser bloqueada
    const anonymousCall = result.current.shouldBlockCall(undefined, undefined, false);
    expect(anonymousCall.blocked).toBe(true);
    expect(anonymousCall.reason).toBe('anonymous');

    // Chamada normal não deve ser bloqueada
    const normalCall = result.current.shouldBlockCall('+5511999999999', undefined, false);
    expect(normalCall.blocked).toBe(false);
    expect(normalCall.reason).toBe(null);
  });

  it('deve aplicar regras de segurança corretamente', () => {
    const { result } = renderHook(() => useCallBlocker());
    
    act(() => {
      result.current.applySecurityRules('high');
    });
    
    expect(result.current.securityLevel).toBe('high');
  });
});