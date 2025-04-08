import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { ProfileCard } from "@/components/ProfileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompleteProfile, Interest } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Search, Heart, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function MatchesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("recommended");
  
  // Fetch recommended matches
  const { data: matches, isLoading: isMatchesLoading } = useQuery<CompleteProfile[]>({
    queryKey: ["/api/matches"],
    enabled: !!user,
  });
  
  // Fetch sent interests
  const { data: sentInterests, isLoading: isSentLoading } = useQuery<Interest[]>({
    queryKey: ["/api/interests/sent"],
    enabled: !!user,
  });
  
  // Fetch received interests
  const { data: receivedInterests, isLoading: isReceivedLoading } = useQuery<Interest[]>({
    queryKey: ["/api/interests/received"],
    enabled: !!user,
  });
  
  // Fetch all profiles to get details for interests
  const { data: allProfiles, isLoading: isProfilesLoading } = useQuery<CompleteProfile[]>({
    queryKey: ["/api/search"],
    enabled: !!sentInterests || !!receivedInterests,
  });
  
  const isLoading = isMatchesLoading || isSentLoading || isReceivedLoading || isProfilesLoading;
  
  // Get profile from user ID
  const getProfileById = (userId: number) => {
    return allProfiles?.find(profile => profile.user.id === userId);
  };
  
  // Accept interest
  const acceptInterest = async (interestId: number) => {
    try {
      await apiRequest("PUT", `/api/interest/${interestId}`, { status: "accepted" });
      queryClient.invalidateQueries({ queryKey: ["/api/interests/received"] });
      toast({
        title: "Interest Accepted",
        description: "You have accepted the interest request.",
      });
    } catch (error) {
      toast({
        title: "Failed to accept interest",
        description: "There was an error accepting this interest. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Reject interest
  const rejectInterest = async (interestId: number) => {
    try {
      await apiRequest("PUT", `/api/interest/${interestId}`, { status: "rejected" });
      queryClient.invalidateQueries({ queryKey: ["/api/interests/received"] });
      toast({
        title: "Interest Declined",
        description: "You have declined the interest request.",
      });
    } catch (error) {
      toast({
        title: "Failed to decline interest",
        description: "There was an error declining this interest. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - new Date(dateOfBirth).getFullYear();
    const m = today.getMonth() - new Date(dateOfBirth).getMonth();
    if (m < 0 || (m === 0 && today.getDate() < new Date(dateOfBirth).getDate())) {
      age--;
    }
    return age;
  };
  
  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Your Matches & Interests</h1>
            <p className="text-muted-foreground">
              View your recommended matches, see who's interested in your profile, and manage your sent interests.
            </p>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="received">
                Received Interests
                {receivedInterests?.filter(i => i.status === "pending").length > 0 && (
                  <Badge className="ml-2 bg-primary">{receivedInterests.filter(i => i.status === "pending").length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent">Sent Interests</TabsTrigger>
            </TabsList>
            
            {/* Recommended Matches */}
            <TabsContent value="recommended">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                  <span className="ml-2 text-muted-foreground">Finding your matches...</span>
                </div>
              ) : matches && matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {matches.map((profile) => (
                    <ProfileCard
                      key={profile.user.id}
                      profile={profile}
                      matchPercentage={Math.floor(Math.random() * 30) + 70} // This would be calculated properly in a real app
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg mt-6">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="mt-4 text-lg font-medium">No matches found</h3>
                  <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                    We couldn't find any matches based on your preferences. Try updating your preferences or check back later.
                  </p>
                </div>
              )}
            </TabsContent>
            
            {/* Received Interests */}
            <TabsContent value="received">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                  <span className="ml-2 text-muted-foreground">Loading received interests...</span>
                </div>
              ) : receivedInterests && receivedInterests.length > 0 ? (
                <div className="space-y-4 mt-6">
                  {/* Pending Interests */}
                  {receivedInterests.filter(interest => interest.status === "pending").length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Pending Interests</CardTitle>
                        <CardDescription>
                          People who have expressed interest in your profile
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {receivedInterests
                          .filter(interest => interest.status === "pending")
                          .map((interest) => {
                            const profile = getProfileById(interest.senderId);
                            if (!profile?.profile) return null;
                            
                            return (
                              <div key={interest.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={profile.profile.profilePicture} alt={profile.profile.fullName} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {profile.profile.fullName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">{profile.profile.fullName}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {calculateAge(new Date(profile.profile.dateOfBirth))} yrs, {profile.profile.city}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Interest received on {format(new Date(interest.createdAt), "dd MMM yyyy")}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => rejectInterest(interest.id)}>
                                    <X className="h-4 w-4 mr-1" />
                                    Decline
                                  </Button>
                                  <Button size="sm" onClick={() => acceptInterest(interest.id)}>
                                    <Check className="h-4 w-4 mr-1" />
                                    Accept
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Accepted Interests */}
                  {receivedInterests.filter(interest => interest.status === "accepted").length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Accepted Interests</CardTitle>
                        <CardDescription>
                          People whose interest you've accepted
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {receivedInterests
                          .filter(interest => interest.status === "accepted")
                          .map((interest) => {
                            const profile = getProfileById(interest.senderId);
                            if (!profile?.profile) return null;
                            
                            return (
                              <div key={interest.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={profile.profile.profilePicture} alt={profile.profile.fullName} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {profile.profile.fullName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">{profile.profile.fullName}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {calculateAge(new Date(profile.profile.dateOfBirth))} yrs, {profile.profile.city}
                                    </p>
                                    <div className="mt-1">
                                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600">
                                        Accepted
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`/profile/${profile.user.id}`}>View Profile</a>
                                </Button>
                              </div>
                            );
                          })}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Rejected Interests */}
                  {receivedInterests.filter(interest => interest.status === "rejected").length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Declined Interests</CardTitle>
                        <CardDescription>
                          People whose interest you've declined
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {receivedInterests
                          .filter(interest => interest.status === "rejected")
                          .map((interest) => {
                            const profile = getProfileById(interest.senderId);
                            if (!profile?.profile) return null;
                            
                            return (
                              <div key={interest.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={profile.profile.profilePicture} alt={profile.profile.fullName} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {profile.profile.fullName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">{profile.profile.fullName}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {calculateAge(new Date(profile.profile.dateOfBirth))} yrs, {profile.profile.city}
                                    </p>
                                    <div className="mt-1">
                                      <Badge variant="outline" className="text-xs bg-red-50 text-red-600">
                                        Declined
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg mt-6">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="mt-4 text-lg font-medium">No interests received</h3>
                  <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                    You haven't received any interests yet. Complete your profile to increase your chances of getting noticed.
                  </p>
                </div>
              )}
            </TabsContent>
            
            {/* Sent Interests */}
            <TabsContent value="sent">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                  <span className="ml-2 text-muted-foreground">Loading sent interests...</span>
                </div>
              ) : sentInterests && sentInterests.length > 0 ? (
                <div className="space-y-4 mt-6">
                  {/* Pending Sent Interests */}
                  {sentInterests.filter(interest => interest.status === "pending").length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Pending Responses</CardTitle>
                        <CardDescription>
                          People you've expressed interest in
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sentInterests
                          .filter(interest => interest.status === "pending")
                          .map((interest) => {
                            const profile = getProfileById(interest.receiverId);
                            if (!profile?.profile) return null;
                            
                            return (
                              <Card key={interest.id} className="overflow-hidden">
                                <div className="relative h-32 bg-muted">
                                  {profile.profile.profilePicture ? (
                                    <div 
                                      className="w-full h-full bg-center bg-cover"
                                      style={{ backgroundImage: `url(${profile.profile.profilePicture})` }}
                                    ></div>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                      <span className="text-3xl font-bold text-primary/30">
                                        {profile.profile.fullName.split(' ').map(n => n[0]).join('')}
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                  <div className="absolute bottom-0 left-0 p-3 text-white">
                                    <h3 className="font-medium">{profile.profile.fullName}</h3>
                                    <p className="text-sm text-white/80">
                                      {calculateAge(new Date(profile.profile.dateOfBirth))} yrs, {profile.profile.city}
                                    </p>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600">
                                      Pending
                                    </Badge>
                                    <Button variant="ghost" size="sm" asChild className="text-primary">
                                      <a href={`/profile/${profile.user.id}`}>View Profile</a>
                                    </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Sent on {format(new Date(interest.createdAt), "dd MMM yyyy")}
                                  </p>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Accepted Sent Interests */}
                  {sentInterests.filter(interest => interest.status === "accepted").length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Accepted Interests</CardTitle>
                        <CardDescription>
                          People who have accepted your interest
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sentInterests
                          .filter(interest => interest.status === "accepted")
                          .map((interest) => {
                            const profile = getProfileById(interest.receiverId);
                            if (!profile?.profile) return null;
                            
                            return (
                              <Card key={interest.id} className="overflow-hidden">
                                <div className="relative h-32 bg-muted">
                                  {profile.profile.profilePicture ? (
                                    <div 
                                      className="w-full h-full bg-center bg-cover"
                                      style={{ backgroundImage: `url(${profile.profile.profilePicture})` }}
                                    ></div>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                      <span className="text-3xl font-bold text-primary/30">
                                        {profile.profile.fullName.split(' ').map(n => n[0]).join('')}
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                  <div className="absolute bottom-0 left-0 p-3 text-white">
                                    <h3 className="font-medium">{profile.profile.fullName}</h3>
                                    <p className="text-sm text-white/80">
                                      {calculateAge(new Date(profile.profile.dateOfBirth))} yrs, {profile.profile.city}
                                    </p>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600">
                                      Accepted
                                    </Badge>
                                    <Button variant="ghost" size="sm" asChild className="text-primary">
                                      <a href={`/profile/${profile.user.id}`}>View Profile</a>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Rejected Sent Interests */}
                  {sentInterests.filter(interest => interest.status === "rejected").length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Declined Interests</CardTitle>
                        <CardDescription>
                          People who have declined your interest
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sentInterests
                          .filter(interest => interest.status === "rejected")
                          .map((interest) => {
                            const profile = getProfileById(interest.receiverId);
                            if (!profile?.profile) return null;
                            
                            return (
                              <Card key={interest.id} className="overflow-hidden">
                                <div className="relative h-32 bg-muted">
                                  {profile.profile.profilePicture ? (
                                    <div 
                                      className="w-full h-full bg-center bg-cover"
                                      style={{ backgroundImage: `url(${profile.profile.profilePicture})` }}
                                    ></div>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                      <span className="text-3xl font-bold text-primary/30">
                                        {profile.profile.fullName.split(' ').map(n => n[0]).join('')}
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                  <div className="absolute bottom-0 left-0 p-3 text-white">
                                    <h3 className="font-medium">{profile.profile.fullName}</h3>
                                    <p className="text-sm text-white/80">
                                      {calculateAge(new Date(profile.profile.dateOfBirth))} yrs, {profile.profile.city}
                                    </p>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <Badge variant="outline" className="bg-red-50 text-red-600">
                                      Declined
                                    </Badge>
                                    <Button variant="ghost" size="sm" asChild className="text-primary">
                                      <a href={`/profile/${profile.user.id}`}>View Profile</a>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg mt-6">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="mt-4 text-lg font-medium">No interests sent</h3>
                  <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                    You haven't sent any interests yet. Browse profiles and express interest in potential matches.
                  </p>
                  <Button className="mt-6" asChild>
                    <a href="/search">Browse Profiles</a>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
