import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Mail, User, Calendar, MapPin, Briefcase, GraduationCap, Home, Users } from "lucide-react";
import { ProfileMatchPercent } from "./ProfileMatchPercent";
import { VerificationBadge } from "./VerificationBadge";
import { Link } from "wouter";
import { CompleteProfile } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ProfileCardProps {
  profile: CompleteProfile;
  matchPercentage?: number;
  showActions?: boolean;
  detailed?: boolean;
}

export function ProfileCard({ profile, matchPercentage, showActions = true, detailed = false }: ProfileCardProps) {
  const { toast } = useToast();
  
  if (!profile.profile) {
    return null;
  }
  
  const { user, profile: profileData, education, career, family } = profile;
  
  // Calculate age
  const birthDate = new Date(profileData.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  const sendInterest = async () => {
    try {
      await apiRequest("POST", "/api/interest", { receiverId: user.id });
      toast({
        title: "Interest Sent",
        description: `You have expressed interest in ${profileData.fullName}'s profile.`,
      });
    } catch (error) {
      toast({
        title: "Failed to send interest",
        description: "There was an error sending your interest. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Generate avatar fallback from name
  const generateFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${detailed ? 'w-full' : 'w-full max-w-sm'}`}>
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={profileData.profilePicture} alt={profileData.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                {generateFallback(profileData.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                {profileData.fullName}
                {user.isVerified && <VerificationBadge />}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <User className="h-3.5 w-3.5" /> {age} yrs, {profileData.height ? `${Math.floor(profileData.height / 12)}'${profileData.height % 12}"` : "Height not specified"}
              </CardDescription>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-xs bg-primary/5">
                  {profileData.religion}
                </Badge>
                <Badge variant="outline" className="text-xs bg-primary/5">
                  {profileData.motherTongue}
                </Badge>
                {profileData.caste && (
                  <Badge variant="outline" className="text-xs bg-primary/5">
                    {profileData.caste}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {matchPercentage && <ProfileMatchPercent percentage={matchPercentage} />}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{profileData.city}, {profileData.state}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(profileData.dateOfBirth), "dd MMM yyyy")}</span>
          </div>
          
          {career && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{career.occupation}{career.company ? ` at ${career.company}` : ''}</span>
            </div>
          )}
          
          {education && (
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>{education.highestEducation}</span>
            </div>
          )}
          
          {family && (
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span>{family.familyType || 'Family details not specified'}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{profileData.maritalStatus}</span>
          </div>
        </div>
        
        {detailed && profileData.about && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">About</h4>
            <p className="text-sm text-muted-foreground">{profileData.about}</p>
          </div>
        )}
      </CardContent>
      
      {showActions && (
        <CardFooter className="border-t pt-4 flex justify-between gap-2">
          <Button variant="outline" className="w-1/2" asChild>
            <Link href={`/profile/${user.id}`}>
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Link>
          </Button>
          <Button className="w-1/2" onClick={sendInterest}>
            <Heart className="mr-2 h-4 w-4" />
            Express Interest
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
