import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getMyFollowing, unfollowUser } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

export default function Following() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["following"],
    queryFn: getMyFollowing,
  });

  const following = data ?? [];
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const unfollowMutation = useMutation({
    mutationFn: (username: string) => unfollowUser(username),
    onSuccess: (_, username) => {
      toast({
        title: "Unfollowed",
        description: `You are no longer following ${username}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Failed to unfollow",
        description: err?.message ?? "Please try again.",
      });
    },
  });

  return (
    <Layout>
      <div className="container py-12 max-w-xl mx-auto">
        <h1 className="font-serif text-3xl font-bold mb-6">You follow</h1>

        {isLoading ? (
          <p className="text-muted-foreground">Loading following...</p>
        ) : isError ? (
          <p className="text-destructive">
            {(error as Error)?.message ?? "Failed to load following list."}
          </p>
        ) : following.length === 0 ? (
          <p className="text-muted-foreground">
            You are not following anyone yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {following.map((username) => (
              <li
                key={username}
                className="flex items-center justify-between border border-border rounded-md px-4 py-2"
              >
                <Link
                  to={`/author/${username}`}
                  className="font-medium hover:text-primary"
                >
                  {username}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => unfollowMutation.mutate(username)}
                  disabled={unfollowMutation.isLoading}
                >
                  Unfollow
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
