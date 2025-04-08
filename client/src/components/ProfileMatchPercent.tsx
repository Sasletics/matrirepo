import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfileMatchPercentProps {
  percentage: number;
}

export function ProfileMatchPercent({ percentage }: ProfileMatchPercentProps) {
  // Get compatibility level based on percentage
  const getCompatibilityLevel = () => {
    if (percentage >= 80) return "Excellent Match";
    if (percentage >= 60) return "Good Match";
    if (percentage >= 40) return "Average Match";
    if (percentage >= 20) return "Below Average Match";
    return "Poor Match";
  };

  // Get compatibility description
  const getCompatibilityDescription = () => {
    if (percentage >= 80) {
      return "Exceptional compatibility in preferences and horoscope.";
    } else if (percentage >= 60) {
      return "Strong compatibility in most key areas.";
    } else if (percentage >= 40) {
      return "Moderate compatibility with some matching preferences.";
    } else if (percentage >= 20) {
      return "Limited compatibility with few matching preferences.";
    } else {
      return "Minimal compatibility based on your preferences.";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center cursor-help">
            <div 
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-all hover:scale-105",
                percentage >= 80 ? "bg-green-500" : 
                percentage >= 60 ? "bg-emerald-500" : 
                percentage >= 40 ? "bg-amber-500" : 
                percentage >= 20 ? "bg-orange-500" :
                "bg-red-500"
              )}
            >
              {percentage}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">{getCompatibilityLevel()}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">{getCompatibilityLevel()}</p>
            <p className="text-sm">{getCompatibilityDescription()}</p>
            <p className="text-xs text-muted-foreground">Based on preferences and horoscope match</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
