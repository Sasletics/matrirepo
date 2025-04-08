import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompleteProfile } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch user profile
  const { data: myProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["/api/my-profile"],
    enabled: !!user,
  });
  
  // Fetch recommended matches
  const { data: matches, isLoading: isMatchesLoading } = useQuery<CompleteProfile[]>({
    queryKey: ["/api/matches"],
    enabled: !!user && !!myProfile?.profile,
  });
  
  // Show toast if profile is not complete
  useEffect(() => {
    if (myProfile && !myProfile.profile) {
      toast({
        title: "Complete your profile",
        description: "Please complete your profile to get better matches",
        duration: 5000,
      });
    }
  }, [myProfile, toast]);
  
  const isLoading = isProfileLoading || isMatchesLoading;
  const hasProfile = myProfile && myProfile.profile;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-6">
          {/* Welcome section */}
          <section className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Find Your Perfect Odia Match
            </h1>
            <p className="mt-3 text-muted-foreground">
              Connecting Odia singles worldwide for meaningful relationships based on shared culture and values.
            </p>
          </section>
          
          {/* Profile completion alert */}
          {!hasProfile && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-primary">Complete Your Profile</h2>
              <p className="mt-2 text-muted-foreground">
                Create your profile to get personalized matches and connect with potential partners.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/create-profile">Create Profile Now</Link>
              </Button>
            </div>
          )}
          
          {/* Matches section */}
          {hasProfile && (
            <section className="mt-4">
              <Tabs defaultValue="recommendations" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Your Matches</h2>
                  <TabsList>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    <TabsTrigger value="new">New Profiles</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="recommendations">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                      <span className="ml-2 text-muted-foreground">Finding your matches...</span>
                    </div>
                  ) : matches && matches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {matches.slice(0, 6).map((profile) => (
                        <ProfileCard
                          key={profile.user.id}
                          profile={profile}
                          matchPercentage={Math.floor(Math.random() * 30) + 70} // This would be calculated properly in a real app
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                      <h3 className="mt-4 text-lg font-medium">No matches found</h3>
                      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                        We couldn't find any matches based on your preferences. Try updating your preferences or check back later.
                      </p>
                      <Button className="mt-4" variant="outline" asChild>
                        <Link href="/search">Browse Profiles</Link>
                      </Button>
                    </div>
                  )}
                  
                  {matches && matches.length > 0 && (
                    <div className="mt-6 text-center">
                      <Button asChild>
                        <Link href="/matches">View All Matches</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="new">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                      <span className="ml-2 text-muted-foreground">Loading new profiles...</span>
                    </div>
                  ) : matches && matches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Assume we'd fetch new profiles in a real app */}
                      {matches.slice(0, 6).map((profile) => (
                        <ProfileCard
                          key={profile.user.id}
                          profile={profile}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                      <h3 className="mt-4 text-lg font-medium">No new profiles</h3>
                      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                        There are no new profiles matching your preferences at this time. Check back later.
                      </p>
                      <Button className="mt-4" variant="outline" asChild>
                        <Link href="/search">Browse All Profiles</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </section>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted/30 border-t py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="/">Home</Link>
            <Link href="/search">Search</Link>
            <Link href="/matches">Matches</Link>
          </div>
          <p>© {new Date().getFullYear()} OdiaMatrimony. All rights reserved.</p>
          <p className="mt-2">Connecting Odia hearts around the world.</p>
        </div>
      </footer>
    </div>
  );
}
