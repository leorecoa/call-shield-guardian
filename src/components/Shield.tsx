
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
        </>
      )}
      <div className={cn(
        "flex items-center justify-center rounded-xl transform",
        sizeClasses[size],
        active 
          ? "bg-gradient-to-br from-neonBlue to-neonBlue/80" 
          : "bg-gradient-to-br from-gray-600 to-gray-700",
        "shadow-lg transition-all duration-300",
        active && "shadow-neonBlue/20"
      )}>
        {active ? (
          <ShieldCheck 
            className={cn(
              "text-white opacity-80",
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
      {active && (
        <div className="absolute -bottom-8 text-center text-sm font-medium text-neonBlue">
          <span className="animate-pulse">Camadas Protegidas</span>
        </div>
      )}
    </div>
  );
}
