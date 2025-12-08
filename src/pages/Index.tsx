import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/blog/PostCard";
import { TagPill } from "@/components/blog/TagPill";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { Button } from "@/components/ui/button";
import { mockEntries, mockUsers } from "@/data/mockData";

const popularTags = [
  "lifestyle",
  "technology",
  "photography",
  "travel",
  "food",
  "wellness",
];

const Index = () => {
  const featuredPost = mockEntries[0];
  const recentPosts = mockEntries.slice(1);

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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/register">
                  Start Writing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/explore">Explore Stories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Featured Story
          </h2>
        </div>
        <div className="animate-slide-up">
          <PostCard post={featuredPost} featured />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Posts List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Recent Stories
              </h2>
              <Button variant="link" asChild>
                <Link to="/explore">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {recentPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-10">
            {/* Popular Tags */}
            <div>
              <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Discover Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
            </div>

            {/* Suggested Writers */}
            <div>
              <h3 className="font-sans text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Writers to Follow
              </h3>
              <div className="space-y-3">
                {mockUsers.map((user) => (
                  <AuthorCard key={user.id} author={user} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to share your story?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of writers who've found their voice on Inkwell.
              It's free to get started.
            </p>
            <Button size="lg" asChild>
              <Link to="/register">
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
