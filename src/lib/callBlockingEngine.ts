import { BlockSettings, CustomListEntry } from '@/types';
import { phoneUtils } from './phoneUtils';
import { ipUtils } from './ipUtils';

export class CallBlockingEngine {
  /**
   * Verifica se uma chamada deve ser bloqueada com base nas configurações e listas personalizadas
   * @param phoneNumber Número de telefone da chamada
   * @param sourceIP IP de origem da chamada (para chamadas VoIP)
   * @param isVoIP Indica se é uma chamada VoIP
   * @param settings Configurações de bloqueio
   * @param customList Lista personalizada de bloqueio/permissão
   * @returns Objeto indicando se a chamada deve ser bloqueada e o motivo
   */
  public static shouldBlockCall(
    phoneNumber?: string,
    sourceIP?: string,
    isVoIP: boolean = false,
    settings: BlockSettings = {
      blockAll: false,
      blockAnonymous: true,
      blockNoValidNumber: true,
      blockSuspiciousIP: true,
      blockUnknownServers: true
    },
    customList: CustomListEntry[] = []
  ): { blocked: boolean; reason: 'anonymous' | 'unknown_server' | 'no_valid_number' | 'suspicious_ip' | 'user_blocked' | null } {
    // Verificar modo offline - sempre usar configurações locais
    
    // 1. Verificar se o bloqueio total está ativado
    if (settings.blockAll) {
      return { blocked: true, reason: 'user_blocked' };
    }
    
    // 2. Verificar lista personalizada (tem prioridade sobre as configurações gerais)
    // 2.1 Verificar número de telefone na lista personalizada
    if (phoneNumber) {
      const normalizedNumber = phoneUtils.normalizePhoneNumber(phoneNumber);
      
      // Verificar correspondência exata
      const exactMatch = customList.find(entry => 
        entry.type === 'phone' && 
        phoneUtils.normalizePhoneNumber(entry.value) === normalizedNumber
      );
      
      if (exactMatch) {
        return { 
          blocked: exactMatch.isBlocked, 
          reason: exactMatch.isBlocked ? 'user_blocked' : null 
        };
      }
      
      // Verificar correspondência de padrão
      const patternMatch = customList.find(entry => 
        entry.type === 'pattern' && 
        normalizedNumber.includes(entry.value)
      );
      
      if (patternMatch) {
        return { 
          blocked: patternMatch.isBlocked, 
          reason: patternMatch.isBlocked ? 'user_blocked' : null 
        };
      }
    }
    
    // 2.2 Verificar IP na lista personalizada (para chamadas VoIP)
    if (sourceIP && isVoIP) {
      const ipMatch = customList.find(entry => 
        entry.type === 'ip' && 
        entry.value === sourceIP
      );
      
      if (ipMatch) {
        return { 
          blocked: ipMatch.isBlocked, 
          reason: ipMatch.isBlocked ? 'suspicious_ip' : null 
        };
      }
    }
    
    // 3. Verificar configurações gerais
    // 3.1 Verificar chamadas anônimas
    if (!phoneNumber && settings.blockAnonymous) {
      return { blocked: true, reason: 'anonymous' };
    }
    
    // 3.2 Verificar números inválidos
    if (phoneNumber && settings.blockNoValidNumber && !phoneUtils.isValidPhoneNumber(phoneNumber)) {
      return { blocked: true, reason: 'no_valid_number' };
    }
    
    // 3.3 Verificar IPs suspeitos (para chamadas VoIP)
    if (sourceIP && isVoIP && settings.blockSuspiciousIP && ipUtils.isSuspiciousIP(sourceIP)) {
      return { blocked: true, reason: 'suspicious_ip' };
    }
    
    // 3.4 Verificar servidores desconhecidos (para chamadas VoIP)
    if (isVoIP && settings.blockUnknownServers && (!sourceIP || !ipUtils.isValidIP(sourceIP))) {
      return { blocked: true, reason: 'unknown_server' };
    }
    
    // 4. Verificar padrões de spam em números de telefone
    if (phoneNumber && phoneUtils.hasSpamPattern(phoneNumber)) {
      return { blocked: true, reason: 'user_blocked' };
    }
    
    // Se chegou até aqui, a chamada não deve ser bloqueada
    return { blocked: false, reason: null };
  }
  
  /**
   * Verifica se um número de telefone deve ser bloqueado
   * @param phoneNumber Número de telefone
   * @param settings Configurações de bloqueio
   * @param customList Lista personalizada
   * @returns Verdadeiro se o número deve ser bloqueado
   */
  public static shouldBlockPhoneNumber(
    phoneNumber: string,
    settings: BlockSettings,
    customList: CustomListEntry[]
  ): boolean {
    const result = this.shouldBlockCall(phoneNumber, undefined, false, settings, customList);
    return result.blocked;
  }
  
  /**
   * Verifica se um IP deve ser bloqueado
   * @param ip Endereço IP
   * @param settings Configurações de bloqueio
   * @param customList Lista personalizada
   * @returns Verdadeiro se o IP deve ser bloqueado
   */
  public static shouldBlockIP(
    ip: string,
    settings: BlockSettings,
    customList: CustomListEntry[]
  ): boolean {
    const result = this.shouldBlockCall(undefined, ip, true, settings, customList);
    return result.blocked;
  }
}