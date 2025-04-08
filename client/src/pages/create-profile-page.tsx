import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  insertProfileSchema, 
  insertEducationSchema, 
  insertCareerSchema, 
  insertFamilySchema,
  insertPreferencesSchema
} from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Loader2, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Heart, 
  Upload
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Extend the schemas with validation
const profileFormSchema = insertProfileSchema.extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dateOfBirth: z.string().refine(val => {
    const date = new Date(val);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    return age >= 18 && age <= 70;
  }, "You must be between 18 and 70 years old"),
  height: z.number().min(48, "Height must be at least 4 feet").optional(),
  hobbies: z.array(z.string()).optional(),
});

const educationFormSchema = insertEducationSchema.extend({
  highestEducation: z.string().min(1, "Education is required"),
});

const careerFormSchema = insertCareerSchema.extend({
  occupation: z.string().min(1, "Occupation is required"),
});

const familyFormSchema = insertFamilySchema.extend({});

const preferencesFormSchema = insertPreferencesSchema.extend({
  minAge: z.number().min(18, "Minimum age must be at least 18").optional(),
  maxAge: z.number().max(70, "Maximum age must be no more than 70").optional(),
});

// Create interfaces for form values
type ProfileFormValues = z.infer<typeof profileFormSchema>;
type EducationFormValues = z.infer<typeof educationFormSchema>;
type CareerFormValues = z.infer<typeof careerFormSchema>;
type FamilyFormValues = z.infer<typeof familyFormSchema>;
type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

