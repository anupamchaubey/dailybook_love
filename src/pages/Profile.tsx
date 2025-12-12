import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getMyProfile, updateMyProfile, getStoredToken } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function Profile(): JSX.Element {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mountedRef = useRef(true);

  const token = getStoredToken();

  // redirect safely in useEffect (NEVER during render)
  useEffect(() => {
    mountedRef.current = true;

    if (!token) {
      navigate("/login", { replace: true });
    }

    return () => {
      mountedRef.current = false;
    };
  }, [token, navigate]);

  // fetch profile only when token exists
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
    enabled: Boolean(token),
  });

  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  // file state + preview
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (data) {
      setBio(data.bio ?? "");
      setProfilePicture(data.profilePicture ?? "");
      // if user already has a profile picture, show it as preview initially
      setPreviewUrl(data.profilePicture ?? null);
    }
  }, [data]);

  // cleanup preview object URLs on unmount / file change
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // error extraction helper
  const getErrorMessage = (err: unknown): string => {
    const e = err as any;
    if (e?.response?.data?.message) return e.response.data.message;
    if (e?.message) return e.message;
    return "Something went wrong.";
  };

  // Cloudinary upload (unsigned preset)
  async function uploadToCloudinary(fileToUpload: File) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary is not configured (VITE_CLOUDINARY_ variables).");
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const fd = new FormData();
    fd.append("file", fileToUpload);
    fd.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(url, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `Cloudinary upload failed with ${res.status}`);
    }

    const json = await res.json();
    // Cloudinary returns secure_url
    if (!json.secure_url) {
      throw new Error("Cloudinary did not return an image URL");
    }
    return json.secure_url as string;
  }

  const mutation = useMutation({
    mutationFn: (payload: { bio: string; profilePicture: string }) =>
      updateMyProfile(payload),
    onSuccess: () => {
      toast({ title: "Profile updated" });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      void refetchProfile();
      // clear selected file after success
      setFile(null);
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: getErrorMessage(err),
      });
    },
  });

  if (!token) {
    // We are navigating away — avoid rendering UI
    return null;
  }

  return (
    <Layout>
      <div className="container py-12 max-w-xl mx-auto">
        <h1 className="font-serif text-3xl font-bold mb-6">My profile</h1>

        {isLoading ? (
          <p className="text-muted-foreground">Loading profile...</p>
        ) : isError || !data ? (
          <p className="text-destructive">
            {(error as Error)?.message ?? "Failed to load profile."}
          </p>
        ) : (
          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              // if a file is selected, upload it first
              try {
                setIsUploading(true);
                let uploadedUrl = profilePicture;

                if (file) {
                  try {
                    const url = await uploadToCloudinary(file);
                    uploadedUrl = url;
                    toast({ title: "Image uploaded", description: "Profile image uploaded successfully." });
                  } catch (err) {
                    toast({
                      variant: "destructive",
                      title: "Image upload failed",
                      description: getErrorMessage(err),
                    });
                    setIsUploading(false);
                    return;
                  }
                }

                // call mutation with bio and final profile picture URL
                mutation.mutate({ bio, profilePicture: uploadedUrl ?? "" });
              } finally {
                setIsUploading(false);
              }
            }}
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={previewUrl ? previewUrl : undefined}
                />
                <AvatarFallback>
                  {data.username?.charAt(0)?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{data.username}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Profile picture</label>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(ev) => {
                      const f = ev.target.files?.[0] ?? null;
                      setFile(f);
                      if (f) {
                        // create local preview and revoke previous blob URL
                        if (previewUrl && previewUrl.startsWith("blob:")) {
                          URL.revokeObjectURL(previewUrl);
                        }
                        const blobUrl = URL.createObjectURL(f);
                        setPreviewUrl(blobUrl);
                      } else {
                        // if cleared, revert to saved profile picture from backend
                        setPreviewUrl(data.profilePicture ?? null);
                      }
                    }}
                    disabled={mutation.isLoading || isUploading}
                  />
                  <span className="px-3 py-2 rounded-md bg-secondary/30 hover:bg-secondary/40 text-sm">
                    Choose file
                  </span>
                </label>

                <span className="text-sm text-muted-foreground">
                  or paste an image URL below
                </span>
              </div>

              <Input
                value={profilePicture}
                onChange={(e) => {
                  setProfilePicture(e.target.value);
                  // if user typed a URL, update preview
                  const val = e.target.value;
                  if (val) {
                    // revoke previous blob preview
                    if (previewUrl && previewUrl.startsWith("blob:")) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    setPreviewUrl(val);
                    // clear any selected file because user entered URL
                    setFile(null);
                  } else {
                    setPreviewUrl(data.profilePicture ?? null);
                  }
                }}
                disabled={mutation.isLoading || isUploading}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                disabled={mutation.isLoading || isUploading}
                placeholder="Tell readers a little about yourself..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={mutation.isLoading || isUploading}
              >
                {mutation.isLoading || isUploading ? "Saving..." : "Save changes"}
              </Button>
              {file && (
                <div className="text-sm text-muted-foreground">
                  Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
