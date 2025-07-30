import { Calendar } from "lucide-react";

export function Logo({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center`}>
        <Calendar className="h-5 w-5 text-white" />
      </div>
      <span className={`font-bold text-gray-900 dark:text-white ${textSizeClasses[size]}`}>
        Event Hub
      </span>
    </div>
  );
}