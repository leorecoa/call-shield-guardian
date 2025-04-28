
import { cn } from "@/lib/utils";
import { ShieldOff } from "lucide-react";

interface ShieldProps {
  active?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Shield({ active = true, size = "md", className }: ShieldProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-9 w-9",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  const glowSizes = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32"
  };

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
    >
      <div
        className={cn(
          "relative rounded-lg transform -rotate-45",
          sizeClasses[size],
          active ? "bg-shield-500" : "bg-gray-300",
          "shadow-lg transition-colors duration-200"
        )}
      >
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          "transform rotate-45"
        )}>
          <ShieldOff 
            className={cn(
              "text-white",
              size === "sm" ? "h-4 w-4" : "",
              size === "md" ? "h-6 w-6" : "",
              size === "lg" ? "h-10 w-10" : "",
              size === "xl" ? "h-16 w-16" : "",
              active && "animate-pulse-shield"
            )}
          />
        </div>
      </div>
      {active && (
        <span 
          className={cn(
            "absolute bg-shield-500/10 rounded-full",
            glowSizes[size]
          )} 
        />
      )}
    </div>
  );
}
