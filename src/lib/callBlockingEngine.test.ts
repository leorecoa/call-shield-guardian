import { describe, it, expect } from 'vitest';
import { CallBlockingEngine } from './callBlockingEngine';
import { BlockSettings, CustomListEntry } from '@/types';

describe('CallBlockingEngine', () => {
  // Configurações padrão para testes
  const defaultSettings: BlockSettings = {
    blockAll: false,
    blockAnonymous: true,
    blockNoValidNumber: true,
    blockSuspiciousIP: true,
    blockUnknownServers: true
  };

  // Lista personalizada para testes
  const customList: CustomListEntry[] = [
    {
      id: '1',
      value: '+5511999999999',
      type: 'phone',
      isBlocked: true,
      addedAt: Date.now(),
      notes: 'Número de teste bloqueado'
    },
    {
      id: '2',
      value: '+5511888888888',
      type: 'phone',
      isBlocked: false,
      addedAt: Date.now(),
      notes: 'Número de teste permitido'
    },
    {
      id: '3',
      value: '192.168.1.100',
      type: 'ip',
      isBlocked: true,
      addedAt: Date.now()
    }
  ];

  it('deve bloquear chamadas quando blockAll está ativado', () => {
    const settings: BlockSettings = {
      ...defaultSettings,
      blockAll: true
    };

    const result = CallBlockingEngine.shouldBlockCall(
      '+5511777777777',
      '192.168.1.1',
      false,
      settings,
      customList
    );

    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('user_blocked');
  });

  it('deve bloquear chamadas anônimas quando blockAnonymous está ativado', () => {
    const result = CallBlockingEngine.shouldBlockCall(
      undefined,
      undefined,
      false,
      defaultSettings,
      customList
    );

    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('anonymous');
  });

  it('deve bloquear números na lista de bloqueio personalizada', () => {
    const result = CallBlockingEngine.shouldBlockCall(
      '+5511999999999',
      undefined,
      false,
      defaultSettings,
      customList
    );

    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('user_blocked');
  });

  it('deve permitir números na lista de permissão personalizada', () => {
    const result = CallBlockingEngine.shouldBlockCall(
      '+5511888888888',
      undefined,
      false,
      defaultSettings,
      customList
    );

    expect(result.blocked).toBe(false);
    expect(result.reason).toBe(null);
  });

  it('deve bloquear IPs na lista de bloqueio personalizada', () => {
    const result = CallBlockingEngine.shouldBlockCall(
      undefined,
      '192.168.1.100',
      true,
      defaultSettings,
      customList
    );

    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('suspicious_ip');
  });

  it('não deve bloquear chamadas quando as configurações estão desativadas', () => {
    const settings: BlockSettings = {
      blockAll: false,
      blockAnonymous: false,
      blockNoValidNumber: false,
      blockSuspiciousIP: false,
      blockUnknownServers: false
    };

    const result = CallBlockingEngine.shouldBlockCall(
      '+5511777777777',
      '192.168.1.1',
      true,
      settings,
      customList
    );

    expect(result.blocked).toBe(false);
    expect(result.reason).toBe(null);
  });
});