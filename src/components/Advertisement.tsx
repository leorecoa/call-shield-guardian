
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Image as ImageIcon } from "lucide-react";

export interface AdvertisementProps {
  id: string;
  title: string;
  description?: string;
  imageSrc?: string;
  linkUrl: string;
  linkText: string;
  className?: string;
}

export function Advertisement({ 
  id,
  title, 
  description, 
  imageSrc, 
  linkUrl, 
  linkText,
  className
}: AdvertisementProps) {
  const handleAdClick = () => {
    // Track ad click analytics in a real implementation
    console.log(`Ad clicked: ${id}`);
    window.open(linkUrl, '_blank');
  };

  return (
    <Card className={`bg-darkNeon-700/40 border-neonBlue/20 overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {imageSrc ? (
            <div className="relative w-full h-24 overflow-hidden">
              <img 
                src={imageSrc} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-24 bg-darkNeon-600/50 flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-neonBlue/50" />
            </div>
          )}
          
          <div className="p-4">
            <h3 className="text-sm font-medium text-neonBlue mb-1">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mb-3">{description}</p>
            )}
            <Button 
              size="sm" 
              className="w-full bg-darkNeon-600/80 border border-neonBlue/30 text-neonBlue hover:bg-darkNeon-600 hover:border-neonBlue/50 text-xs"
              onClick={handleAdClick}
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              {linkText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
