/**
 * Utilitários para validação e formatação de números de telefone
 */
export class PhoneUtils {
  // Cache para resultados de validação
  private static validationCache: Map<string, boolean> = new Map();
  private static formatCache: Map<string, string> = new Map();
  
  /**
   * Valida um número de telefone
   * Usa cache para melhorar performance em validações repetidas
   */
  static isValidPhoneNumber(phoneNumber: string): boolean {
    // Normalizar o número para comparação
    const normalized = phoneNumber.replace(/\s+/g, '');
    
    // Verificar cache
    if (this.validationCache.has(normalized)) {
      return this.validationCache.get(normalized)!;
    }
    
    // Validação básica - em produção seria mais robusta
    const isValid = /^\+?[0-9]{10,15}$/.test(normalized);
    
    // Armazenar no cache
    this.validationCache.set(normalized, isValid);
    
    return isValid;
  }
  
  /**
   * Formata um número de telefone para exibição
   * Usa cache para melhorar performance em formatações repetidas
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Normalizar o número para comparação
    const normalized = phoneNumber.replace(/\s+/g, '');
    
    // Verificar cache
    if (this.formatCache.has(normalized)) {
      return this.formatCache.get(normalized)!;
    }
    
    // Formatação básica - em produção seria mais robusta
    let formatted = normalized;
    
    // Exemplo de formatação para números brasileiros
    if (normalized.startsWith('+55') && normalized.length >= 12) {
      // +55 11 98765-4321
      formatted = `${normalized.slice(0, 3)} ${normalized.slice(3, 5)} ${normalized.slice(5, 10)}-${normalized.slice(10)}`;
    } else if (normalized.startsWith('+') && normalized.length > 10) {
      // +1 234 567-8901
      formatted = `${normalized.slice(0, 2)} ${normalized.slice(2, 5)} ${normalized.slice(5, 8)}-${normalized.slice(8)}`;
    }
    
    // Armazenar no cache
    this.formatCache.set(normalized, formatted);
    
    return formatted;
  }
  
  /**
   * Limpa o cache de validação e formatação
   * Útil para testes ou quando o cache ficar muito grande
   */
  static clearCache(): void {
    this.validationCache.clear();
    this.formatCache.clear();
  }
}