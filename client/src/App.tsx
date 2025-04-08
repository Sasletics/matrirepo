import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SearchPage from "./pages/search-page";
import MatchesPage from "./pages/matches-page";
import ProfilePage from "./pages/profile-page";
import CreateProfilePage from "./pages/create-profile-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/search" component={SearchPage} />
      <ProtectedRoute path="/matches" component={MatchesPage} />
      <ProtectedRoute path="/profile/:id" component={ProfilePage} />
      <ProtectedRoute path="/create-profile" component={CreateProfilePage} />
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
