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

  useEffect(() => {
    if (data) {
      setBio(data.bio ?? "");
      setProfilePicture(data.profilePicture ?? "");
    }
  }, [data]);

  // error extraction helper
  const getErrorMessage = (err: unknown): string => {
    const e = err as any;
    if (e?.response?.data?.message) return e.response.data.message;
    if (e?.message) return e.message;
    return "Something went wrong.";
  };

  const mutation = useMutation({
    mutationFn: () => updateMyProfile({ bio, profilePicture }),
    onSuccess: () => {
      toast({ title: "Profile updated" });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      void refetchProfile();
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
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={profilePicture ? profilePicture : undefined}
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
              <label className="text-sm font-medium">Profile picture URL</label>
              <Input
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                disabled={mutation.isLoading}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                disabled={mutation.isLoading}
                placeholder="Tell readers a little about yourself..."
              />
            </div>

            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        )}
      </div>
    </Layout>
  );
}
