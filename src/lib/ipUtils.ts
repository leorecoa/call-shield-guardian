/**
 * Utilitários para validação e análise de endereços IP
 */
export class IPUtils {
  // Cache para resultados de validação
  private static validationCache: Map<string, boolean> = new Map();
  private static suspiciousCache: Map<string, boolean> = new Map();
  
  // Lista de IPs suspeitos (em produção seria carregada de uma API ou banco de dados)
  private static suspiciousRanges: string[] = [
    '192.168.0.',
    '203.0.113.',
    '198.51.100.'
  ];
  
  // Lista de servidores conhecidos (em produção seria carregada de uma API ou banco de dados)
  private static knownServers: string[] = [
    '8.8.8.8',    // Google DNS
    '1.1.1.1',    // Cloudflare DNS
    '208.67.222.222', // OpenDNS
    '9.9.9.9'     // Quad9 DNS
  ];
  
  /**
   * Valida um endereço IP
   * Usa cache para melhorar performance em validações repetidas
   */
  static isValidIP(ip: string): boolean {
    // Verificar cache
    if (this.validationCache.has(ip)) {
      return this.validationCache.get(ip)!;
    }
    
    // Validação de IPv4
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const isValid = ipv4Regex.test(ip);
    
    // Armazenar no cache
    this.validationCache.set(ip, isValid);
    
    return isValid;
  }
  
  /**
   * Verifica se um IP é suspeito
   * Usa cache para melhorar performance em verificações repetidas
   */
  static isSuspiciousIP(ip: string): boolean {
    // Verificar cache
    if (this.suspiciousCache.has(ip)) {
      return this.suspiciousCache.get(ip)!;
    }
    
    // Verificar se o IP está em algum range suspeito
    const isSuspicious = this.suspiciousRanges.some(range => ip.startsWith(range));
    
    // Armazenar no cache
    this.suspiciousCache.set(ip, isSuspicious);
    
    return isSuspicious;
  }
  
  /**
   * Verifica se um IP pertence a um servidor conhecido
   */
  static isKnownServer(ip: string): boolean {
    return this.knownServers.includes(ip);
  }
  
  /**
   * Verifica se um IP pertence a um servidor desconhecido
   */
  static isUnknownServer(ip?: string): boolean {
    if (!ip) return true;
    return !this.isKnownServer(ip);
  }
  
  /**
   * Adiciona um IP à lista de servidores conhecidos
   */
  static addKnownServer(ip: string): void {
    if (!this.knownServers.includes(ip)) {
      this.knownServers.push(ip);
    }
  }
  
  /**
   * Adiciona um range de IP à lista de IPs suspeitos
   */
  static addSuspiciousRange(ipRange: string): void {
    if (!this.suspiciousRanges.includes(ipRange)) {
      this.suspiciousRanges.push(ipRange);
      // Limpar cache para refletir a mudança
      this.suspiciousCache.clear();
    }
  }
  
  /**
   * Limpa o cache de validação e verificação
   */
  static clearCache(): void {
    this.validationCache.clear();
    this.suspiciousCache.clear();
  }
}