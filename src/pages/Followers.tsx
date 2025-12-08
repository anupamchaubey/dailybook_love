import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getMyFollowers } from "@/lib/api";
import { Link } from "react-router-dom";

export default function Followers() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["followers"],
    queryFn: getMyFollowers,
  });

  const followers = data ?? [];

  return (
    <Layout>
      <div className="container py-12 max-w-xl mx-auto">
        <h1 className="font-serif text-3xl font-bold mb-6">Your followers</h1>

        {isLoading ? (
          <p className="text-muted-foreground">Loading followers...</p>
        ) : isError ? (
          <p className="text-destructive">
            {(error as Error)?.message ?? "Failed to load followers."}
          </p>
        ) : followers.length === 0 ? (
          <p className="text-muted-foreground">
            Nobody is following you yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {followers.map((username) => (
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
