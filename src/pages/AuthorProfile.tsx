import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/blog/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockEntries, mockUsers } from "@/data/mockData";

export default function AuthorProfile() {
  const { username } = useParams<{ username: string }>();
  const author = mockUsers.find((u) => u.username === username);
  const authorPosts = mockEntries.filter((p) => p.authorUsername === username);

  if (!author) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Author not found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the writer you're looking for.
          </p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const joinedDate = format(new Date(author.joinedAt), "MMMM yyyy");

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
                <AvatarImage src={author.profilePicture || undefined} alt={author.username} />
                <AvatarFallback className="text-3xl">
                  {author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1">
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                  {author.username}
                </h1>
                {author.bio && (
                  <p className="text-muted-foreground text-lg mb-4 max-w-xl">
                    {author.bio}
                  </p>
                )}
                <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {joinedDate}
                  </span>
                  <span>{authorPosts.length} stories</span>
                </div>
              </div>
              <Button variant="default">Follow</Button>
            </div>
          </div>
        </header>

        {/* Author's Posts */}
        <section className="container pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-8 pb-4 border-b border-border">
              Stories by {author.username}
            </h2>
            {authorPosts.length === 0 ? (
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
