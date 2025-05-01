
import React, { useEffect } from 'react';
import { Advertisement } from './Advertisement';
import { useAdManager } from '@/hooks/useAdManager';
import { Card } from './ui/card';

interface AdBannerProps {
  position?: 'top' | 'bottom' | 'sidebar';
  className?: string;
  autoRotate?: boolean;
  rotateInterval?: number; // in milliseconds
}

export function AdBanner({ 
  position = 'sidebar', 
  className = '', 
  autoRotate = true,
  rotateInterval = 30000 // 30 seconds by default
}: AdBannerProps) {
  const { currentAd, rotateAd, trackImpression } = useAdManager();
  
  useEffect(() => {
    if (!currentAd) return;
    
    // Track impression when ad is shown
    trackImpression(currentAd.id);
    
    // Set up auto-rotation if enabled
    let rotationTimer: number | undefined;
    
    if (autoRotate) {
      rotationTimer = window.setInterval(() => {
        rotateAd();
      }, rotateInterval);
    }
    
    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [currentAd, autoRotate, rotateInterval, rotateAd, trackImpression]);
  
  if (!currentAd) {
    return null;
  }
  
  const positionClasses = {
    top: 'w-full mb-4',
    bottom: 'w-full mt-4',
    sidebar: 'w-full'
  };
  
  return (
    <div className={`ad-banner ${positionClasses[position]} ${className}`}>
      <Advertisement
        id={currentAd.id}
        title={currentAd.title}
        description={currentAd.description}
        imageSrc={currentAd.imageSrc}
        linkUrl={currentAd.linkUrl}
        linkText={currentAd.linkText}
      />
    </div>
  );
}
