import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncService } from './syncService';
import { BlockSettings, BlockedCall, CustomListEntry } from '@/types';

// Mock do cliente Supabase
vi.mock('./client', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(() => Promise.resolve({ error: null })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
      delete: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => Promise.resolve({ error: null })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: mockBlockSettings, error: null }))
            }))
          }))
        })),
        eq: vi.fn(() => Promise.resolve({ data: mockCustomList, error: null }))
      }))
    }))
  }
}));

// Dados de teste
const mockUser = { id: 'user-123', email: 'test@example.com' };

const mockBlockSettings: any = {
  block_all: false,
  block_anonymous: true,
  block_unknown_servers: true,
  block_no_valid_number: true,
  block_suspicious_ip: true
};

const mockCustomList: any[] = [
  {
    id: '1',
    value: '+5511999999999',
    type: 'phone',
    is_blocked: true,
    added_at: Date.now(),
    notes: 'Test number'
  }
];

describe('SyncService', () => {
  let syncService: SyncService;

  beforeEach(() => {
    syncService = new SyncService();
    syncService.setUser(mockUser);
  });

  it('deve definir e obter o usuário corretamente', () => {
    expect(syncService.getUser()).toEqual(mockUser);
    expect(syncService.isAuthenticated()).toBe(true);
    
    syncService.setUser(null);
    expect(syncService.getUser()).toBeNull();
    expect(syncService.isAuthenticated()).toBe(false);
  });

  it('deve sincronizar configurações de bloqueio', async () => {
    const settings: BlockSettings = {
      blockAll: false,
      blockAnonymous: true,
      blockNoValidNumber: true,
      blockSuspiciousIP: true,
      blockUnknownServers: true
    };

    const result = await syncService.syncBlockSettings(settings);
    expect(result).toBe(true);
  });

  it('deve sincronizar lista personalizada', async () => {
    const customList: CustomListEntry[] = [
      {
        id: '1',
        value: '+5511999999999',
        type: 'phone',
        isBlocked: true,
        addedAt: Date.now(),
        notes: 'Test number'
      }
    ];

    const result = await syncService.syncCustomList(customList);
    expect(result).toBe(true);
  });

  it('deve sincronizar chamadas bloqueadas', async () => {
    const blockedCalls: BlockedCall[] = [
      {
        id: '1',
        phoneNumber: '+5511999999999',
        timestamp: Date.now(),
        callType: 'user_blocked',
        isVoIP: false
      }
    ];

    const result = await syncService.syncBlockedCalls(blockedCalls);
    expect(result).toBe(true);
  });

  it('deve retornar false quando não há usuário autenticado', async () => {
    syncService.setUser(null);
    
    const settings: BlockSettings = {
      blockAll: false,
      blockAnonymous: true,
      blockNoValidNumber: true,
      blockSuspiciousIP: true,
      blockUnknownServers: true
    };

    const result = await syncService.syncBlockSettings(settings);
    expect(result).toBe(false);
  });
});