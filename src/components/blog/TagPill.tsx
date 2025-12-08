import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TagPillProps {
  tag: string;
  active?: boolean;
  className?: string;
}

export function TagPill({ tag, active = false, className }: TagPillProps) {
  return (
    <Link
      to={`/explore?tag=${tag}`}
      className={cn(
        "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        className
      )}
    >
      {tag}
    </Link>
  );
}
