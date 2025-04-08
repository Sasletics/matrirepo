import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { CompleteProfile } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search as SearchIcon, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState<any>({
    gender: "Female",
    ageRange: [21, 35],
    religion: "Hindu",
    motherTongue: "Odia",
    location: "",
    caste: "",
    maritalStatus: "",
    education: "",
    occupation: "",
  });
  
  const [showFilters, setShowFilters] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  // Get all profiles for searching
  const { data: profiles, isLoading } = useQuery<CompleteProfile[]>({
    queryKey: ["/api/search"],
  });
  
  // Apply filters to the results
  const filteredResults = profiles?.filter(profile => {
    if (!profile.profile) return false;
    
    const p = profile.profile;
    const e = profile.education;
    const c = profile.career;
    
    // Calculate age
    const birthDate = new Date(p.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Gender filter is required
    if (p.gender !== searchParams.gender) return false;
    
    // Age range filter
    if (age < searchParams.ageRange[0] || age > searchParams.ageRange[1]) return false;
    
    // Religion filter
    if (searchParams.religion && p.religion !== searchParams.religion) return false;
    
    // Mother tongue filter
    if (searchParams.motherTongue && p.motherTongue !== searchParams.motherTongue) return false;
    
    // Location filter (match city, state or country)
    if (searchParams.location && 
        !p.city.toLowerCase().includes(searchParams.location.toLowerCase()) && 
        !p.state.toLowerCase().includes(searchParams.location.toLowerCase()) && 
        !p.country.toLowerCase().includes(searchParams.location.toLowerCase())) {
      return false;
    }
    
    // Caste filter
    if (searchParams.caste && p.caste !== searchParams.caste) return false;
    
    // Marital status filter
    if (searchParams.maritalStatus && p.maritalStatus !== searchParams.maritalStatus) return false;
    
    // Education filter
    if (searchParams.education && e && e.highestEducation !== searchParams.education) return false;
    
    // Occupation filter
    if (searchParams.occupation && c && c.occupation !== searchParams.occupation) return false;
    
    return true;
  });
  
  const handleSearch = () => {
    setIsSearching(true);
    // In a real app this would make a new API request
    setTimeout(() => setIsSearching(false), 500);
  };
  
  const resetFilters = () => {
    setSearchParams({
      gender: "Female",
      ageRange: [21, 35],
      religion: "Hindu",
      motherTongue: "Odia",
      location: "",
      caste: "",
      maritalStatus: "",
      education: "",
      occupation: "",
    });
  };
  
  const updateSearchParam = (key: string, value: any) => {
    setSearchParams((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const casteOptions = [
    "Brahmin", "Khandayat", "Karan", "Chasa", "Gopal", "Gudia",
    "Teli", "Scheduled Caste", "Scheduled Tribe", "Other"
  ];
  
  const educationOptions = [
    "High School", "Diploma", "Bachelor's", "Master's", "Doctorate", "Professional"
  ];
  
  const occupationOptions = [
    "Software Professional", "Doctor", "Engineer", "Teacher", "Business Owner",
    "Government Employee", "Banking Professional", "Lawyer", "Other"
  ];
  
  const maritalStatusOptions = [
    "Never Married", "Divorced", "Widowed", "Separated"
  ];
  
  const renderActiveFilters = () => {
    const filters = [];
    
    if (searchParams.gender) filters.push(`Gender: ${searchParams.gender}`);
    filters.push(`Age: ${searchParams.ageRange[0]}-${searchParams.ageRange[1]}`);
    if (searchParams.religion) filters.push(`Religion: ${searchParams.religion}`);
    if (searchParams.motherTongue) filters.push(`Mother Tongue: ${searchParams.motherTongue}`);
    if (searchParams.location) filters.push(`Location: ${searchParams.location}`);
    if (searchParams.caste) filters.push(`Caste: ${searchParams.caste}`);
    if (searchParams.maritalStatus) filters.push(`Marital Status: ${searchParams.maritalStatus}`);
    if (searchParams.education) filters.push(`Education: ${searchParams.education}`);
    if (searchParams.occupation) filters.push(`Occupation: ${searchParams.occupation}`);
    
    return filters;
  };
  
  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          {/* Search Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Find Your Perfect Match</h1>
            <p className="text-muted-foreground">
              Search through profiles of eligible Odia singles based on your preferences.
            </p>
          </div>
          
          {/* Search Form */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search Filters */}
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Search Filters</CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-8">
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <Accordion type="multiple" defaultValue={["basics", "background", "education"]}>
                    <AccordionItem value="basics">
                      <AccordionTrigger>Basic Details</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Looking for</label>
                          <Select
                            value={searchParams.gender}
                            onValueChange={(value) => updateSearchParam("gender", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Female">Bride (Female)</SelectItem>
                              <SelectItem value="Male">Groom (Male)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm font-medium">Age Range</label>
                            <span className="text-sm text-muted-foreground">
                              {searchParams.ageRange[0]} - {searchParams.ageRange[1]} years
                            </span>
                          </div>
                          <Slider
                            value={searchParams.ageRange}
                            min={18}
                            max={70}
                            step={1}
                            onValueChange={(value) => updateSearchParam("ageRange", value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Marital Status</label>
                          <Select
                            value={searchParams.maritalStatus}
                            onValueChange={(value) => updateSearchParam("maritalStatus", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Any marital status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Any</SelectItem>
                              {maritalStatusOptions.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="background">
                      <AccordionTrigger>Background</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Religion</label>
                          <Select
                            value={searchParams.religion}
                            onValueChange={(value) => updateSearchParam("religion", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select religion" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hindu">Hindu</SelectItem>
                              <SelectItem value="Muslim">Muslim</SelectItem>
                              <SelectItem value="Christian">Christian</SelectItem>
                              <SelectItem value="Sikh">Sikh</SelectItem>
                              <SelectItem value="Jain">Jain</SelectItem>
                              <SelectItem value="Buddhist">Buddhist</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Mother Tongue</label>
                          <Select
                            value={searchParams.motherTongue}
                            onValueChange={(value) => updateSearchParam("motherTongue", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select mother tongue" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Odia">Odia</SelectItem>
                              <SelectItem value="Hindi">Hindi</SelectItem>
                              <SelectItem value="Bengali">Bengali</SelectItem>
                              <SelectItem value="Telugu">Telugu</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Caste</label>
                          <Select
                            value={searchParams.caste}
                            onValueChange={(value) => updateSearchParam("caste", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Any caste" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Any</SelectItem>
                              {casteOptions.map((caste) => (
                                <SelectItem key={caste} value={caste}>{caste}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="location">
                      <AccordionTrigger>Location</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Location</label>
                          <Input
                            placeholder="City, state or country"
                            value={searchParams.location}
                            onChange={(e) => updateSearchParam("location", e.target.value)}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="education">
                      <AccordionTrigger>Education & Career</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Education</label>
                          <Select
                            value={searchParams.education}
                            onValueChange={(value) => updateSearchParam("education", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Any education" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Any</SelectItem>
                              {educationOptions.map((edu) => (
                                <SelectItem key={edu} value={edu}>{edu}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Occupation</label>
                          <Select
                            value={searchParams.occupation}
                            onValueChange={(value) => updateSearchParam("occupation", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Any occupation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Any</SelectItem>
                              {occupationOptions.map((occ) => (
                                <SelectItem key={occ} value={occ}>{occ}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <Button className="w-full" onClick={handleSearch}>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Search Results */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Search Results</CardTitle>
                      <CardDescription>
                        {isLoading ? "Loading profiles..." : `Showing ${filteredResults?.length || 0} profiles`}
                      </CardDescription>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" onClick={toggleFilters} className="lg:hidden flex items-center gap-1">
                        <Filter className="h-4 w-4" />
                        {showFilters ? "Hide Filters" : "Show Filters"}
                        {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Active filters */}
                  {renderActiveFilters().length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {renderActiveFilters().map((filter, index) => (
                          <Badge key={index} variant="secondary">{filter}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardHeader>
                
                <Separator />
                
                <CardContent className="pt-6">
                  {isLoading || isSearching ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                      <span className="ml-2 text-muted-foreground">
                        {isSearching ? "Searching profiles..." : "Loading profiles..."}
                      </span>
                    </div>
                  ) : filteredResults && filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredResults.map((profile) => (
                        <ProfileCard
                          key={profile.user.id}
                          profile={profile}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                      <h3 className="mt-4 text-lg font-medium">No matching profiles found</h3>
                      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                        Try adjusting your search filters to see more results, or check back later for new profiles.
                      </p>
                      <Button className="mt-6" onClick={resetFilters} variant="outline">
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
