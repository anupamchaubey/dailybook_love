import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api";
import { NotificationResponse } from "@/types/api";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function NotificationsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications(0, 30),
  });

  const notifications: NotificationResponse[] = data?.content ?? [];
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markOneMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <Layout>
      <div className="container py-12 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold">Notifications</h1>
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isLoading}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading notifications...</p>
        ) : isError ? (
          <p className="text-destructive">
            {(error as Error)?.message ?? "Failed to load notifications."}
          </p>
        ) : notifications.length === 0 ? (
          <p className="text-muted-foreground">
            You do not have any notifications yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`border border-border rounded-md px-4 py-3 ${
                  n.read ? "bg-background" : "bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!n.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markOneMutation.mutate(n.id)}
                      disabled={markOneMutation.isLoading}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
