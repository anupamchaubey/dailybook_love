import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/blog/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import {
  getProfileByUsername,
  getUserEntriesForAuthorPage,
  getMyFollowing,
  sendFollowRequest,
  unfollowUser,
} from "@/lib/api";
import {
  EntryResponse,
  UserProfileResponse,
  UserEntriesResponse,
} from "@/types/api";

export default function AuthorProfile() {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentUsername = localStorage.getItem("dailybook_username");

  // Author profile
  const {
    data: author,
    isLoading: isAuthorLoading,
    isError: isAuthorError,
    error: authorError,
  } = useQuery<UserProfileResponse>({
    queryKey: ["authorProfile", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is missing.");
      return await getProfileByUsername(username);
    },
    enabled: !!username,
  });

  // Author posts
  const {
    data: authorEntriesPage,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useQuery<UserEntriesResponse>({
    queryKey: ["authorEntries", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is missing.");
      return await getUserEntriesForAuthorPage(username, 0, 30);
    },
    enabled: !!username,
  });

  // My following list – used to know if I'm following this author
  const { data: myFollowing } = useQuery<string[]>({
    queryKey: ["myFollowingForAuthor"],
    queryFn: getMyFollowing,
    enabled: !!currentUsername, // only if logged in
  });

  const isOwnProfile =
    author && currentUsername && author.username === currentUsername;

  const isFollowing =
    !!author && !!myFollowing && myFollowing.includes(author.username);

  const authorPosts: EntryResponse[] = authorEntriesPage?.content ?? [];
  const joinedDate = author ? format(new Date(author.joinedAt), "MMMM yyyy") : "";
  const storiesCount = authorEntriesPage?.totalElements ?? authorPosts.length;

  const followMutation = useMutation({
    mutationFn: () =>
      author ? sendFollowRequest(author.username) : Promise.resolve(null),
    onSuccess: () => {
      toast({
        title: "Follow request sent",
        description: "You will see more from this writer.",
      });
      queryClient.invalidateQueries({ queryKey: ["myFollowingForAuthor"] });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Could not follow",
        description: err?.message ?? "Please try again.",
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () =>
      author ? unfollowUser(author.username) : Promise.resolve(null),
    onSuccess: () => {
      toast({
        title: "Unfollowed",
      });
      queryClient.invalidateQueries({ queryKey: ["myFollowingForAuthor"] });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Could not unfollow",
        description: err?.message ?? "Please try again.",
      });
    },
  });

  if (isAuthorLoading || !author) {
    if (isAuthorError) {
      return (
        <Layout>
          <div className="container py-24 text-center">
            <h1 className="font-serif text-4xl font-bold mb-4">
              Author not found
            </h1>
            <p className="text-muted-foreground mb-8">
              {(authorError as Error)?.message ??
                "We could not find the writer you are looking for."}
            </p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </Layout>
      );
    }
    return (
      <Layout>
        <div className="container py-24 text-center">
          <p className="text-muted-foreground">Loading author...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Back Button */}
        <div className="container pt-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to stories
            </Link>
          </Button>
        </div>

        {/* Profile Header */}
        <header className="container py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28">
                <AvatarImage
                  src={author.profilePicture || undefined}
                  alt={author.username}
                />
                <AvatarFallback className="text-3xl">
                  {author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1">
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                  {author.username}
                </h1>
                {author.bio && (
                  <p className="text-muted-foreground text-lg mb-4 max-w-xl mx-auto sm:mx-0">
                    {author.bio}
                  </p>
                )}
                <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {joinedDate}
                  </span>
                  <span>{storiesCount} stories</span>
                </div>
              </div>
              {!isOwnProfile && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  disabled={followMutation.isLoading || unfollowMutation.isLoading}
                  onClick={() =>
                    isFollowing
                      ? unfollowMutation.mutate()
                      : followMutation.mutate()
                  }
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Author's Posts */}
        <section className="container pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-8 pb-4 border-b border-border">
              Stories by {author.username}
            </h2>
            {isPostsLoading ? (
              <p className="text-center text-muted-foreground py-8">
                Loading stories...
              </p>
            ) : isPostsError ? (
              <p className="text-center text-destructive py-8">
                {(postsError as Error)?.message ??
                  "Failed to load stories by this author."}
              </p>
            ) : authorPosts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No stories published yet.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {authorPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
