import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/blog/PostCard";
import { TagPill } from "@/components/blog/TagPill";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { Button } from "@/components/ui/button";

import {
  getFeedEntries,
  getPublicEntries,
  getMyFollowing,
  getStoredToken,
  searchUsers,
} from "@/lib/api";
import { EntryResponse, UserProfileResponse } from "@/types/api";

const popularTags = [
  "lifestyle",
  "technology",
  "photography",
  "travel",
  "food",
  "wellness",
];

const Index = () => {
  // ✅ real auth state
  const isLoggedIn = !!getStoredToken();
  const currentUsername =
    (typeof window !== "undefined" &&
      localStorage.getItem("dailybook_username")) ||
    undefined;

  // POSTS
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["homeEntries"],
    queryFn: async () => {
      const token = getStoredToken();
      if (token) {
        try {
          return await getFeedEntries(0, 20);
        } catch {
          // fallback if feed fails
        }
      }
      return await getPublicEntries(0, 20);
    },
  });

  const entries: EntryResponse[] = data?.content ?? [];
  const featuredPost = entries[0];
  const recentPosts = entries.slice(1);

  // SUGGESTED WRITERS
  const { data: suggestedUsers, isLoading: isUsersLoading } = useQuery<
    UserProfileResponse[]
  >({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      return await searchUsers("");
    },
  });

  // WHO I FOLLOW (for "Following" state in cards)
  const { data: myFollowingUsernames } = useQuery<string[]>({
    queryKey: ["myFollowingSidebar"],
    queryFn: getMyFollowing,
    enabled: isLoggedIn,
  });

  const followingSet = new Set(myFollowingUsernames ?? []);

  const filteredSuggestedUsers =
    suggestedUsers?.filter((u) => u.username !== currentUsername) ?? [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
              Stories that matter,
              <br />
              <span className="text-primary">written with care</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover thoughtful perspectives from writers around the world.
              Share your own stories and connect with a community that values
              depth over clicks.
            </p>

            {/* 🔐 Hero buttons depend on auth */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                <>
                  <Button size="lg" asChild>
                    <Link to="/write">
                      Write a Story
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/explore">Explore Stories</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Start Writing
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/explore">Explore Stories</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="container py-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">
          Featured Story
        </h2>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading stories...</p>
        ) : isError ? (
          <p className="text-center text-destructive">
            {(error as Error)?.message ?? "Failed to load stories."}
          </p>
        ) : !featuredPost ? (
          <p className="text-center text-muted-foreground">
            No stories published yet.
          </p>
        ) : (
          <PostCard post={featuredPost} featured />
        )}
      </section>

      {/* Main Grid */}
      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Posts list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Recent Stories
              </h2>
              <Button variant="link" asChild>
                <Link to="/explore">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground">
                Loading stories...
              </p>
            ) : recentPosts.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No recent stories to show.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-10">
            {/* Popular Tags */}
            <div>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-4">
                Discover Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
            </div>

            {/* Writers to follow */}
            <div>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-4">
                Writers to Follow
              </h3>
              {isUsersLoading ? (
                <p className="text-muted-foreground">Loading writers...</p>
              ) : !filteredSuggestedUsers.length ? (
                <p className="text-muted-foreground">No writers found.</p>
              ) : (
                <div className="space-y-3">
                  {filteredSuggestedUsers.slice(0, 5).map((user) => (
                    <AuthorCard
                      key={user.id}
                      author={user}
                      isFollowing={followingSet.has(user.username)}
                    />
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Bottom CTA – also depends on auth */}
      <section className="border-t border-border bg-card">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            {isLoggedIn ? (
              <>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to write your next story?
                </h2>
                <p className="text-muted-foreground mb-8">
                  You are signed in. Jump back into your writing flow.
                </p>
                <Button size="lg" asChild>
                  <Link to="/write">
                    Write Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to share your story?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Join thousands of writers who have found their voice on
                  DailyBook. It is free to get started.
                </p>
                <Button size="lg" asChild>
                  <Link to="/register">
                    Create Your Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
