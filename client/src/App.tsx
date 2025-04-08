import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useQuery } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SearchPage from "./pages/search-page";
import MatchesPage from "./pages/matches-page";
import ProfilePage from "./pages/profile-page";
import CreateProfilePage from "./pages/create-profile-page";
import { getQueryFn } from "./lib/queryClient";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

// Simple protected component wrapper
function ProtectedComponent({ component: Component }: { component: () => React.JSX.Element }) {
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

function Router() {
  const [location] = useLocation();
  
  // Don't use AuthProvider for authentication page
  if (location === "/auth") {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
      </Switch>
    );
  }
  
  // Use AuthProvider for protected routes
  return (
    <Switch>
      <Route path="/" component={() => <ProtectedComponent component={HomePage} />} />
      <Route path="/search" component={() => <ProtectedComponent component={SearchPage} />} />
      <Route path="/matches" component={() => <ProtectedComponent component={MatchesPage} />} />
      <Route path="/profile/:id" component={() => <ProtectedComponent component={ProfilePage} />} />
      <Route path="/create-profile" component={() => <ProtectedComponent component={CreateProfilePage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
