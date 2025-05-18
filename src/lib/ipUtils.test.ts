import { describe, it, expect } from 'vitest';
import { ipUtils } from './ipUtils';

describe('ipUtils', () => {
  it('deve validar endereços IP corretamente', () => {
    // IPs válidos
    expect(ipUtils.isValidIP('192.168.1.1')).toBe(true);
    expect(ipUtils.isValidIP('10.0.0.1')).toBe(true);
    expect(ipUtils.isValidIP('172.16.0.1')).toBe(true);
    expect(ipUtils.isValidIP('8.8.8.8')).toBe(true);
    
    // IPs inválidos
    expect(ipUtils.isValidIP('256.168.1.1')).toBe(false); // valor fora do range
    expect(ipUtils.isValidIP('192.168.1')).toBe(false); // incompleto
    expect(ipUtils.isValidIP('192.168.1.1.5')).toBe(false); // muito longo
    expect(ipUtils.isValidIP('abc')).toBe(false);
    expect(ipUtils.isValidIP('')).toBe(false);
    expect(ipUtils.isValidIP(undefined)).toBe(false);
    expect(ipUtils.isValidIP(null)).toBe(false);
  });

  it('deve detectar IPs privados corretamente', () => {
    // IPs privados
    expect(ipUtils.isPrivateIP('192.168.1.1')).toBe(true);
    expect(ipUtils.isPrivateIP('10.0.0.1')).toBe(true);
    expect(ipUtils.isPrivateIP('172.16.0.1')).toBe(true);
    expect(ipUtils.isPrivateIP('127.0.0.1')).toBe(true); // localhost
    
    // IPs públicos
    expect(ipUtils.isPrivateIP('8.8.8.8')).toBe(false);
    expect(ipUtils.isPrivateIP('203.0.113.1')).toBe(false);
    expect(ipUtils.isPrivateIP('104.16.181.15')).toBe(false);
    
    // Valores inválidos
    expect(ipUtils.isPrivateIP('')).toBe(false);
    expect(ipUtils.isPrivateIP('abc')).toBe(false);
    expect(ipUtils.isPrivateIP(undefined)).toBe(false);
    expect(ipUtils.isPrivateIP(null)).toBe(false);
  });

  it('deve detectar IPs suspeitos corretamente', () => {
    // IPs suspeitos (depende da implementação)
    expect(ipUtils.isSuspiciousIP('203.0.113.1')).toBe(true); // Bloco de documentação
    expect(ipUtils.isSuspiciousIP('198.51.100.1')).toBe(true); // Bloco de teste
    
    // IPs normais
    expect(ipUtils.isSuspiciousIP('8.8.8.8')).toBe(false);
    expect(ipUtils.isSuspiciousIP('104.16.181.15')).toBe(false);
    
    // IPs privados não devem ser considerados suspeitos
    expect(ipUtils.isSuspiciousIP('192.168.1.1')).toBe(false);
    expect(ipUtils.isSuspiciousIP('10.0.0.1')).toBe(false);
    
    // Valores inválidos
    expect(ipUtils.isSuspiciousIP('')).toBe(false);
    expect(ipUtils.isSuspiciousIP('abc')).toBe(false);
    expect(ipUtils.isSuspiciousIP(undefined)).toBe(false);
    expect(ipUtils.isSuspiciousIP(null)).toBe(false);
  });
});