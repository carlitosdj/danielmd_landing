/**
 * Serviço de reconexão automática para chamadas de API
 * Tenta reconectar a cada 15 segundos quando há erro de conexão
 */

class ApiReconnectService {
  private reconnectInterval = 15000; // 15 segundos
  private reconnectTimers: Map<string, NodeJS.Timeout> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();

  /**
   * Executa uma função com reconexão automática
   */
  async executeWithReconnect<T>(
    key: string,
    apiCall: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void,
    maxAttempts: number = Infinity
  ): Promise<T | null> {
    // Validação de parâmetros
    if (!key || typeof key !== 'string') {
      console.error('❌ Chave inválida para reconexão:', key);
      return null;
    }
    
    if (!apiCall || typeof apiCall !== 'function') {
      console.error('❌ Função de API inválida para reconexão');
      return null;
    }
    
    try {
      const result = await apiCall();
      
      // Sucesso - limpar tentativas de reconexão
      this.clearReconnect(key);
      onSuccess?.(result);
      
      return result;
    } catch (error: any) {
      console.error(`❌ Erro na API (${key}):`, error);
      
      const attempts = this.reconnectAttempts.get(key) || 0;
      
      // Verificar se é erro de conectividade
      if (this.isConnectionError(error) && attempts < maxAttempts) {
        this.scheduleReconnect(key, apiCall, onSuccess, onError, maxAttempts);
      }
      
      onError?.(error);
      return null;
    }
  }

  /**
   * Agenda uma nova tentativa de reconexão
   */
  private scheduleReconnect<T>(
    key: string,
    apiCall: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void,
    maxAttempts: number = Infinity
  ): void {
    if (!key || typeof key !== 'string') {
      console.error('❌ Tentativa de agendar reconexão com chave inválida:', key);
      return;
    }
    
    if (!apiCall || typeof apiCall !== 'function') {
      console.error('❌ Tentativa de agendar reconexão com função inválida');
      return;
    }
    
    this.clearReconnect(key);
    
    const attempts = (this.reconnectAttempts.get(key) || 0) + 1;
    this.reconnectAttempts.set(key, attempts);
    
    console.log(`⏰ Agendando reconexão da API (${key}) em 15s (tentativa ${attempts})`);
    
    const timer = setTimeout(async () => {
      console.log(`🔄 Tentando reconectar API (${key}) - tentativa ${attempts}`);
      
      await this.executeWithReconnect(key, apiCall, onSuccess, onError, maxAttempts);
    }, this.reconnectInterval);
    
    this.reconnectTimers.set(key, timer);
  }

  /**
   * Limpa tentativas de reconexão para uma chave específica
   */
  private clearReconnect(key: string): void {
    if (!key || typeof key !== 'string') {
      console.warn('⚠️ Tentativa de limpar reconexão com chave inválida:', key);
      return;
    }
    
    const timer = this.reconnectTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(key);
    }
    this.reconnectAttempts.delete(key);
  }

  /**
   * Limpa todas as tentativas de reconexão
   */
  clearAllReconnects(): void {
    this.reconnectTimers.forEach(timer => clearTimeout(timer));
    this.reconnectTimers.clear();
    this.reconnectAttempts.clear();
  }

  /**
   * Verifica se o erro é relacionado à conectividade
   */
  private isConnectionError(error: any): boolean {
    if (!error) return false;

    // Erro de rede (fetch/axios)
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      return true;
    }

    // Timeout
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return true;
    }

    // Connection refused
    if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
      return true;
    }

    // Status codes de servidor indisponível
    if (error.response?.status >= 500) {
      return true;
    }

    // Fetch - TypeError para problemas de rede
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true;
    }

    return false;
  }

  /**
   * Obtém o número de tentativas para uma chave
   */
  getAttempts(key: string): number {
    if (!key || typeof key !== 'string') {
      console.warn('⚠️ Tentativa de obter tentativas com chave inválida:', key);
      return 0;
    }
    return this.reconnectAttempts.get(key) || 0;
  }

  /**
   * Verifica se está tentando reconectar para uma chave
   */
  isReconnecting(key: string): boolean {
    if (!key || typeof key !== 'string') {
      console.warn('⚠️ Tentativa de verificar reconexão com chave inválida:', key);
      return false;
    }
    return this.reconnectTimers.has(key);
  }
}

// Singleton instance
export const apiReconnectService = new ApiReconnectService();

// Verificação de inicialização
console.log('🔧 ApiReconnectService inicializado:', {
  hasReconnectTimers: !!apiReconnectService['reconnectTimers'],
  hasReconnectAttempts: !!apiReconnectService['reconnectAttempts'],
  reconnectInterval: apiReconnectService['reconnectInterval']
});