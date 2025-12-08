import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { EntryResponse } from "@/types/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  post: EntryResponse;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  const excerpt =
    post.content.length > 180
      ? post.content.substring(0, 180) + "..."
      : post.content;

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-lg bg-card shadow-md hover:shadow-hover transition-all duration-300">
        {post.imageUrls[0] && (
          <Link to={`/post/${post.id}`} className="block aspect-[16/9] overflow-hidden">
            <img
              src={post.imageUrls[0]}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        )}
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Link to={`/post/${post.id}`}>
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>
          <div className="flex items-center justify-between">
            <Link
              to={`/author/${post.authorUsername}`}
              className="flex items-center gap-3 group/author"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={post.authorProfilePicture} alt={post.authorUsername} />
                <AvatarFallback>
                  {post.authorUsername.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground group-hover/author:text-primary transition-colors">
                  {post.authorUsername}
                </p>
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
              </div>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex gap-6 py-6 border-b border-border last:border-b-0">
      <div className="flex-1 min-w-0">
        <Link
          to={`/author/${post.authorUsername}`}
          className="flex items-center gap-2 mb-3 group/author"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.authorProfilePicture} alt={post.authorUsername} />
            <AvatarFallback>
              {post.authorUsername.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground group-hover/author:text-foreground transition-colors">
            {post.authorUsername}
          </span>
        </Link>
        <Link to={`/post/${post.id}`}>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2 hidden sm:block">
          {excerpt}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{timeAgo}</span>
          {post.tags[0] && (
            <Badge variant="secondary" className="text-xs">
              {post.tags[0]}
            </Badge>
          )}
        </div>
      </div>
      {post.imageUrls[0] && (
        <Link
          to={`/post/${post.id}`}
          className="shrink-0 w-28 h-28 sm:w-36 sm:h-28 overflow-hidden rounded-md"
        >
          <img
            src={post.imageUrls[0]}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
    </article>
  );
}
