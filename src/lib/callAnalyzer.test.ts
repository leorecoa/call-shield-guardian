import { describe, it, expect } from 'vitest';
import { CallAnalyzer } from './callAnalyzer';
import { BlockedCall } from '@/types';

describe('CallAnalyzer', () => {
  // Dados de teste para chamadas bloqueadas
  const createTestCalls = (): BlockedCall[] => {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    
    return [
      {
        id: '1',
        phoneNumber: '+5511999999999',
        timestamp: now - 1 * hour,
        callType: 'user_blocked',
        isVoIP: false
      },
      {
        id: '2',
        phoneNumber: '+5511999999999',
        timestamp: now - 2 * hour,
        callType: 'user_blocked',
        isVoIP: false
      },
      {
        id: '3',
        phoneNumber: '+5511999999999',
        timestamp: now - 3 * hour,
        callType: 'user_blocked',
        isVoIP: false
      },
      {
        id: '4',
        phoneNumber: '+5511888888888',
        timestamp: now - 4 * hour,
        callType: 'user_blocked',
        isVoIP: false
      },
      {
        id: '5',
        sourceIP: '192.168.1.100',
        timestamp: now - 5 * hour,
        callType: 'suspicious_ip',
        isVoIP: true
      },
      {
        id: '6',
        sourceIP: '192.168.1.100',
        timestamp: now - 6 * hour,
        callType: 'suspicious_ip',
        isVoIP: true
      }
    ];
  };

  it('deve identificar chamadores repetidos corretamente', () => {
    const calls = createTestCalls();
    const result = CallAnalyzer.identifyRepeatCallers(calls);

    expect(result.phoneNumbers).toHaveLength(2);
    expect(result.phoneNumbers[0].value).toBe('+5511999999999');
    expect(result.phoneNumbers[0].count).toBe(3);
    
    expect(result.ips).toHaveLength(1);
    expect(result.ips[0].value).toBe('192.168.1.100');
    expect(result.ips[0].count).toBe(2);
  });

  it('deve identificar potenciais ataques quando há chamadas repetidas', () => {
    // Criar chamadas repetidas em um curto período de tempo
    const now = Date.now();
    const minute = 60 * 1000;
    
    const calls: BlockedCall[] = [
      {
        id: '1',
        phoneNumber: '+5511999999999',
        timestamp: now - 1 * minute,
        callType: 'user_blocked',
        isVoIP: false
      },
      {
        id: '2',
        phoneNumber: '+5511999999999',
        timestamp: now - 2 * minute,
        callType: 'user_blocked',
        isVoIP: false
      },
      {
        id: '3',
        phoneNumber: '+5511999999999',
        timestamp: now - 3 * minute,
        callType: 'user_blocked',
        isVoIP: false
      },
      {
        id: '4',
        phoneNumber: '+5511999999999',
        timestamp: now - 4 * minute,
        callType: 'user_blocked',
        isVoIP: false
      },
      {
        id: '5',
        phoneNumber: '+5511999999999',
        timestamp: now - 5 * minute,
        callType: 'user_blocked',
        isVoIP: false
      }
    ];

    const attacks = CallAnalyzer.identifyPotentialAttacks(calls);
    
    expect(attacks.length).toBeGreaterThan(0);
    expect(attacks[0].type).toBe('targeted');
  });

  it('deve retornar array vazio quando não há ataques detectados', () => {
    // Chamadas esparsas que não constituem um ataque
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    
    const calls: BlockedCall[] = [
      {
        id: '1',
        phoneNumber: '+5511999999999',
        timestamp: now - 1 * day,
        callType: 'user_blocked',
        isVoIP: false
      },
      {
        id: '2',
        phoneNumber: '+5511888888888',
        timestamp: now - 2 * day,
        callType: 'user_blocked',
        isVoIP: false
      },
      {
        id: '3',
        phoneNumber: '+5511777777777',
        timestamp: now - 3 * day,
        callType: 'user_blocked',
        isVoIP: false
      }
    ];

    const attacks = CallAnalyzer.identifyPotentialAttacks(calls);
    
    expect(attacks).toHaveLength(0);
  });
});