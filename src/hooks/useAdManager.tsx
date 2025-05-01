
import { useState, useEffect } from 'react';

export interface Ad {
  id: string;
  title: string;
  description?: string;
  imageSrc?: string;
  linkUrl: string;
  linkText: string;
  priority: number;
  startDate?: number;
  endDate?: number;
}

// Sample ads for demo purposes
const sampleAds: Ad[] = [
  {
    id: 'ad1',
    title: 'Proteja sua privacidade online',
    description: 'VPN confiável com proteção avançada',
    imageSrc: '/lovable-uploads/fab841df-3f21-4b5f-99ad-6de9fc9f5586.png',
    linkUrl: 'https://example.com/vpn',
    linkText: 'Saiba Mais',
    priority: 1
  },
  {
    id: 'ad2',
    title: 'Segurança para dispositivos móveis',
    description: 'Antivírus premium para seu smartphone',
    linkUrl: 'https://example.com/security',
    linkText: 'Ver Ofertas',
    priority: 2
  },
  {
    id: 'ad3',
    title: 'Armazenamento em nuvem seguro',
    description: 'Proteja seus arquivos importantes',
    linkUrl: 'https://example.com/cloud',
    linkText: 'Experimente Grátis',
    priority: 3
  }
];

export function useAdManager() {
  const [availableAds, setAvailableAds] = useState<Ad[]>([]);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);

  useEffect(() => {
    // In a real implementation, you would fetch ads from a server
    // For now, we'll use sample ads
    setAvailableAds(sampleAds);
    
    // Select an initial ad randomly
    if (sampleAds.length > 0) {
      const randomIndex = Math.floor(Math.random() * sampleAds.length);
      setCurrentAd(sampleAds[randomIndex]);
    }
  }, []);

  // Get a specific ad by ID
  const getAdById = (id: string) => {
    return availableAds.find(ad => ad.id === id) || null;
  };

  // Get a random ad
  const getRandomAd = () => {
    if (availableAds.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableAds.length);
    return availableAds[randomIndex];
  };

  // Rotate to next ad
  const rotateAd = () => {
    if (availableAds.length === 0) return;
    
    const currentIndex = currentAd 
      ? availableAds.findIndex(ad => ad.id === currentAd.id) 
      : -1;
    
    const nextIndex = (currentIndex + 1) % availableAds.length;
    setCurrentAd(availableAds[nextIndex]);
  };

  // Track ad impression (in a real implementation, this would send data to analytics)
  const trackImpression = (adId: string) => {
    console.log(`Ad impression tracked: ${adId}`);
  };

  return {
    availableAds,
    currentAd,
    getAdById,
    getRandomAd,
    rotateAd,
    trackImpression
  };
}
