import { CustomListEntry } from "@/types";

/**
 * Regras de segurança predefinidas para bloqueio de chamadas
 */
export class SecurityRules {
  /**
   * Gera regras de bloqueio para números de telemarketing conhecidos
   */
  static getTelemarketingRules(): CustomListEntry[] {
    const now = Date.now();
    return [
      {
        id: "tm-1",
        value: "^0800",
        type: "pattern",
        isBlocked: true,
        addedAt: now,
        notes: "Números 0800 (telemarketing)"
      },
      {
        id: "tm-2",
        value: "^4002",
        type: "pattern",
        isBlocked: true,
        addedAt: now,
        notes: "Números 4002 (telemarketing)"
      },
      {
        id: "tm-3",
        value: "^\\+55115[0-9]{3}",
        type: "pattern",
        isBlocked: true,
        addedAt: now,
        notes: "Padrão comum de telemarketing SP"
      }
    ];
  }
  
  /**
   * Gera regras de bloqueio para IPs suspeitos conhecidos
   */
  static getSuspiciousIPRules(): CustomListEntry[] {
    const now = Date.now();
    return [
      {
        id: "ip-1",
        value: "^192\\.168\\.0\\.",
        type: "pattern",
        isBlocked: true,
        addedAt: now,
        notes: "Range de IP local suspeito"
      },
      {
        id: "ip-2",
        value: "^203\\.0\\.113\\.",
        type: "pattern",
        isBlocked: true,
        addedAt: now,
        notes: "Range de IP de teste (RFC 5737)"
      },
      {
        id: "ip-3",
        value: "^198\\.51\\.100\\.",
        type: "pattern",
        isBlocked: true,
        addedAt: now,
        notes: "Range de IP de teste (RFC 5737)"
      }
    ];
  }
  
  /**
   * Gera regras de bloqueio para padrões de fraude conhecidos
   */
  static getFraudPatternRules(): CustomListEntry[] {
    const now = Date.now();
    return [
      {
        id: "fraud-1",
        value: "^\\+[0-9]{5,7}$",
        type: "pattern",
        isBlocked: true,
        addedAt: now,
        notes: "Números internacionais curtos (possível fraude)"
      },
      {
        id: "fraud-2",
        value: "^\\+234",
        type: "pattern",
        isBlocked: true,
        addedAt: now,
        notes: "Código de país da Nigéria (comum em fraudes)"
      },
      {
        id: "fraud-3",
        value: "^\\+1473",
        type: "pattern",
        isBlocked: true,
        addedAt: now,
        notes: "Código de Granada (comum em fraudes)"
      }
    ];
  }
  
  /**
   * Gera regras de permissão para números de emergência
   */
  static getEmergencyAllowRules(): CustomListEntry[] {
    const now = Date.now();
    return [
      {
        id: "emerg-1",
        value: "^190$",
        type: "pattern",
        isBlocked: false,
        addedAt: now,
        notes: "Polícia (Brasil)"
      },
      {
        id: "emerg-2",
        value: "^192$",
        type: "pattern",
        isBlocked: false,
        addedAt: now,
        notes: "SAMU (Brasil)"
      },
      {
        id: "emerg-3",
        value: "^193$",
        type: "pattern",
        isBlocked: false,
        addedAt: now,
        notes: "Bombeiros (Brasil)"
      },
      {
        id: "emerg-4",
        value: "^911$",
        type: "pattern",
        isBlocked: false,
        addedAt: now,
        notes: "Emergência (EUA)"
      }
    ];
  }
  
  /**
   * Combina todas as regras de segurança predefinidas
   */
  static getAllSecurityRules(): CustomListEntry[] {
    return [
      ...this.getTelemarketingRules(),
      ...this.getSuspiciousIPRules(),
      ...this.getFraudPatternRules(),
      ...this.getEmergencyAllowRules()
    ];
  }
}