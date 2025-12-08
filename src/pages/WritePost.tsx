import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ImagePlus, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Visibility } from "@/types/api";

export default function WritePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [isPublishing, setIsPublishing] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags([...tags, tag]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsPublishing(false);
    // Would redirect to the published post
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <span className="font-serif text-xl font-bold text-foreground">
              Inkwell
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={visibility}
              onValueChange={(value: Visibility) => setVisibility(value)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="FOLLOWERS_ONLY">Followers Only</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handlePublish}
              disabled={!title.trim() || !content.trim() || isPublishing}
            >
              {isPublishing ? (
                "Publishing..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Cover Image */}
          <div className="mb-8">
            <button className="w-full h-48 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm">Add a cover image</span>
            </button>
          </div>

          {/* Title */}
          <Input
            type="text"
            placeholder="Your story title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-0 bg-transparent font-serif text-4xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0 mb-6"
          />

          {/* Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {tags.length < 5 && (
                <Input
                  type="text"
                  placeholder="Add tags (press Enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="border-0 bg-transparent w-40 px-0 text-sm focus-visible:ring-0"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Add up to 5 tags to help readers find your story
            </p>
          </div>

          {/* Content */}
          <Textarea
            placeholder="Tell your story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] border-0 bg-transparent font-serif text-lg leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0 resize-none"
          />
        </div>
      </main>
    </div>
  );
}
