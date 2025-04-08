import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Heart, Mail, Calendar, MapPin, Briefcase, GraduationCap, Home, Users, User, Star, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CompleteProfile } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = parseInt(params.id);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const isOwnProfile = currentUser?.id === userId;
  
  // Fetch profile data
  const { data: profileData, isLoading } = useQuery<CompleteProfile>({
    queryKey: [`/api/complete-profile/${userId}`],
    enabled: !!userId,
  });
  
  // Fetch sent interests
  const { data: sentInterests } = useQuery({
    queryKey: ["/api/interests/sent"],
    enabled: !!currentUser && !isOwnProfile,
  });
  
  const hasInterestSent = sentInterests?.some(interest => 
    interest.receiverId === userId
  );
  
  // Calculate age
  const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - new Date(dateOfBirth).getFullYear();
    const m = today.getMonth() - new Date(dateOfBirth).getMonth();
    if (m < 0 || (m === 0 && today.getDate() < new Date(dateOfBirth).getDate())) {
      age--;
    }
    return age;
  };
  
  const sendInterest = async () => {
    try {
      await apiRequest("POST", "/api/interest", { receiverId: userId });
      queryClient.invalidateQueries({ queryKey: ["/api/interests/sent"] });
      toast({
        title: "Interest Sent",
        description: `You have expressed interest in ${profileData?.profile.fullName}'s profile.`,
      });
    } catch (error) {
      toast({
        title: "Failed to send interest",
        description: "There was an error sending your interest. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-primary font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }
  
  if (!profileData?.profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Profile Not Found</CardTitle>
              <CardDescription>
                This profile doesn't exist or hasn't been completed yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const { user, profile, education, career, family } = profileData;
  const age = calculateAge(new Date(profile.dateOfBirth));
  
  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Header */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage src={profile.profilePicture} alt={profile.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {profile.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    {profile.fullName}
                    {user.isVerified && <VerificationBadge />}
                  </h1>
                  <p className="text-muted-foreground">
                    <span className="inline-flex items-center">
                      <User className="h-4 w-4 mr-1" /> {age} yrs, {profile.height ? `${Math.floor(profile.height / 12)}'${profile.height % 12}"` : "Height not specified"}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="inline-flex items-center">
                      <MapPin className="h-4 w-4 mr-1" /> {profile.city}, {profile.state}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="bg-primary/5">
                      {profile.religion}
                    </Badge>
                    <Badge variant="outline" className="bg-primary/5">
                      {profile.motherTongue}
                    </Badge>
                    {profile.caste && (
                      <Badge variant="outline" className="bg-primary/5">
                        {profile.caste}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {!isOwnProfile && (
                <div className="flex gap-2 self-end sm:self-auto">
                  <Button variant="outline" disabled>
                    <Mail className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                  <Button
                    onClick={sendInterest}
                    disabled={hasInterestSent}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    {hasInterestSent ? "Interest Sent" : "Express Interest"}
                  </Button>
                </div>
              )}
              
              {isOwnProfile && (
                <Button asChild>
                  <Link href="/create-profile">Edit Profile</Link>
                </Button>
              )}
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="family">Family</TabsTrigger>
                <TabsTrigger value="career">Career & Education</TabsTrigger>
              </TabsList>
              
              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.about && (
                      <div>
                        <h3 className="font-medium mb-2">About Me</h3>
                        <p className="text-muted-foreground">{profile.about}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age</span>
                        <span className="font-medium">{age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Height</span>
                        <span className="font-medium">
                          {profile.height ? `${Math.floor(profile.height / 12)}'${profile.height % 12}"` : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date of Birth</span>
                        <span className="font-medium">
                          {format(new Date(profile.dateOfBirth), "dd MMM yyyy")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Marital Status</span>
                        <span className="font-medium">{profile.maritalStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Religion</span>
                        <span className="font-medium">{profile.religion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mother Tongue</span>
                        <span className="font-medium">{profile.motherTongue}</span>
                      </div>
                      {profile.caste && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Caste</span>
                          <span className="font-medium">{profile.caste}</span>
                        </div>
                      )}
                      {profile.subcaste && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sub-caste</span>
                          <span className="font-medium">{profile.subcaste}</span>
                        </div>
                      )}
                      {profile.gotram && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gotram</span>
                          <span className="font-medium">{profile.gotram}</span>
                        </div>
                      )}
                      {profile.manglik && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Manglik</span>
                          <span className="font-medium">{profile.manglik}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">City</span>
                        <span className="font-medium">{profile.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">State</span>
                        <span className="font-medium">{profile.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country</span>
                        <span className="font-medium">{profile.country}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {profile.hobbies && profile.hobbies.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Hobbies & Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profile.hobbies.map((hobby, index) => (
                          <Badge key={index} className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                            {hobby}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Family Tab */}
              <TabsContent value="family" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Family Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {family ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        {family.familyType && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Family Type</span>
                            <span className="font-medium">{family.familyType}</span>
                          </div>
                        )}
                        {family.familyValues && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Family Values</span>
                            <span className="font-medium">{family.familyValues}</span>
                          </div>
                        )}
                        {family.familyAffluence && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Family Affluence</span>
                            <span className="font-medium">{family.familyAffluence}</span>
                          </div>
                        )}
                        {family.fatherStatus && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Father's Status</span>
                            <span className="font-medium">{family.fatherStatus}</span>
                          </div>
                        )}
                        {family.motherStatus && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mother's Status</span>
                            <span className="font-medium">{family.motherStatus}</span>
                          </div>
                        )}
                        {family.siblings !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Number of Siblings</span>
                            <span className="font-medium">{family.siblings}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        Family details not provided
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Career & Education Tab */}
              <TabsContent value="career" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {education ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Highest Education</span>
                          <span className="font-medium">{education.highestEducation}</span>
                        </div>
                        {education.college && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">College/University</span>
                            <span className="font-medium">{education.college}</span>
                          </div>
                        )}
                        {education.degree && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Degree</span>
                            <span className="font-medium">{education.degree}</span>
                          </div>
                        )}
                        {education.yearOfPassing && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Year of Passing</span>
                            <span className="font-medium">{education.yearOfPassing}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        Education details not provided
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Career</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {career ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Occupation</span>
                          <span className="font-medium">{career.occupation}</span>
                        </div>
                        {career.employedIn && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Employed In</span>
                            <span className="font-medium">{career.employedIn}</span>
                          </div>
                        )}
                        {career.company && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Company</span>
                            <span className="font-medium">{career.company}</span>
                          </div>
                        )}
                        {career.annualIncome && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Annual Income</span>
                            <span className="font-medium">{career.annualIncome}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        Career details not provided
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                {!isOwnProfile ? (
                  <div className="text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground/70 mx-auto mb-2" />
                    <p className="text-muted-foreground mb-4">Contact details are hidden</p>
                    <Button className="w-full" onClick={sendInterest} disabled={hasInterestSent}>
                      <Heart className="mr-2 h-4 w-4" />
                      {hasInterestSent ? "Interest Sent" : "Express Interest"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Profile Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Verification</span>
                    <span className="flex items-center">
                      {user.isVerified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-600 mr-1" />
                          <span className="font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
                          <span className="font-medium">Pending</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Profile Completion</span>
                    <span className="flex items-center">
                      {user.isProfileComplete ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-600 mr-1" />
                          <span className="font-medium">Complete</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
                          <span className="font-medium">Incomplete</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium">
                      {format(new Date(user.createdAt), "MMM yyyy")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
