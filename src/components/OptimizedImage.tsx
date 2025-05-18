import { useState, useEffect, memo } from 'react';
import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}

function OptimizedImageComponent({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  onLoad
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (priority) return;
    
    // Pré-carregar a imagem
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setIsLoading(false);
      if (onLoad) onLoad();
    };
    
    img.onerror = () => {
      setIsLoading(false);
      setError(true);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, priority, onLoad]);

  if (error) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-darkNeon-700 rounded-md",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-xs text-muted-foreground">Falha ao carregar</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Skeleton 
        className={className}
        style={{ width, height }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "object-cover transition-opacity duration-300",
        className
      )}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}

export const OptimizedImage = memo(OptimizedImageComponent);