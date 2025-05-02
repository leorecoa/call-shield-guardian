
import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface ShieldProps {
  active?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Shield({ active = true, size = "md", className }: ShieldProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
    xl: "h-32 w-32"
  };

  const glowSizes = {
    sm: "h-14 w-14",
    md: "h-20 w-20",
    lg: "h-32 w-32",
    xl: "h-40 w-40"
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
              "absolute bg-neonBlue/5 rounded-full",
              glowSizes[size],
              "animate-pulse"
            )} 
          />
          <span 
            className={cn(
              "absolute bg-neonBlue/10 rounded-full",
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
              "text-white",
              size === "sm" ? "h-4 w-4" : "",
              size === "md" ? "h-6 w-6" : "",
              size === "lg" ? "h-10 w-10" : "",
              size === "xl" ? "h-16 w-16" : "",
              "animate-pulse-shield"
            )}
          />
        ) : (
          <ShieldAlert
            className={cn(
              "text-white/80",
              size === "sm" ? "h-4 w-4" : "",
              size === "md" ? "h-6 w-6" : "",
              size === "lg" ? "h-10 w-10" : "",
              size === "xl" ? "h-16 w-16" : ""
            )}
          />
        )}
      </div>
    </div>
  );
}
