import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar operações assíncronas com estado de carregamento e erro
 * @param asyncFunction - Função assíncrona a ser executada
 * @returns Um objeto com estado de carregamento, erro, dados e função de execução
 */
export function useAsync<T, P extends any[]>(
  asyncFunction: (...args: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  
  // Usar ref para evitar problemas com stale closures
  const mountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  const execute = useCallback(
    async (...args: P) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await asyncFunction(...args);
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
        }
        return result;
      } catch (e) {
        if (mountedRef.current) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setLoading(false);
        }
        throw e;
      }
    },
    [asyncFunction]
  );
  
  return { loading, error, data, execute };
}