import { useCallback, useEffect, useState } from 'react';
import { apiReconnectService } from '../services/api-reconnect.service';

interface UseApiReconnectOptions {
  key: string;
  maxAttempts?: number;
  autoStart?: boolean;
}

interface UseApiReconnectReturn<T> {
  data: T | null;
  loading: boolean;
  error: any;
  attempts: number;
  isReconnecting: boolean;
  execute: () => Promise<void>;
  clearReconnect: () => void;
}

/**
 * Hook para execução de API com reconexão automática
 */
export function useApiReconnect<T>(
  apiCall: () => Promise<T>,
  options: UseApiReconnectOptions
): UseApiReconnectReturn<T> {
  const { key, maxAttempts = Infinity, autoStart = false } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Função para executar a chamada da API
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await apiReconnectService.executeWithReconnect(
      key,
      apiCall,
      (successData) => {
        setData(successData);
        setError(null);
        setIsReconnecting(false);
        console.log(`✅ API reconectada com sucesso (${key})`);
      },
      (errorData) => {
        setError(errorData);
        setIsReconnecting(apiReconnectService.isReconnecting(key));
      },
      maxAttempts
    );
    
    setLoading(false);
    setAttempts(apiReconnectService.getAttempts(key));
    
    return result;
  }, [key, apiCall, maxAttempts]);

  // Função para limpar tentativas de reconexão
  const clearReconnect = useCallback(() => {
    apiReconnectService.clearAllReconnects();
    setIsReconnecting(false);
    setAttempts(0);
  }, []);

  // Atualizar estado a cada segundo para mostrar tentativas atuais
  useEffect(() => {
    const interval = setInterval(() => {
      const currentAttempts = apiReconnectService.getAttempts(key);
      const currentReconnecting = apiReconnectService.isReconnecting(key);
      
      setAttempts(currentAttempts);
      setIsReconnecting(currentReconnecting);
    }, 1000);

    return () => clearInterval(interval);
  }, [key]);

  // Auto-executar se solicitado
  useEffect(() => {
    if (autoStart) {
      execute();
    }
  }, [autoStart, execute]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      clearReconnect();
    };
  }, [clearReconnect]);

  return {
    data,
    loading,
    error,
    attempts,
    isReconnecting,
    execute,
    clearReconnect,
  };
}

/**
 * Hook para monitorar reconexões globais
 */
export function useApiReconnectStatus() {
  const [globalAttempts, setGlobalAttempts] = useState(0);
  const [globalReconnecting, setGlobalReconnecting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Aqui você pode implementar uma lógica para obter status global
      // Por simplicidade, vamos apenas verificar se há tentativas
      const hasReconnecting = false; // apiReconnectService.hasAnyReconnecting();
      setGlobalReconnecting(hasReconnecting);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    globalAttempts,
    globalReconnecting,
  };
}