
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

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

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-full",
        active ? "text-shield-500" : "text-gray-300",
        className
      )}
    >
      <ShieldCheck 
        className={cn(
          sizeClasses[size],
          active && "animate-pulse-shield"
        )} 
      />
      {active && (
        <span 
          className={cn(
            "absolute bg-shield-500/10 rounded-full",
            size === "sm" ? "h-12 w-12" : "",
            size === "md" ? "h-16 w-16" : "",
            size === "lg" ? "h-24 w-24" : "",
            size === "xl" ? "h-32 w-32" : ""
          )} 
        />
      )}
    </div>
  );
}
