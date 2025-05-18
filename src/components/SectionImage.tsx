import { memo } from 'react';
import { ShieldCheck, BarChart2, Settings, PhoneOff, List, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

type SectionType = 'shield' | 'stats' | 'settings' | 'history' | 'custom' | 'security';

interface SectionImageProps {
  section: SectionType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const iconMap = {
  shield: ShieldCheck,
  stats: BarChart2,
  settings: Settings,
  history: PhoneOff,
  custom: List,
  security: Shield
};

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16'
};

const colorMap = {
  shield: 'text-neonBlue',
  stats: 'text-neonPurple',
  settings: 'text-neonGreen',
  history: 'text-neonPink',
  custom: 'text-neonYellow',
  security: 'text-neonBlue'
};

const bgColorMap = {
  shield: 'bg-neonBlue/10',
  stats: 'bg-neonPurple/10',
  settings: 'bg-neonGreen/10',
  history: 'bg-neonPink/10',
  custom: 'bg-neonYellow/10',
  security: 'bg-neonBlue/10'
};

function SectionImageComponent({ 
  section, 
  size = 'md', 
  className,
  animated = false
}: SectionImageProps) {
  const Icon = iconMap[section];
  
  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center',
        sizeMap[size],
        bgColorMap[section],
        animated && 'animate-pulse',
        className
      )}
    >
      <Icon 
        className={cn(
          colorMap[section],
          size === 'sm' ? 'h-4 w-4' : '',
          size === 'md' ? 'h-6 w-6' : '',
          size === 'lg' ? 'h-8 w-8' : ''
        )} 
      />
    </div>
  );
}

export const SectionImage = memo(SectionImageComponent);