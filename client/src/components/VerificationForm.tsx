import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Check, Mail, Phone, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function VerificationForm() {
  const { user } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendVerification = async () => {
    setIsSending(true);
    try {
      const endpoint = activeTab === "email" 
        ? "/api/send-verification-email" 
        : "/api/send-verification-sms";
        
      const res = await apiRequest("POST", endpoint);
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send verification code");
      }
      
      toast({
        title: "Verification code sent",
        description: activeTab === "email" 
          ? "Check your email for the verification code" 
          : "Check your phone for the verification code",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    try {
      const endpoint = activeTab === "email" 
        ? "/api/verify-email" 
        : "/api/verify-phone";
        
      const res = await apiRequest("POST", endpoint, { token: verificationCode });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to verify code");
      }
      
      toast({
        title: `${activeTab === "email" ? "Email" : "Phone"} verified`,
        description: "Your verification was successful",
      });
      
      // Reset code
      setVerificationCode("");
      
      // Force refresh user data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Verify Your Account</CardTitle>
        <CardDescription className="text-center">
          Verification helps build trust and secure your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="email" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "email" | "phone")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" disabled={user?.emailVerified}>
              <Mail className="mr-2 h-4 w-4" />
              Email
              {user?.emailVerified && <Check className="ml-2 h-4 w-4 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="phone" disabled={user?.phoneVerified}>
              <Phone className="mr-2 h-4 w-4" />
              Phone
              {user?.phoneVerified && <Check className="ml-2 h-4 w-4 text-green-500" />}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="mt-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  {user?.emailVerified 
                    ? "Your email is already verified."
                    : "Enter the 6-digit code sent to your email"}
                </p>
                {!user?.emailVerified && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mt-2" 
                    onClick={handleSendVerification}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Verification Email
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {!user?.emailVerified && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-center py-4">
                    <InputOTP 
                      maxLength={6} 
                      value={verificationCode}
                      onChange={setVerificationCode}
                      pattern="^[0-9]+$"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="phone" className="mt-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  {user?.phoneVerified 
                    ? "Your phone is already verified."
                    : "Enter the 6-digit code sent to your phone"}
                </p>
                {!user?.phoneVerified && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mt-2" 
                    onClick={handleSendVerification}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Phone className="mr-2 h-4 w-4" />
                        Send Verification SMS
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {!user?.phoneVerified && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-center py-4">
                    <InputOTP 
                      maxLength={6} 
                      value={verificationCode}
                      onChange={setVerificationCode}
                      pattern="^[0-9]+$"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        {((activeTab === "email" && !user?.emailVerified) || 
          (activeTab === "phone" && !user?.phoneVerified)) && (
          <Button 
            className="w-full" 
            onClick={handleVerify}
            disabled={verificationCode.length < 6 || isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}