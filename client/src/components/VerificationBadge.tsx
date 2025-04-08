import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle } from "lucide-react";

export function VerificationBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className="px-1 py-0 h-5 bg-primary/5 hover:bg-primary/10">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Verified Profile</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
