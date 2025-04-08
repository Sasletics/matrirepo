import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Crown, Shield, User } from "lucide-react";
import { useLocation } from "wouter";

type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  matchCount: number;
  features: string[];
  cta: string;
  icon: React.ReactNode;
  color: string;
  durationMonths: number;
};

const plans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    matchCount: 10,
    features: [
      "Limited to 10 matches per month",
      "Basic profile visibility",
      "Standard search filters",
      "Message matches only"
    ],
    cta: "Current Plan",
    icon: <User size={24} />,
    color: "bg-gray-100 dark:bg-gray-800",
    durationMonths: 1
  },
  {
    id: "premium",
    name: "Premium",
    price: 499,
    matchCount: 50,
    features: [
      "50 matches per month",
      "Enhanced profile visibility",
      "Advanced search filters",
      "Message anyone",
      "See who viewed your profile",
      "Priority customer support"
    ],
    cta: "Upgrade Now",
    icon: <Shield size={24} />,
    color: "bg-blue-50 dark:bg-blue-950",
    durationMonths: 1
  },
  {
    id: "elite",
    name: "Elite",
    price: 999,
    matchCount: -1, // unlimited
    features: [
      "Unlimited matches",
      "Priority profile listing",
      "All advanced filters",
      "Dedicated relationship manager",
      "Personal matchmaking service",
      "Premium background verification",
      "Video calling with matches"
    ],
    cta: "Go Elite",
    icon: <Crown size={24} />,
    color: "bg-amber-50 dark:bg-amber-950",
    durationMonths: 1
  }
];

export default function SubscriptionPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user");
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      return await res.json();
    }
  });
  
  const updateSubscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error("Invalid plan selected");
      
      // Calculate expiry date as current date + plan duration
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + plan.durationMonths);
      
      const res = await apiRequest("PUT", "/api/subscription", {
        plan: planId,
        expiryDate: expiryDate.toISOString()
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update subscription");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleSelectPlan = (planId: string) => {
    // For free plan, no payment required
    if (planId === "basic") {
      updateSubscriptionMutation.mutate(planId);
      return;
    }
    
    // Since we're not using Stripe yet, for demo purposes we'll just simulate a successful payment
    // Normally we would redirect to a payment page or open a payment modal
    if (window.confirm(`This is a demo payment for the ${planId} plan. In a real app, you would be redirected to a payment page. Continue with mock payment?`)) {
      updateSubscriptionMutation.mutate(planId);
    }
  };
  
  const currentPlan = user?.subscriptionPlan || "basic";
  
  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Choose Your Perfect Match Plan</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upgrade your subscription to unlock premium features and increase your chances of finding your perfect match.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`border-2 ${plan.id === currentPlan ? 'border-primary' : 'border-border'}`}>
              <CardHeader className={`${plan.color} rounded-t-lg`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                    {plan.icon}
                  </div>
                  {plan.id === currentPlan && (
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                      Current Plan
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">
                  {plan.matchCount === -1 ? "Unlimited matches" : `${plan.matchCount} matches per month`}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={18} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={plan.id === currentPlan ? "outline" : "default"}
                  disabled={plan.id === currentPlan || updateSubscriptionMutation.isPending}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {updateSubscriptionMutation.isPending ? "Processing..." : plan.id === currentPlan ? plan.cta : (
                    <span className="flex items-center">
                      {plan.cta} <ArrowRight size={16} className="ml-1" />
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>Need help choosing a plan? Contact our support team at support@bahaghar.com</p>
        </div>
      </div>
    </div>
  );
}