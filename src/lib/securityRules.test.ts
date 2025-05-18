import { describe, it, expect } from 'vitest';
import { SecurityRules } from './securityRules';

describe('SecurityRules', () => {
  it('deve retornar regras de emergência', () => {
    const emergencyRules = SecurityRules.getEmergencyAllowRules();
    
    expect(Array.isArray(emergencyRules)).toBe(true);
    expect(emergencyRules.length).toBeGreaterThan(0);
    
    // Verificar se as regras têm o formato correto
    emergencyRules.forEach(rule => {
      expect(rule).toHaveProperty('id');
      expect(rule).toHaveProperty('value');
      expect(rule).toHaveProperty('type');
      expect(rule).toHaveProperty('isBlocked');
      expect(rule).toHaveProperty('addedAt');
      
      // Regras de emergência devem ser permitidas (não bloqueadas)
      expect(rule.isBlocked).toBe(false);
      
      // IDs de regras de emergência devem começar com 'emerg-'
      expect(rule.id.startsWith('emerg-')).toBe(true);
    });
  });

  it('deve retornar regras de padrões de fraude', () => {
    const fraudRules = SecurityRules.getFraudPatternRules();
    
    expect(Array.isArray(fraudRules)).toBe(true);
    expect(fraudRules.length).toBeGreaterThan(0);
    
    // Verificar se as regras têm o formato correto
    fraudRules.forEach(rule => {
      expect(rule).toHaveProperty('id');
      expect(rule).toHaveProperty('value');
      expect(rule).toHaveProperty('type');
      expect(rule).toHaveProperty('isBlocked');
      expect(rule).toHaveProperty('addedAt');
      
      // Regras de fraude devem ser bloqueadas
      expect(rule.isBlocked).toBe(true);
      
      // IDs de regras de fraude devem começar com 'fraud-'
      expect(rule.id.startsWith('fraud-')).toBe(true);
    });
  });

  it('deve retornar regras de telemarketing', () => {
    const telemarketingRules = SecurityRules.getTelemarketingRules();
    
    expect(Array.isArray(telemarketingRules)).toBe(true);
    expect(telemarketingRules.length).toBeGreaterThan(0);
    
    // Verificar se as regras têm o formato correto
    telemarketingRules.forEach(rule => {
      expect(rule).toHaveProperty('id');
      expect(rule).toHaveProperty('value');
      expect(rule).toHaveProperty('type');
      expect(rule).toHaveProperty('isBlocked');
      expect(rule).toHaveProperty('addedAt');
      
      // Regras de telemarketing devem ser bloqueadas
      expect(rule.isBlocked).toBe(true);
      
      // IDs de regras de telemarketing devem começar com 'tm-'
      expect(rule.id.startsWith('tm-')).toBe(true);
    });
  });

  it('deve retornar todas as regras de segurança', () => {
    const allRules = SecurityRules.getAllSecurityRules();
    
    expect(Array.isArray(allRules)).toBe(true);
    
    // Deve conter pelo menos a soma das regras individuais
    const emergencyRules = SecurityRules.getEmergencyAllowRules();
    const fraudRules = SecurityRules.getFraudPatternRules();
    const telemarketingRules = SecurityRules.getTelemarketingRules();
    
    expect(allRules.length).toBeGreaterThanOrEqual(
      emergencyRules.length + fraudRules.length + telemarketingRules.length
    );
  });
});