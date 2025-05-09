
import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface ShieldProps {
  active?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Shield({ active = true, size = "md", className }: ShieldProps) {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-36 w-36 sm:h-40 sm:w-40"
  };

  const glowSizes = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-36 w-36",
    xl: "h-44 w-44 sm:h-48 sm:w-48"
  };

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
    >
      {active && (
        <>
          <span 
            className={cn(
              "absolute bg-neonBlue/10 rounded-full",
              glowSizes[size],
              "animate-pulse"
            )} 
          />
          <span 
            className={cn(
              "absolute bg-neonBlue/20 rounded-full",
              "w-3/4 h-3/4",
              "animate-pulse [animation-delay:300ms]"
            )} 
          />
          {/* Enhanced visual elements */}
          <span 
            className={cn(
              "absolute bg-neonGreen/5 rounded-full blur-md",
              "w-2/3 h-2/3",
              "animate-spin-slow [animation-duration:8s]"
            )} 
          />
          <span 
            className={cn(
              "absolute border-2 border-neonBlue/30 rounded-full",
              "w-4/5 h-4/5",
              "animate-pulse [animation-delay:600ms]"
            )} 
          />
        </>
      )}
      <div className={cn(
        "flex items-center justify-center rounded-xl transform",
        sizeClasses[size],
        active 
          ? "bg-gradient-to-br from-neonBlue to-neonBlue/80" 
          : "bg-gradient-to-br from-gray-600 to-gray-700",
        "shadow-lg transition-all duration-300",
        active && "shadow-neonBlue/20",
        active && "relative z-10 overflow-hidden"
      )}>
        {active && (
          <>
            {/* Enhanced inner glow effects */}
            <span className="absolute inset-0 bg-white/10 rounded-xl animate-pulse [animation-delay:200ms]" />
            <span className="absolute -inset-1 bg-neonBlue/20 blur-md animate-pulse [animation-delay:400ms]" />
            <span className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
          </>
        )}
        {active ? (
          <ShieldCheck 
            className={cn(
              "text-white opacity-90",
              size === "sm" ? "h-5 w-5" : "",
              size === "md" ? "h-8 w-8" : "",
              size === "lg" ? "h-12 w-12" : "",
              size === "xl" ? "h-20 w-20" : "",
              "animate-pulse-shield"
            )}
          />
        ) : (
          <ShieldAlert
            className={cn(
              "text-white/70",
              size === "sm" ? "h-5 w-5" : "",
              size === "md" ? "h-8 w-8" : "",
              size === "lg" ? "h-12 w-12" : "",
              size === "xl" ? "h-20 w-20" : ""
            )}
          />
        )}
      </div>
      {/* Removed "Camadas Protegidas" text */}
    </div>
  );
}
