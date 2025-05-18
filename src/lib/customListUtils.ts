import { CustomListEntry } from "@/types";

/**
 * Classe para gerenciar entradas personalizadas com métodos otimizados
 */
export class CustomListManager {
  /**
   * Adiciona uma nova entrada à lista, mantendo a ordem por data de adição
   * Complexidade: O(1) - inserção no início é constante
   */
  static addEntry(list: CustomListEntry[], newEntry: CustomListEntry): CustomListEntry[] {
    return [newEntry, ...list];
  }
  
  /**
   * Remove uma entrada da lista por ID de forma otimizada
   * Complexidade: O(n) - uma única passagem pelo array
   */
  static removeEntry(list: CustomListEntry[], id: string): CustomListEntry[] {
    return list.filter(entry => entry.id !== id);
  }
  
  /**
   * Filtra entradas por tipo (bloqueadas ou permitidas)
   * Complexidade: O(n) - uma única passagem pelo array
   */
  static filterByBlockStatus(list: CustomListEntry[], isBlocked: boolean): CustomListEntry[] {
    return list.filter(entry => entry.isBlocked === isBlocked);
  }
  
  /**
   * Busca entradas por valor de forma otimizada
   * Complexidade: O(n) - uma única passagem pelo array
   */
  static searchEntries(list: CustomListEntry[], searchTerm: string): CustomListEntry[] {
    const term = searchTerm.toLowerCase();
    return list.filter(entry => 
      entry.value.toLowerCase().includes(term) || 
      (entry.notes && entry.notes.toLowerCase().includes(term))
    );
  }
  
  /**
   * Verifica se um número ou IP está na lista de bloqueio
   * Complexidade: O(n) no pior caso, mas otimizado para parar na primeira correspondência
   */
  static isBlocked(list: CustomListEntry[], value: string): boolean {
    // Normalizar o valor para comparação
    const normalizedValue = value.toLowerCase().trim();
    
    // Verificar entradas bloqueadas
    return list.some(entry => {
      if (!entry.isBlocked) return false;
      
      switch (entry.type) {
        case 'phone':
        case 'ip':
          return entry.value.toLowerCase() === normalizedValue;
        case 'pattern':
          try {
            const regex = new RegExp(entry.value, 'i');
            return regex.test(normalizedValue);
          } catch (e) {
            console.error('Padrão de regex inválido:', entry.value);
            return false;
          }
      }
    });
  }
  
  /**
   * Verifica se um número ou IP está na lista de permissão
   * Complexidade: O(n) no pior caso, mas otimizado para parar na primeira correspondência
   */
  static isAllowed(list: CustomListEntry[], value: string): boolean {
    // Normalizar o valor para comparação
    const normalizedValue = value.toLowerCase().trim();
    
    // Verificar entradas permitidas
    return list.some(entry => {
      if (entry.isBlocked) return false;
      
      switch (entry.type) {
        case 'phone':
        case 'ip':
          return entry.value.toLowerCase() === normalizedValue;
        case 'pattern':
          try {
            const regex = new RegExp(entry.value, 'i');
            return regex.test(normalizedValue);
          } catch (e) {
            console.error('Padrão de regex inválido:', entry.value);
            return false;
          }
      }
    });
  }
}