import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  getPendingFollowRequests,
  approveFollowRequest,
  rejectFollowRequest,
} from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function FollowRequests() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["followRequests"],
    queryFn: getPendingFollowRequests,
  });

  const requests = data ?? [];
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (username: string) => approveFollowRequest(username),
    onSuccess: (_, username) => {
      toast({ title: "Request approved", description: username });
      queryClient.invalidateQueries({ queryKey: ["followRequests"] });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Failed to approve",
        description: err?.message ?? "Please try again.",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (username: string) => rejectFollowRequest(username),
    onSuccess: (_, username) => {
      toast({ title: "Request rejected", description: username });
      queryClient.invalidateQueries({ queryKey: ["followRequests"] });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Failed to reject",
        description: err?.message ?? "Please try again.",
      });
    },
  });

  return (
    <Layout>
      <div className="container py-12 max-w-xl mx-auto">
        <h1 className="font-serif text-3xl font-bold mb-6">
          Follow requests
        </h1>

        {isLoading ? (
          <p className="text-muted-foreground">Loading requests...</p>
        ) : isError ? (
          <p className="text-destructive">
            {(error as Error)?.message ?? "Failed to load follow requests."}
          </p>
        ) : requests.length === 0 ? (
          <p className="text-muted-foreground">
            You do not have any pending requests.
          </p>
        ) : (
          <ul className="space-y-3">
            {requests.map((username) => (
              <li
                key={username}
                className="flex items-center justify-between border border-border rounded-md px-4 py-2"
              >
                <span className="font-medium">{username}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate(username)}
                    disabled={approveMutation.isLoading}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectMutation.mutate(username)}
                    disabled={rejectMutation.isLoading}
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
