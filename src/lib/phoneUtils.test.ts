import { describe, it, expect } from 'vitest';
import { phoneUtils } from './phoneUtils';

describe('phoneUtils', () => {
  it('deve validar números de telefone corretamente', () => {
    // Números válidos
    expect(phoneUtils.isValidPhoneNumber('+5511999999999')).toBe(true);
    expect(phoneUtils.isValidPhoneNumber('+1234567890')).toBe(true);
    expect(phoneUtils.isValidPhoneNumber('11999999999')).toBe(true);
    
    // Números inválidos
    expect(phoneUtils.isValidPhoneNumber('')).toBe(false);
    expect(phoneUtils.isValidPhoneNumber('abc')).toBe(false);
    expect(phoneUtils.isValidPhoneNumber('123')).toBe(false); // muito curto
    expect(phoneUtils.isValidPhoneNumber(undefined)).toBe(false);
    expect(phoneUtils.isValidPhoneNumber(null)).toBe(false);
  });

  it('deve formatar números de telefone corretamente', () => {
    expect(phoneUtils.formatPhoneNumber('+5511999999999')).toBe('+55 (11) 99999-9999');
    expect(phoneUtils.formatPhoneNumber('11999999999')).toBe('(11) 99999-9999');
    expect(phoneUtils.formatPhoneNumber('999999999')).toBe('999999999'); // formato desconhecido
    expect(phoneUtils.formatPhoneNumber('')).toBe('');
    expect(phoneUtils.formatPhoneNumber(undefined)).toBe('');
    expect(phoneUtils.formatPhoneNumber(null)).toBe('');
  });

  it('deve normalizar números de telefone corretamente', () => {
    expect(phoneUtils.normalizePhoneNumber('+55 (11) 99999-9999')).toBe('+5511999999999');
    expect(phoneUtils.normalizePhoneNumber('(11) 99999-9999')).toBe('11999999999');
    expect(phoneUtils.normalizePhoneNumber('11.99999.9999')).toBe('11999999999');
    expect(phoneUtils.normalizePhoneNumber('11 99999 9999')).toBe('11999999999');
    expect(phoneUtils.normalizePhoneNumber('')).toBe('');
    expect(phoneUtils.normalizePhoneNumber(undefined)).toBe('');
    expect(phoneUtils.normalizePhoneNumber(null)).toBe('');
  });

  it('deve detectar padrões de spam corretamente', () => {
    // Números com padrões de spam
    expect(phoneUtils.hasSpamPattern('0300123456')).toBe(true);
    expect(phoneUtils.hasSpamPattern('08001234567')).toBe(true);
    expect(phoneUtils.hasSpamPattern('4000123456')).toBe(true);
    
    // Números normais
    expect(phoneUtils.hasSpamPattern('+5511999999999')).toBe(false);
    expect(phoneUtils.hasSpamPattern('11999999999')).toBe(false);
    expect(phoneUtils.hasSpamPattern('')).toBe(false);
    expect(phoneUtils.hasSpamPattern(undefined)).toBe(false);
    expect(phoneUtils.hasSpamPattern(null)).toBe(false);
  });
});