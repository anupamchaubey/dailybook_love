import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import { Visibility, EntryRequest } from "@/types/api";
import { createEntry } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function WritePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [isPublishing, setIsPublishing] = useState(false);

  // cover image state
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  // ------------------------
  // Tag handlers
  // ------------------------
  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags((prev) => [...prev, tag]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // ------------------------
  // Cover image handlers
  // ------------------------
  const handleCoverClick = () => {
    fileInputRef.current?.click();
  };

  const handleCoverFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);

      // ⬇️ client-side Cloudinary upload
      // configure via environment variables
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
      const uploadPreset = import.meta.env
        .VITE_CLOUDINARY_UPLOAD_PRESET as string;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      const url = data.secure_url as string;

      setCoverImageUrl(url);
      toast({
        title: "Cover image uploaded",
        description: "Your cover image has been added.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Upload failed",
        description: "Could not upload cover image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingCover(false);
      // reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveCover = () => {
    setCoverImageUrl(null);
  };

  // ------------------------
  // Publish
  // ------------------------
  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      setIsPublishing(true);

      const payload: EntryRequest = {
        title: title.trim(),
        content: content.trim(),
        tags,
        visibility,
        imageUrls: coverImageUrl ? [coverImageUrl] : [],
      };

      const entry = await createEntry(payload);

      toast({
        title: "Story published",
        description: "Your story is now live on DailyBook.",
      });

      navigate(`/post/${entry.id}`);
    } catch (err) {
      console.error(err);
      toast({
        title: "Publishing failed",
        description: "Something went wrong while publishing your story.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
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
              DailyBook
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={visibility}
              onValueChange={(value: Visibility) => setVisibility(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="FOLLOWERS_ONLY">Followers Only</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handlePublish}
              disabled={
                !title.trim() || !content.trim() || isPublishing || isUploadingCover
              }
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

      {/* Hidden file input for cover */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverFileChange}
      />

      {/* Editor */}
      <main className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Cover Image */}
          <div className="mb-8">
            <button
              type="button"
              onClick={handleCoverClick}
              className="w-full h-48 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground relative overflow-hidden"
            >
              {coverImageUrl ? (
                <>
                  <img
                    src={coverImageUrl}
                    alt="Cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-sm text-white">
                      Click to change cover image
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-sm">
                    {isUploadingCover ? "Uploading..." : "Add a cover image"}
                  </span>
                </>
              )}
            </button>
            {coverImageUrl && (
              <button
                type="button"
                onClick={handleRemoveCover}
                className="mt-2 text-xs text-muted-foreground hover:text-destructive"
              >
                <X className="inline h-3 w-3 mr-1" />
                Remove cover image
              </button>
            )}
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
                    type="button"
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
