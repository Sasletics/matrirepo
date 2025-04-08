import { cn } from "@/lib/utils";

interface ProfileMatchPercentProps {
  percentage: number;
}

export function ProfileMatchPercent({ percentage }: ProfileMatchPercentProps) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold",
          percentage >= 80 ? "bg-green-500" : 
          percentage >= 60 ? "bg-emerald-500" : 
          percentage >= 40 ? "bg-amber-500" : 
          "bg-red-500"
        )}
      >
        {percentage}%
      </div>
      <div className="text-xs text-muted-foreground mt-1">Match</div>
    </div>
  );
}
