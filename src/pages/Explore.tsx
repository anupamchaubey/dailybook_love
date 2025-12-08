import { useState } from "react";
import { Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/blog/PostCard";
import { TagPill } from "@/components/blog/TagPill";
import { Input } from "@/components/ui/input";
import { mockEntries } from "@/data/mockData";

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

  const filteredPosts = mockEntries.filter((post) => {
    const matchesTag =
      selectedTag === "all" || post.tags.includes(selectedTag);
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tags Filter */}
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

        {/* Results */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No stories found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
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
