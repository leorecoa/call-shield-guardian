import { useState, useEffect, useMemo } from 'react';

export function useMobile() {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => setWidth(window.innerWidth);
    
    // Throttle resize events for better performance
    let timeoutId: ReturnType<typeof setTimeout>;
    const throttledResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', throttledResize);
    return () => window.removeEventListener('resize', throttledResize);
  }, []);
  
  return useMemo(() => ({
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width
  }), [width]);
}