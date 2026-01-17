import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LoadingSpinner = ({ className, text = "Loading..." }) => {
  return (
    <div className={cn(
      "w-full h-full min-h-[50vh] flex flex-col items-center justify-center gap-4 bg-background/50 backdrop-blur-sm transition-all duration-300", 
      className
    )}>
      <div className="relative flex items-center justify-center">
        {/* Outer pulsating ring */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping duration-1000" />
        
        {/* Inner spinning ring background */}
        <div className="w-12 h-12 rounded-full border-4 border-slate-100" />
        
        {/* Active spinner */}
        <Loader2 className="absolute h-12 w-12 animate-spin text-blue-600" />
        
        {/* Center dot */}
        <div className="absolute w-2 h-2 bg-blue-600 rounded-full" />
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-slate-700 tracking-wide animate-pulse">
          {text}
        </p>
        <div className="flex gap-1 h-1">
          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;