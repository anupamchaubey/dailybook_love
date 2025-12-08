import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow, format } from "date-fns";
import { ArrowLeft, Share2, Bookmark, Heart, Trash2 } from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PostCard } from "@/components/blog/PostCard";
import { useToast } from "@/components/ui/use-toast";

import {
  getEntryById,
  getProfileByUsername,
  getPublicEntries,
  deleteEntry,
  getStoredToken,
} from "@/lib/api";
import { EntryResponse, UserProfileResponse } from "@/types/api";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // 1. Load the post
  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) throw new Error("Post id is missing.");
      return await getEntryById(id);
    },
    enabled: !!id,
  });

  // 2. Load author profile once post is known
  const authorUsername = post?.authorUsername;

  const {
    data: author,
    isLoading: isAuthorLoading,
  } = useQuery<UserProfileResponse>({
    queryKey: ["authorProfile", authorUsername],
    queryFn: async () => {
      if (!authorUsername) throw new Error("Author username is missing.");
      return await getProfileByUsername(authorUsername);
    },
    enabled: !!authorUsername,
  });

  // 3. Load some public posts for "More like this"
  const { data: publicPage } = useQuery({
    queryKey: ["relatedPosts"],
    queryFn: () => getPublicEntries(0, 20),
  });

  const relatedPosts: EntryResponse[] = useMemo(() => {
    if (!post || !publicPage) return [];
    const tags = new Set(post.tags);
    return publicPage.content
      .filter((p) => p.id !== post.id && p.tags.some((t) => tags.has(t)))
      .slice(0, 2);
  }, [post, publicPage]);

  // 4. Loading & error states
  if (isPostLoading) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <p className="text-lg text-muted-foreground">Loading story...</p>
        </div>
      </Layout>
    );
  }

  if (isPostError || !post) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-8">
            {(postError as Error)?.message ?? "The story you are looking for does not exist."}
          </p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // 5. Derived display values
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });
  const publishDate = format(new Date(post.createdAt), "MMMM d, yyyy");
  const paragraphs = post.content.split("\n\n");

  const currentUsername = localStorage.getItem("dailybook_username");
  const isOwner = currentUsername && currentUsername === post.authorUsername;

  const handleDelete = async () => {
    if (!isOwner) return;
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      const token = getStoredToken();
      if (!token) {
        toast({
          variant: "destructive",
          title: "Not authenticated",
          description: "Please sign in again to manage your posts.",
        });
        navigate("/login");
        return;
      }

      await deleteEntry(post.id);

      toast({
        title: "Post deleted",
        description: "Your story has been removed.",
      });

      navigate("/", { replace: true });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: err?.message ?? "Could not delete this story.",
      });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.slice(0, 120),
          url,
        });
      } catch {
        // user cancelled, ignore
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Post link copied to clipboard.",
      });
    }
  };

  return (
    <Layout>
      <article className="animate-fade-in">
        {/* Back Button */}
        <div className="container pt-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to stories
            </Link>
          </Button>
        </div>

        {/* Header */}
        <header className="container py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <Link
                to={`/author/${post.authorUsername}`}
                className="flex items-center gap-3 group"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={post.authorProfilePicture}
                    alt={post.authorUsername}
                  />
                <AvatarFallback>
                    {post.authorUsername.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {post.authorUsername}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {publishDate} · {timeAgo}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.imageUrls[0] && (
          <div className="container pb-8">
            <div className="max-w-4xl mx-auto">
              <img
                src={post.imageUrls[0]}
                alt={post.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="container pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-foreground leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between py-8 border-t border-b border-border mt-12">
              <div className="flex items-center gap-2">
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Author Bio */}
            {author && (
              <div className="bg-card rounded-lg p-6 mt-8 border border-border">
                <div className="flex items-start gap-4">
                  <Link to={`/author/${author.username}`}>
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={author.profilePicture || undefined}
                        alt={author.username}
                      />
                      <AvatarFallback className="text-xl">
                        {author.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        to={`/author/${author.username}`}
                        className="font-serif text-lg font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {author.username}
                      </Link>
                      {/* Follow button wiring will be added when we do follow APIs */}
                      <Button variant="outline" size="sm" disabled={isAuthorLoading}>
                        Follow
                      </Button>
                    </div>
                    {author.bio && (
                      <p className="text-muted-foreground">{author.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-card border-t border-border">
            <div className="container py-12">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">
                More like this
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <PostCard key={relatedPost.id} post={relatedPost} featured />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}