export default function CreateProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [activeTab, setActiveTab] = useState("basic");
  const [isUploading, setIsUploading] = useState(false);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [newHobby, setNewHobby] = useState("");
  
  // Fetch existing profile data to pre-fill forms
  const { data: existingProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["/api/my-profile"],
    enabled: !!user,
  });

  // Basic profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      userId: user?.id,
      fullName: existingProfile?.profile?.fullName || "",
      gender: existingProfile?.profile?.gender || "Male",
      dateOfBirth: existingProfile?.profile?.dateOfBirth 
        ? new Date(existingProfile.profile.dateOfBirth).toISOString().split('T')[0] 
        : "",
      height: existingProfile?.profile?.height || undefined,
      maritalStatus: existingProfile?.profile?.maritalStatus || "Never Married",
      religion: existingProfile?.profile?.religion || "Hindu",
      motherTongue: existingProfile?.profile?.motherTongue || "Odia",
      caste: existingProfile?.profile?.caste || "",
      subcaste: existingProfile?.profile?.subcaste || "",
      gotram: existingProfile?.profile?.gotram || "",
      manglik: existingProfile?.profile?.manglik || "",
      location: existingProfile?.profile?.location || "",
      state: existingProfile?.profile?.state || "",
      city: existingProfile?.profile?.city || "",
      country: existingProfile?.profile?.country || "India",
      about: existingProfile?.profile?.about || "",
      hobbies: existingProfile?.profile?.hobbies || [],
      profilePicture: existingProfile?.profile?.profilePicture || "",
    },
  });

  // Education form
  const educationForm = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      userId: user?.id,
      highestEducation: existingProfile?.education?.highestEducation || "",
      college: existingProfile?.education?.college || "",
      degree: existingProfile?.education?.degree || "",
      yearOfPassing: existingProfile?.education?.yearOfPassing || undefined,
    },
  });

  // Career form
  const careerForm = useForm<CareerFormValues>({
    resolver: zodResolver(careerFormSchema),
    defaultValues: {
      userId: user?.id,
      occupation: existingProfile?.career?.occupation || "",
      employedIn: existingProfile?.career?.employedIn || "",
      company: existingProfile?.career?.company || "",
      annualIncome: existingProfile?.career?.annualIncome || "",
    },
  });

  // Family form
  const familyForm = useForm<FamilyFormValues>({
    resolver: zodResolver(familyFormSchema),
    defaultValues: {
      userId: user?.id,
      fatherStatus: existingProfile?.family?.fatherStatus || "",
      motherStatus: existingProfile?.family?.motherStatus || "",
      familyType: existingProfile?.family?.familyType || "",
      familyValues: existingProfile?.family?.familyValues || "",
      familyAffluence: existingProfile?.family?.familyAffluence || "",
      siblings: existingProfile?.family?.siblings || undefined,
    },
  });

  // Preferences form
  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      userId: user?.id,
      minAge: existingProfile?.preferences?.minAge || 21,
      maxAge: existingProfile?.preferences?.maxAge || 35,
      minHeight: existingProfile?.preferences?.minHeight || undefined,
      maxHeight: existingProfile?.preferences?.maxHeight || undefined,
      maritalStatus: existingProfile?.preferences?.maritalStatus || ["Never Married"],
      education: existingProfile?.preferences?.education || [],
      occupation: existingProfile?.preferences?.occupation || [],
      income: existingProfile?.preferences?.income || [],
      location: existingProfile?.preferences?.location || [],
      caste: existingProfile?.preferences?.caste || [],
      religion: existingProfile?.preferences?.religion || ["Hindu"],
      motherTongue: existingProfile?.preferences?.motherTongue || ["Odia"],
      specificRequirements: existingProfile?.preferences?.specificRequirements || "",
    },
  });

  // Initialize hobbies from existing profile
  useState(() => {
    if (existingProfile?.profile?.hobbies) {
      setHobbies(existingProfile.profile.hobbies);
    }
  });

  // Define mutations
  const profileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      // Create profile if it doesn't exist, otherwise update
      const method = existingProfile?.profile ? "PUT" : "POST";
      const res = await apiRequest(method, "/api/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile saved",
        description: "Your personal details have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-profile"] });
      setActiveTab("education");
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const educationMutation = useMutation({
    mutationFn: async (data: EducationFormValues) => {
      const method = existingProfile?.education ? "PUT" : "POST";
      const res = await apiRequest(method, "/api/education", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Education details saved",
        description: "Your education details have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-profile"] });
      setActiveTab("career");
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving education details",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const careerMutation = useMutation({
    mutationFn: async (data: CareerFormValues) => {
      const method = existingProfile?.career ? "PUT" : "POST";
      const res = await apiRequest(method, "/api/career", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Career details saved",
        description: "Your career details have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-profile"] });
      setActiveTab("family");
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving career details",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const familyMutation = useMutation({
    mutationFn: async (data: FamilyFormValues) => {
      const method = existingProfile?.family ? "PUT" : "POST";
      const res = await apiRequest(method, "/api/family", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Family details saved",
        description: "Your family details have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-profile"] });
      setActiveTab("preferences");
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving family details",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const preferencesMutation = useMutation({
    mutationFn: async (data: PreferencesFormValues) => {
      const method = existingProfile?.preferences ? "PUT" : "POST";
      const res = await apiRequest(method, "/api/preferences", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Preferences saved",
        description: "Your partner preferences have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-profile"] });
      
      // Update user profile completion status
      apiRequest("PUT", "/api/user", { isProfileComplete: true });
      
      // Navigate to home page after all forms are submitted
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handlers
  const onProfileSubmit = (values: ProfileFormValues) => {
    // Add hobbies to form values
    values.hobbies = hobbies;
    profileMutation.mutate(values);
  };

  const onEducationSubmit = (values: EducationFormValues) => {
    educationMutation.mutate(values);
  };

  const onCareerSubmit = (values: CareerFormValues) => {
    careerMutation.mutate(values);
  };

  const onFamilySubmit = (values: FamilyFormValues) => {
    familyMutation.mutate(values);
  };

  const onPreferencesSubmit = (values: PreferencesFormValues) => {
    preferencesMutation.mutate(values);
  };

  // Manage hobbies
  const addHobby = () => {
    if (newHobby.trim() !== "" && !hobbies.includes(newHobby.trim())) {
      setHobbies([...hobbies, newHobby.trim()]);
      setNewHobby("");
    }
  };

  const removeHobby = (hobby: string) => {
    setHobbies(hobbies.filter(h => h !== hobby));
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle next/previous buttons
  const goToNextTab = () => {
    const tabs = ["basic", "education", "career", "family", "preferences"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const goToPreviousTab = () => {
    const tabs = ["basic", "education", "career", "family", "preferences"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Educational options
  const educationOptions = [
    "High School", "Diploma", "Bachelor's", "Master's", "Ph.D.", 
    "Engineering", "Medical", "Law", "MBA", "Other"
  ];

  // Career options
  const occupationOptions = [
    "Student", "Government Employee", "Private Company", "Business Owner", 
    "Self Employed", "Doctor", "Engineer", "Teacher", "IT Professional", 
    "Banking Professional", "Lawyer", "Accountant", "Homemaker", "Other"
  ];

  const employedInOptions = [
    "Government", "Private", "Business", "Defence", "Self Employed", "Not Working"
  ];

  const incomeRangeOptions = [
    "Less than ₹1 Lakh", "₹1-3 Lakh", "₹3-5 Lakh", "₹5-7 Lakh", 
    "₹7-10 Lakh", "₹10-15 Lakh", "₹15-20 Lakh", "₹20-30 Lakh", 
    "₹30-50 Lakh", "₹50 Lakh-1 Crore", "Above ₹1 Crore"
  ];

  // Family options
  const familyTypeOptions = [
    "Joint Family", "Nuclear Family", "Others"
  ];

  const familyValuesOptions = [
    "Traditional", "Moderate", "Liberal"
  ];

  const familyAffluenceOptions = [
    "Middle Class", "Upper Middle Class", "Rich", "Affluent"
  ];

  // Location options (Odisha districts)
  const odishaDistrictsOptions = [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack",
    "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur",
    "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha",
    "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada",
    "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
  ];

  // Caste options for Odisha
  const casteOptions = [
    "Brahmin", "Khandayat", "Karan", "Chasa", "Gopal", "Gudia", 
    "Teli", "Scheduled Caste", "Scheduled Tribe", "Other"
  ];

  // Check if profile data is still loading
  if (isProfileLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-primary font-medium">Loading your profile data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {existingProfile?.profile ? "Update Your Profile" : "Create Your Profile"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Complete your profile to find your perfect match based on Odia traditions and values.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Basic Details</span>
                <span className="sm:hidden">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Education</span>
                <span className="sm:hidden">Edu</span>
              </TabsTrigger>
              <TabsTrigger value="career" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Career</span>
                <span className="sm:hidden">Career</span>
              </TabsTrigger>
              <TabsTrigger value="family" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Family</span>
                <span className="sm:hidden">Family</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
                <span className="sm:hidden">Prefs</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Basic Profile Form */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Please provide your basic details to create your profile.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Gender */}
                        <FormField
                          control={profileForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Date of Birth */}
                        <FormField
                          control={profileForm.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth*</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormDescription>
                                You must be at least 18 years old.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Height */}
                        <FormField
                          control={profileForm.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (in inches)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Enter your height" 
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormDescription>
                                5ft = 60 inches, 6ft = 72 inches
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Marital Status */}
                        <FormField
                          control={profileForm.control}
                          name="maritalStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marital Status*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select marital status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Never Married">Never Married</SelectItem>
                                  <SelectItem value="Divorced">Divorced</SelectItem>
                                  <SelectItem value="Widowed">Widowed</SelectItem>
                                  <SelectItem value="Separated">Separated</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Religion */}
                        <FormField
                          control={profileForm.control}
                          name="religion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Religion*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your religion" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Hindu">Hindu</SelectItem>
                                  <SelectItem value="Muslim">Muslim</SelectItem>
                                  <SelectItem value="Christian">Christian</SelectItem>
                                  <SelectItem value="Sikh">Sikh</SelectItem>
                                  <SelectItem value="Buddhist">Buddhist</SelectItem>
                                  <SelectItem value="Jain">Jain</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Mother Tongue */}
                        <FormField
                          control={profileForm.control}
                          name="motherTongue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mother Tongue*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select mother tongue" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Odia">Odia</SelectItem>
                                  <SelectItem value="Hindi">Hindi</SelectItem>
                                  <SelectItem value="Bengali">Bengali</SelectItem>
                                  <SelectItem value="Telugu">Telugu</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Caste */}
                        <FormField
                          control={profileForm.control}
                          name="caste"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Caste</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your caste (optional)" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {casteOptions.map((caste) => (
                                    <SelectItem key={caste} value={caste}>{caste}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Sub-caste */}
                        <FormField
                          control={profileForm.control}
                          name="subcaste"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sub-caste</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your sub-caste (optional)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Gotram */}
                        <FormField
                          control={profileForm.control}
                          name="gotram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gotram</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your gotram (optional)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Manglik */}
                        <FormField
                          control={profileForm.control}
                          name="manglik"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Manglik Status</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select manglik status (optional)" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
                                  <SelectItem value="Don't Know">Don't Know</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium">Current Location</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* City */}
                          <FormField
                            control={profileForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your city" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* State */}
                          <FormField
                            control={profileForm.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State*</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your state" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Odisha">Odisha</SelectItem>
                                    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                                    <SelectItem value="Delhi">Delhi</SelectItem>
                                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                    <SelectItem value="Telangana">Telangana</SelectItem>
                                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Country */}
                          <FormField
                            control={profileForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country*</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="India">India</SelectItem>
                                    <SelectItem value="USA">USA</SelectItem>
                                    <SelectItem value="UK">UK</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="Australia">Australia</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Location (district/area) */}
                          <FormField
                            control={profileForm.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>District/Area*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your district or area" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium">About You</h3>
                        
                        {/* About */}
                        <FormField
                          control={profileForm.control}
                          name="about"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>About Yourself</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Write something about yourself, your background, values, and what you're looking for in a partner." 
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                This helps others know you better.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Hobbies */}
                        <div className="space-y-2">
                          <FormLabel>Hobbies & Interests</FormLabel>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {hobbies.map((hobby, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary"
                                className="py-1 px-3"
                              >
                                {hobby}
                                <button 
                                  type="button" 
                                  className="ml-1 text-muted-foreground hover:text-foreground"
                                  onClick={() => removeHobby(hobby)}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Add a hobby" 
                              value={newHobby}
                              onChange={(e) => setNewHobby(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addHobby();
                                }
                              }}
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={addHobby}
                            >
                              Add
                            </Button>
                          </div>
                          <FormDescription>
                            Add hobbies like Reading, Cooking, Traveling, etc.
                          </FormDescription>
                        </div>
                        
                        {/* Profile Picture */}
                        <FormField
                          control={profileForm.control}
                          name="profilePicture"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Picture URL</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input 
                                    placeholder="Enter image URL" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Enter a URL for your profile picture.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button
                          type="submit"
                          disabled={profileMutation.isPending}
                        >
                          {profileMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              Save and Continue
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Education Form */}
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Educational Background</CardTitle>
                  <CardDescription>
                    Share your educational qualifications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...educationForm}>
                    <form onSubmit={educationForm.handleSubmit(onEducationSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Highest Education */}
                        <FormField
                          control={educationForm.control}
                          name="highestEducation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Highest Education*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your highest education" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {educationOptions.map((edu) => (
                                    <SelectItem key={edu} value={edu}>{edu}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* College/University */}
                        <FormField
                          control={educationForm.control}
                          name="college"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>College/University</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your college or university" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Degree */}
                        <FormField
                          control={educationForm.control}
                          name="degree"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree/Specialization</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your degree or specialization" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Year of Passing */}
                        <FormField
                          control={educationForm.control}
                          name="yearOfPassing"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year of Passing</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Enter year of passing" 
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-between gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={goToPreviousTab}
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={educationMutation.isPending}
                        >
                          {educationMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              Save and Continue
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Career Form */}
            <TabsContent value="career">
              <Card>
                <CardHeader>
                  <CardTitle>Career Information</CardTitle>
                  <CardDescription>
                    Provide details about your professional life.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...careerForm}>
                    <form onSubmit={careerForm.handleSubmit(onCareerSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Occupation */}
                        <FormField
                          control={careerForm.control}
                          name="occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Occupation*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your occupation" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {occupationOptions.map((occ) => (
                                    <SelectItem key={occ} value={occ}>{occ}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Employed In */}
                        <FormField
                          control={careerForm.control}
                          name="employedIn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employed In</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select employment type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {employedInOptions.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Company */}
                        <FormField
                          control={careerForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company/Organization</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your company or organization" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Annual Income */}
                        <FormField
                          control={careerForm.control}
                          name="annualIncome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Income</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select income range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {incomeRangeOptions.map((range) => (
                                    <SelectItem key={range} value={range}>{range}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-between gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={goToPreviousTab}
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={careerMutation.isPending}
                        >
                          {careerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              Save and Continue
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Family Form */}
            <TabsContent value="family">
              <Card>
                <CardHeader>
                  <CardTitle>Family Background</CardTitle>
                  <CardDescription>
                    Tell us about your family.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...familyForm}>
                    <form onSubmit={familyForm.handleSubmit(onFamilySubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Family Type */}
                        <FormField
                          control={familyForm.control}
                          name="familyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Family Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select family type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {familyTypeOptions.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Family Values */}
                        <FormField
                          control={familyForm.control}
                          name="familyValues"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Family Values</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select family values" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {familyValuesOptions.map((value) => (
                                    <SelectItem key={value} value={value}>{value}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Family Affluence */}
                        <FormField
                          control={familyForm.control}
                          name="familyAffluence"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Family Affluence</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select family affluence" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {familyAffluenceOptions.map((aff) => (
                                    <SelectItem key={aff} value={aff}>{aff}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Father's Status */}
                        <FormField
                          control={familyForm.control}
                          name="fatherStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Father's Status</FormLabel>
                              <FormControl>
                                <Input placeholder="Employed, Retired, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Mother's Status */}
                        <FormField
                          control={familyForm.control}
                          name="motherStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mother's Status</FormLabel>
                              <FormControl>
                                <Input placeholder="Homemaker, Working, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Siblings */}
                        <FormField
                          control={familyForm.control}
                          name="siblings"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Siblings</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Enter number of siblings" 
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-between gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={goToPreviousTab}
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={familyMutation.isPending}
                        >
                          {familyMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              Save and Continue
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Preferences Form */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Partner Preferences</CardTitle>
                  <CardDescription>
                    Describe what you're looking for in a life partner.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...preferencesForm}>
                    <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Basic Preferences</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Age Range */}
                          <div className="space-y-4">
                            <FormField
                              control={preferencesForm.control}
                              name="minAge"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Minimum Age</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="Minimum age" 
                                      {...field}
                                      value={field.value || ""}
                                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <FormField
                              control={preferencesForm.control}
                              name="maxAge"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Maximum Age</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="Maximum age" 
                                      {...field}
                                      value={field.value || ""}
                                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {/* Height Range */}
                          <div className="space-y-4">
                            <FormField
                              control={preferencesForm.control}
                              name="minHeight"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Minimum Height (inches)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="Minimum height" 
                                      {...field}
                                      value={field.value || ""}
                                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    5ft = 60 inches, 6ft = 72 inches
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <FormField
                              control={preferencesForm.control}
                              name="maxHeight"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Maximum Height (inches)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="Maximum height" 
                                      {...field}
                                      value={field.value || ""}
                                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {/* Marital Status */}
                          <FormField
                            control={preferencesForm.control}
                            name="maritalStatus"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Marital Status</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="E.g. Never Married"
                                    value={field.value ? field.value.join(", ") : ""}
                                    onChange={(e) => field.onChange(
                                      e.target.value ? e.target.value.split(",").map(item => item.trim()) : []
                                    )}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Separate multiple values with commas.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Religion */}
                          <FormField
                            control={preferencesForm.control}
                            name="religion"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Religion</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="E.g. Hindu"
                                    value={field.value ? field.value.join(", ") : ""}
                                    onChange={(e) => field.onChange(
                                      e.target.value ? e.target.value.split(",").map(item => item.trim()) : []
                                    )}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Separate multiple values with commas.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Mother Tongue */}
                          <FormField
                            control={preferencesForm.control}
                            name="motherTongue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Mother Tongue</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="E.g. Odia"
                                    value={field.value ? field.value.join(", ") : ""}
                                    onChange={(e) => field.onChange(
                                      e.target.value ? e.target.value.split(",").map(item => item.trim()) : []
                                    )}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Separate multiple values with commas.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Caste */}
                          <FormField
                            control={preferencesForm.control}
                            name="caste"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Caste</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="E.g. Brahmin, Khandayat"
                                    value={field.value ? field.value.join(", ") : ""}
                                    onChange={(e) => field.onChange(
                                      e.target.value ? e.target.value.split(",").map(item => item.trim()) : []
                                    )}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Separate multiple values with commas.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Professional Preferences</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Education */}
                          <FormField
                            control={preferencesForm.control}
                            name="education"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Education</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="E.g. Bachelor's, Master's"
                                    value={field.value ? field.value.join(", ") : ""}
                                    onChange={(e) => field.onChange(
                                      e.target.value ? e.target.value.split(",").map(item => item.trim()) : []
                                    )}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Separate multiple values with commas.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Occupation */}
                          <FormField
                            control={preferencesForm.control}
                            name="occupation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Occupation</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="E.g. IT Professional, Doctor"
                                    value={field.value ? field.value.join(", ") : ""}
                                    onChange={(e) => field.onChange(
                                      e.target.value ? e.target.value.split(",").map(item => item.trim()) : []
                                    )}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Separate multiple values with commas.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Income */}
                          <FormField
                            control={preferencesForm.control}
                            name="income"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Income Range</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="E.g. ₹5-7 Lakh, ₹7-10 Lakh"
                                    value={field.value ? field.value.join(", ") : ""}
                                    onChange={(e) => field.onChange(
                                      e.target.value ? e.target.value.split(",").map(item => item.trim()) : []
                                    )}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Separate multiple values with commas.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Location */}
                          <FormField
                            control={preferencesForm.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Location</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="E.g. Cuttack, Bhubaneswar"
                                    value={field.value ? field.value.join(", ") : ""}
                                    onChange={(e) => field.onChange(
                                      e.target.value ? e.target.value.split(",").map(item => item.trim()) : []
                                    )}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Separate multiple values with commas.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Specific Requirements */}
                        <FormField
                          control={preferencesForm.control}
                          name="specificRequirements"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Any Specific Requirements</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Any other preferences or requirements" 
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Mention any specific requirements not covered above.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-between gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={goToPreviousTab}
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={preferencesMutation.isPending}
                        >
                          {preferencesMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Complete Profile
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
