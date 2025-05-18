import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores, útil para inputs de pesquisa e outras entradas do usuário
 * @param value - Valor a ser debounced
 * @param delay - Tempo de espera em milissegundos
 * @returns Valor após o delay
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}