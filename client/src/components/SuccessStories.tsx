import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HeartHandshake, Quote } from "lucide-react";

type SuccessStory = {
  id: number;
  user1Id: number;
  user2Id: number;
  storyContent: string;
  createdAt: string;
  marriageDate: string;
  photo: string | null;
  isPublished: boolean;
  user1Name: string;
  user2Name: string;
};

export function SuccessStories() {
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["/api/success-stories"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/success-stories");
      if (!res.ok) {
        throw new Error("Failed to fetch success stories");
      }
      return (await res.json()) as SuccessStory[];
    },
  });

  if (isLoading) {
    return <SuccessStoriesLoading />;
  }

  if (stories.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-8 text-center">
        <HeartHandshake className="h-12 w-12 mx-auto text-muted-foreground/70" />
        <h3 className="mt-4 text-xl font-semibold">Be the First Success Story!</h3>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          We're waiting to celebrate your happy union. Find your match on Bahaghar and share your story with us.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => (
        <SuccessStoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}

function SuccessStoryCard({ story }: { story: SuccessStory }) {
  // Format marriage date
  const marriageDate = new Date(story.marriageDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[2/1] bg-gradient-to-r from-primary/20 to-primary/10">
        {story.photo ? (
          <img
            src={story.photo}
            alt={`${story.user1Name} and ${story.user2Name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <HeartHandshake className="w-12 h-12 text-primary/40" />
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarFallback>{story.user1Name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xl font-medium">❤️</span>
          <Avatar>
            <AvatarFallback>{story.user2Name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-right text-sm text-muted-foreground">
            Married on {marriageDate}
          </div>
        </div>
        <div className="relative">
          <Quote className="absolute -top-2 -left-1 w-4 h-4 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground pl-4 pr-2 line-clamp-4">
            {story.storyContent}
          </p>
        </div>
        <div className="mt-3 text-sm font-medium">
          - {story.user1Name} & {story.user2Name}
        </div>
      </CardContent>
    </Card>
  );
}

function SuccessStoriesLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-[2/1] bg-muted animate-pulse" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <span className="text-xl font-medium">❤️</span>
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 h-4 bg-muted animate-pulse rounded ml-auto w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-full" />
              <div className="h-4 bg-muted animate-pulse rounded w-full" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}