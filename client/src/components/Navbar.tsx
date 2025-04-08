import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreditCard, Heart, LogOut, Menu, MessageSquare, Search, Settings, User, Users } from "lucide-react";
import { User as SelectUser } from "@shared/schema";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { NotificationCenter } from "./NotificationCenter";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Fetch user data directly
  const { data: user } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  const { data: profileData } = useQuery({
    queryKey: ["/api/my-profile"],
    enabled: !!user,
  });
  
  // Create logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
    },
  });
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const NavLinks = () => (
    <>
      <Link href="/">
        <Button variant={location === "/" ? "default" : "ghost"} className="gap-2">
          <Users className="h-4 w-4" />
          <span>Home</span>
        </Button>
      </Link>
      <Link href="/search">
        <Button variant={location === "/search" ? "default" : "ghost"} className="gap-2">
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Button>
      </Link>
      <Link href="/matches">
        <Button variant={location === "/matches" ? "default" : "ghost"} className="gap-2">
          <Heart className="h-4 w-4" />
          <span>Matches</span>
        </Button>
      </Link>
    </>
  );
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="px-2">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    OdiaMatrimony
                  </span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant={location === "/" ? "default" : "ghost"} className="w-full justify-start gap-2">
                    <Users className="h-4 w-4" />
                    <span>Home</span>
                  </Button>
                </Link>
                <Link href="/search" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant={location === "/search" ? "default" : "ghost"} className="w-full justify-start gap-2">
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </Button>
                </Link>
                <Link href="/matches" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant={location === "/matches" ? "default" : "ghost"} className="w-full justify-start gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Matches</span>
                  </Button>
                </Link>
                <Link href="/subscription" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant={location === "/subscription" ? "default" : "ghost"} className="w-full justify-start gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Subscription</span>
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hidden md:block">
              OdiaMatrimony
            </span>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent md:hidden">
              OM
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            <NavLinks />
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Only show notification center if user is logged in */}
          {user && <NotificationCenter />}
          
          <Link href="/subscription">
            <Button variant={location === "/subscription" ? "default" : "ghost"} size="sm" className="hidden md:flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span>Subscription</span>
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  {profileData?.profile?.profilePicture ? (
                    <AvatarImage src={profileData.profile.profilePicture} alt={user?.username || ""} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                {profileData?.profile ? (
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{profileData.profile.fullName}</div>
                    <div className="text-muted-foreground text-xs">{user?.username}</div>
                  </div>
                ) : (
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-muted-foreground text-xs">Complete your profile</div>
                  </div>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user?.id}`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/matches" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Interests</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
