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

/* =====================================================
   Props
===================================================== */
interface WritePostProps {
  editMode?: boolean;
  initialData?: {
    title: string;
    content: string;
    tags: string[];
    visibility: Visibility;
    imageUrls?: string[];
  };
  onSubmit?: (payload: EntryRequest) => Promise<void> | void;
}

export default function WritePost({
  editMode = false,
  initialData,
  onSubmit,
}: WritePostProps) {
  /* =====================================================
     State
  ===================================================== */
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [visibility, setVisibility] = useState<Visibility>(
    initialData?.visibility ?? "PUBLIC"
  );

  const [isPublishing, setIsPublishing] = useState(false);

  // cover image
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initialData?.imageUrls?.[0] ?? null
  );
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  /* =====================================================
     Tag handlers
  ===================================================== */
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

  /* =====================================================
     Cover image handlers
  ===================================================== */
  const handleCoverClick = () => {
    fileInputRef.current?.click();
  };

  const handleCoverFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
      const uploadPreset = import.meta.env
        .VITE_CLOUDINARY_UPLOAD_PRESET as string;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      setCoverImageUrl(data.secure_url);

      toast({
        title: "Cover image uploaded",
      });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: "Could not upload cover image.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingCover(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveCover = () => {
    setCoverImageUrl(null);
  };

  /* =====================================================
     Publish / Update
  ===================================================== */
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

      if (editMode && onSubmit) {
        await onSubmit(payload);
        toast({ title: "Story updated successfully" });
      } else {
        const entry = await createEntry(payload);
        toast({ title: "Story published" });
        navigate(`/post/${entry.id}`);
        return;
      }
    } catch (err) {
      toast({
        title: editMode ? "Update failed" : "Publish failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  /* =====================================================
     Render
  ===================================================== */
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
              {editMode ? "Edit Story" : "Write Story"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={visibility}
              onValueChange={(value: Visibility) => setVisibility(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="FOLLOWERS_ONLY">
                  Followers Only
                </SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handlePublish}
              disabled={
                !title.trim() ||
                !content.trim() ||
                isPublishing ||
                isUploadingCover
              }
            >
              {isPublishing ? (
                editMode ? "Updating..." : "Publishing..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {editMode ? "Update" : "Publish"}
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hidden file input */}
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
              className="w-full h-48 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition flex items-center justify-center relative overflow-hidden"
            >
              {coverImageUrl ? (
                <img
                  src={coverImageUrl}
                  alt="Cover"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground flex flex-col items-center">
                  <ImagePlus className="h-8 w-8" />
                  <span>Add a cover image</span>
                </div>
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
            placeholder="Your story title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-0 bg-transparent font-serif text-4xl font-bold px-0 mb-6 focus-visible:ring-0"
          />

          {/* Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
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
                  placeholder="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="border-0 bg-transparent w-40 px-0 focus-visible:ring-0"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Up to 5 tags
            </p>
          </div>

          {/* Content */}
          <Textarea
            placeholder="Tell your story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] border-0 bg-transparent font-serif text-lg px-0 focus-visible:ring-0 resize-none"
          />
        </div>
      </main>
    </div>
  );
}
