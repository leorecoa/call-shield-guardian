import { BlockedCall, BlockSettings, CustomListEntry } from '@/types';

// Interface para o armazenamento offline
export interface OfflineData {
  blockedCalls: BlockedCall[];
  settings: BlockSettings;
  customList: CustomListEntry[];
  pendingSync: {
    calls: BlockedCall[];
    timestamp: number;
  };
  lastSyncTimestamp: number;
}

// Classe para gerenciar o armazenamento offline
export class OfflineStorage {
  private static instance: OfflineStorage;
  private storageKey = 'callshield_offline_data';
  
  private defaultData: OfflineData = {
    blockedCalls: [],
    settings: {
      blockAll: false,
      blockAnonymous: true,
      blockNoValidNumber: true,
      blockSuspiciousIP: true,
      blockUnknownServers: true
    },
    customList: [],
    pendingSync: {
      calls: [],
      timestamp: 0
    },
    lastSyncTimestamp: 0
  };

  private constructor() {
    // Inicializar o armazenamento se necessário
    this.initializeStorage();
  }

  // Obter a instância singleton
  public static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage();
    }
    return OfflineStorage.instance;
  }

  // Inicializar o armazenamento
  private initializeStorage(): void {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (!storedData) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.defaultData));
      }
    } catch (error) {
      console.error('Erro ao inicializar armazenamento offline:', error);
    }
  }

  // Obter todos os dados offline
  public getData(): OfflineData {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Erro ao obter dados offline:', error);
    }
    return { ...this.defaultData };
  }

  // Salvar todos os dados offline
  public saveData(data: OfflineData): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados offline:', error);
    }
  }

  // Adicionar uma chamada bloqueada
  public addBlockedCall(call: BlockedCall): void {
    try {
      const data = this.getData();
      data.blockedCalls = [call, ...data.blockedCalls].slice(0, 1000); // Limitar a 1000 chamadas
      data.pendingSync.calls.push(call);
      data.pendingSync.timestamp = Date.now();
      this.saveData(data);
    } catch (error) {
      console.error('Erro ao adicionar chamada bloqueada offline:', error);
    }
  }

  // Atualizar configurações
  public updateSettings(settings: BlockSettings): void {
    try {
      const data = this.getData();
      data.settings = settings;
      this.saveData(data);
    } catch (error) {
      console.error('Erro ao atualizar configurações offline:', error);
    }
  }

  // Atualizar lista personalizada
  public updateCustomList(customList: CustomListEntry[]): void {
    try {
      const data = this.getData();
      data.customList = customList;
      this.saveData(data);
    } catch (error) {
      console.error('Erro ao atualizar lista personalizada offline:', error);
    }
  }

  // Marcar sincronização concluída
  public markSynced(): void {
    try {
      const data = this.getData();
      data.pendingSync.calls = [];
      data.lastSyncTimestamp = Date.now();
      this.saveData(data);
    } catch (error) {
      console.error('Erro ao marcar sincronização offline:', error);
    }
  }

  // Verificar se há dados pendentes para sincronização
  public hasPendingSync(): boolean {
    try {
      const data = this.getData();
      return data.pendingSync.calls.length > 0;
    } catch (error) {
      console.error('Erro ao verificar sincronização pendente:', error);
      return false;
    }
  }

  // Obter chamadas pendentes para sincronização
  public getPendingSyncCalls(): BlockedCall[] {
    try {
      const data = this.getData();
      return [...data.pendingSync.calls];
    } catch (error) {
      console.error('Erro ao obter chamadas pendentes:', error);
      return [];
    }
  }

  // Limpar todos os dados
  public clearData(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.defaultData));
    } catch (error) {
      console.error('Erro ao limpar dados offline:', error);
    }
  }
}