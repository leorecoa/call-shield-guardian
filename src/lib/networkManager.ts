import { useState, useEffect, useCallback } from 'react';

// Interface para o estado da rede
export interface NetworkState {
  isOnline: boolean;
  lastChecked: number;
  connectionType: 'wifi' | 'cellular' | 'unknown' | 'none';
}

// Classe para gerenciar o estado da rede
export class NetworkManager {
  private static instance: NetworkManager;
  private listeners: ((state: NetworkState) => void)[] = [];
  private state: NetworkState = {
    isOnline: navigator.onLine,
    lastChecked: Date.now(),
    connectionType: 'unknown'
  };
  private checkInterval: number | null = null;

  private constructor() {
    // Inicializar listeners de eventos de rede
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    
    // Verificar o tipo de conexão se disponível
    this.updateConnectionType();
    
    // Iniciar verificações periódicas
    this.startPeriodicChecks();
  }

  // Obter a instância singleton
  public static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  // Adicionar um listener para mudanças de estado
  public addListener(callback: (state: NetworkState) => void): () => void {
    this.listeners.push(callback);
    // Retornar função para remover o listener
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Obter o estado atual da rede
  public getState(): NetworkState {
    return { ...this.state };
  }

  // Verificar manualmente o estado da rede
  public async checkConnection(): Promise<NetworkState> {
    const isOnline = navigator.onLine;
    
    // Se estiver offline, não precisamos fazer mais verificações
    if (!isOnline) {
      this.updateState({
        isOnline: false,
        lastChecked: Date.now(),
        connectionType: 'none'
      });
      return this.state;
    }
    
    // Tentar fazer uma requisição para verificar a conexão real
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      await fetch('https://www.gstatic.com/generate_204', {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors',
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      
      // Atualizar o tipo de conexão
      this.updateConnectionType();
      
      // Atualizar o estado
      this.updateState({
        isOnline: true,
        lastChecked: Date.now(),
        connectionType: this.state.connectionType
      });
    } catch (error) {
      // Se a requisição falhar, estamos offline ou com problemas de conexão
      this.updateState({
        isOnline: false,
        lastChecked: Date.now(),
        connectionType: 'none'
      });
    }
    
    return this.state;
  }

  // Iniciar verificações periódicas
  private startPeriodicChecks(): void {
    if (this.checkInterval === null) {
      this.checkInterval = window.setInterval(() => {
        this.checkConnection();
      }, 30000); // Verificar a cada 30 segundos
    }
  }

  // Parar verificações periódicas
  public stopPeriodicChecks(): void {
    if (this.checkInterval !== null) {
      window.clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Manipulador para evento online
  private handleOnline = (): void => {
    this.updateState({
      isOnline: true,
      lastChecked: Date.now(),
      connectionType: this.state.connectionType
    });
    this.updateConnectionType();
    this.checkConnection(); // Verificar se realmente está online
  };

  // Manipulador para evento offline
  private handleOffline = (): void => {
    this.updateState({
      isOnline: false,
      lastChecked: Date.now(),
      connectionType: 'none'
    });
  };

  // Atualizar o tipo de conexão
  private updateConnectionType(): void {
    if (navigator.connection) {
      const connection = navigator.connection as any;
      let type: 'wifi' | 'cellular' | 'unknown' | 'none' = 'unknown';
      
      if (connection.type === 'wifi' || connection.effectiveType === '4g') {
        type = 'wifi';
      } else if (connection.type === 'cellular' || 
                ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
        type = 'cellular';
      } else if (!navigator.onLine) {
        type = 'none';
      }
      
      this.state.connectionType = type;
    }
  }

  // Atualizar o estado e notificar os listeners
  private updateState(newState: NetworkState): void {
    this.state = { ...newState };
    this.notifyListeners();
  }

  // Notificar todos os listeners sobre a mudança de estado
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('Erro ao notificar listener:', error);
      }
    });
  }

  // Limpar recursos ao destruir
  public destroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.stopPeriodicChecks();
    this.listeners = [];
  }
}

// Hook para usar o gerenciador de rede em componentes React
export function useNetworkStatus() {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: navigator.onLine,
    lastChecked: Date.now(),
    connectionType: 'unknown'
  });
  
  useEffect(() => {
    const networkManager = NetworkManager.getInstance();
    
    // Definir o estado inicial
    setNetworkState(networkManager.getState());
    
    // Adicionar listener para atualizações
    const removeListener = networkManager.addListener(state => {
      setNetworkState(state);
    });
    
    // Verificar a conexão imediatamente
    networkManager.checkConnection();
    
    // Limpar ao desmontar
    return () => {
      removeListener();
    };
  }, []);
  
  // Função para verificar manualmente a conexão
  const checkConnection = useCallback(async () => {
    const networkManager = NetworkManager.getInstance();
    const state = await networkManager.checkConnection();
    return state;
  }, []);
  
  return {
    ...networkState,
    checkConnection
  };
}