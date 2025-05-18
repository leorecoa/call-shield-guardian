import { BlockedCall, BlockSettings, CustomListEntry } from "@/types";
import { PhoneUtils } from "./phoneUtils";
import { IPUtils } from "./ipUtils";

/**
 * Motor de bloqueio de chamadas - implementa a lógica central de decisão
 */
export class CallBlockingEngine {
  /**
   * Avalia se uma chamada deve ser bloqueada com base nas configurações e listas personalizadas
   */
  static shouldBlockCall(
    phoneNumber: string | undefined,
    sourceIP: string | undefined,
    isVoIP: boolean,
    settings: BlockSettings,
    customList: CustomListEntry[]
  ): { blocked: boolean; reason: BlockedCall["callType"] | null } {
    // Se o bloqueio total está ativado, bloquear tudo
    if (settings.blockAll) {
      return { blocked: true, reason: "user_blocked" };
    }

    // Verificar lista de permissão (whitelist)
    if (this.isInAllowList(phoneNumber, sourceIP, customList)) {
      return { blocked: false, reason: null };
    }

    // Verificar lista de bloqueio (blacklist)
    const blacklistReason = this.checkBlacklist(phoneNumber, sourceIP, customList);
    if (blacklistReason) {
      return { blocked: true, reason: "user_blocked" };
    }

    // Verificar chamadas anônimas
    if (settings.blockAnonymous && !phoneNumber) {
      return { blocked: true, reason: "anonymous" };
    }

    // Verificar números inválidos
    if (settings.blockNoValidNumber && phoneNumber && !PhoneUtils.isValidPhoneNumber(phoneNumber)) {
      return { blocked: true, reason: "no_valid_number" };
    }

    // Verificar IPs suspeitos
    if (settings.blockSuspiciousIP && sourceIP && IPUtils.isSuspiciousIP(sourceIP)) {
      return { blocked: true, reason: "suspicious_ip" };
    }

    // Verificar servidores desconhecidos
    if (settings.blockUnknownServers && isVoIP && IPUtils.isUnknownServer(sourceIP)) {
      return { blocked: true, reason: "unknown_server" };
    }

    // Nenhuma regra de bloqueio acionada
    return { blocked: false, reason: null };
  }

  /**
   * Verifica se um número ou IP está na lista de permissão
   */
  private static isInAllowList(
    phoneNumber: string | undefined,
    sourceIP: string | undefined,
    customList: CustomListEntry[]
  ): boolean {
    const allowList = customList.filter(entry => !entry.isBlocked);
    
    // Verificar número de telefone
    if (phoneNumber) {
      const phoneMatch = allowList.some(entry => {
        if (entry.type !== "phone" && entry.type !== "pattern") return false;
        
        if (entry.type === "phone") {
          return this.normalizePhone(entry.value) === this.normalizePhone(phoneNumber);
        } else {
          try {
            const regex = new RegExp(entry.value, "i");
            return regex.test(phoneNumber);
          } catch {
            return false;
          }
        }
      });
      
      if (phoneMatch) return true;
    }
    
    // Verificar IP
    if (sourceIP) {
      const ipMatch = allowList.some(entry => {
        if (entry.type !== "ip" && entry.type !== "pattern") return false;
        
        if (entry.type === "ip") {
          return entry.value === sourceIP;
        } else {
          try {
            const regex = new RegExp(entry.value, "i");
            return regex.test(sourceIP);
          } catch {
            return false;
          }
        }
      });
      
      if (ipMatch) return true;
    }
    
    return false;
  }

  /**
   * Verifica se um número ou IP está na lista de bloqueio
   */
  private static checkBlacklist(
    phoneNumber: string | undefined,
    sourceIP: string | undefined,
    customList: CustomListEntry[]
  ): boolean {
    const blockList = customList.filter(entry => entry.isBlocked);
    
    // Verificar número de telefone
    if (phoneNumber) {
      const phoneMatch = blockList.some(entry => {
        if (entry.type !== "phone" && entry.type !== "pattern") return false;
        
        if (entry.type === "phone") {
          return this.normalizePhone(entry.value) === this.normalizePhone(phoneNumber);
        } else {
          try {
            const regex = new RegExp(entry.value, "i");
            return regex.test(phoneNumber);
          } catch {
            return false;
          }
        }
      });
      
      if (phoneMatch) return true;
    }
    
    // Verificar IP
    if (sourceIP) {
      const ipMatch = blockList.some(entry => {
        if (entry.type !== "ip" && entry.type !== "pattern") return false;
        
        if (entry.type === "ip") {
          return entry.value === sourceIP;
        } else {
          try {
            const regex = new RegExp(entry.value, "i");
            return regex.test(sourceIP);
          } catch {
            return false;
          }
        }
      });
      
      if (ipMatch) return true;
    }
    
    return false;
  }

  /**
   * Normaliza um número de telefone para comparação
   */
  private static normalizePhone(phone: string): string {
    return phone.replace(/\D/g, "");
  }
}