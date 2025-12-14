import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/blog/PostCard";
import { Input } from "@/components/ui/input";
import {
  getPublicEntries,
  searchPublicEntries,
} from "@/lib/api";
import { EntryResponse } from "@/types/api";

const allTags = [
  "all",
  "lifestyle",
  "technology",
  "photography",
  "travel",
  "food",
  "wellness",
  "digital-wellness",
  "nature",
  "cooking",
];

export default function Explore() {
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["exploreEntries", searchQuery, selectedTag],
    queryFn: async () => {
      const q = searchQuery.trim();
      if (q.length > 0) {
        return searchPublicEntries(q, 0, 30);
      }
      return getPublicEntries(0, 30);
    },
  });

  const entries: EntryResponse[] = data?.content ?? [];

  /**
   * 1️⃣ Filter by tag (client-side)
   * 2️⃣ Deduplicate by post.id (defensive UI safety)
   */
  const visiblePosts = useMemo(() => {
    const filtered =
      selectedTag === "all"
        ? entries
        : entries.filter((post) => post.tags.includes(selectedTag));

    return Array.from(
      new Map(filtered.map((post) => [post.id, post])).values()
    );
  }, [entries, selectedTag]);

  return (
    <Layout>
      <div className="container py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
            Explore Stories
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover stories from writers on any topic that interests you.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search stories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedTag("all"); // 🔑 prevent search+tag conflicts
            }}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-border">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tag === "all" ? "All Topics" : tag}
            </button>
          ))}
        </div>

        {/* States */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Loading stories...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <p className="text-lg text-destructive">
              {(error as Error)?.message ?? "Failed to load stories."}
            </p>
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No stories found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map((post, index) => (
              <div
                key={post.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PostCard post={post} featured />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
