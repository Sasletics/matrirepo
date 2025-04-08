import { VerificationForm } from "@/components/VerificationForm";
import { useAuth } from "@/hooks/use-auth";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function VerificationPage() {
  const { user, isLoading } = useAuth();
  const [verificationProgress, setVerificationProgress] = useState(0);
  
  useEffect(() => {
    if (user) {
      let progress = 0;
      if (user.emailVerified) progress += 50;
      if (user.phoneVerified) progress += 50;
      setVerificationProgress(progress);
    }
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Account Verification</h1>
      <p className="text-muted-foreground text-center mb-8">
        Complete verification to unlock all features and build trust with other members
      </p>
      
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={user?.isVerified ? "default" : "outline"} className="px-3 py-1">
              Verification Status: {user?.isVerified ? "Verified" : "Pending"}
            </Badge>
          </div>
          
          <div className="w-full max-w-md">
            <div className="flex justify-between mb-2 text-sm">
              <span>Verification Progress</span>
              <span>{verificationProgress}% Complete</span>
            </div>
            <Progress value={verificationProgress} className="h-2" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Why Verify?</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Build trust with potential matches</li>
              <li>Increase your profile visibility</li>
              <li>Secure your account from unauthorized access</li>
              <li>Required to unlock premium features</li>
              <li>Receive important notifications about matches</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6">Verification Process</h2>
            <p className="text-muted-foreground">
              Complete both email and phone verification by entering the 6-digit code sent to your
              email address and phone number. Your information is kept private and secure.
            </p>
          </div>
          
          <VerificationForm />
        </div>
      </div>
    </div>
  );
}