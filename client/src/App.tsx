import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SearchPage from "./pages/search-page";
import MatchesPage from "./pages/matches-page";
import ProfilePage from "./pages/profile-page";
import CreateProfilePage from "./pages/create-profile-page";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import SubscriptionPage from "./pages/subscription-page";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "./lib/queryClient";

// Protected route wrapper using direct API call
function ProtectedRoute({ component: Component }: { component: () => React.JSX.Element }) {
  const [, navigate] = useLocation();
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-primary font-medium">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <Component />;
}

function App() {
  return (
    <>
      <Switch>
        {/* Public route */}
        <Route path="/auth" component={AuthPage} />
        
        {/* Protected routes */}
        <Route path="/" component={() => <ProtectedRoute component={HomePage} />} />
        <Route path="/search" component={() => <ProtectedRoute component={SearchPage} />} />
        <Route path="/matches" component={() => <ProtectedRoute component={MatchesPage} />} />
        <Route path="/profile/:id" component={() => <ProtectedRoute component={ProfilePage} />} />
        <Route path="/create-profile" component={() => <ProtectedRoute component={CreateProfilePage} />} />
        <Route path="/subscription" component={() => <ProtectedRoute component={SubscriptionPage} />} />
        
        {/* Fallback route */}
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
