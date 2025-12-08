import { Link } from "react-router-dom";
import { UserProfileResponse } from "@/types/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AuthorCardProps {
  author: UserProfileResponse;
  showBio?: boolean;
}

export function AuthorCard({ author, showBio = true }: AuthorCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
      <Link to={`/author/${author.username}`}>
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.profilePicture || undefined} alt={author.username} />
          <AvatarFallback className="text-lg">
            {author.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          to={`/author/${author.username}`}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {author.username}
        </Link>
        {showBio && author.bio && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {author.bio}
          </p>
        )}
      </div>
      <Button variant="outline" size="sm">
        Follow
      </Button>
    </div>
  );
}
