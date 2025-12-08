import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getMyEntries, deleteEntry, getStoredToken } from "@/lib/api";
import { EntryResponse } from "@/types/api";
import { Link, useNavigate } from "react-router-dom";

export default function MyPosts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const token = getStoredToken();
  if (!token) {
    // very simple guard – redirect out of the component
    navigate("/login");
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myEntries"],
    queryFn: getMyEntries,
  });

  const entries: EntryResponse[] = data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEntry(id),
    onSuccess: () => {
      toast({ title: "Post deleted" });
      queryClient.invalidateQueries({ queryKey: ["myEntries"] });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: err?.message ?? "Please try again.",
      });
    },
  });

  return (
    <Layout>
      <div className="container py-12 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            My Stories
          </h1>
          <Button asChild>
            <Link to="/write">Write new</Link>
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading your stories...</p>
        ) : isError ? (
          <p className="text-destructive">
            {(error as Error)?.message ?? "Failed to load your stories."}
          </p>
        ) : entries.length === 0 ? (
          <p className="text-muted-foreground">
            You have not written any stories yet.
          </p>
        ) : (
          <div className="space-y-4">
            {entries.map((post) => (
              <div key={post.id} className="relative">
                <PostCard post={post} />
                <div className="absolute right-0 top-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/post/${post.id}`}>View</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this story?"
                        )
                      ) {
                        deleteMutation.mutate(post.id);
                      }
                    }}
                    disabled={deleteMutation.isLoading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
