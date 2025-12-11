// Login.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { loginUser } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

type LoginPayload = {
  username: string;
  password: string;
};

export default function Login(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Helper to extract message from unknown error (Axios / Fetch friendly)
  const extractErrorMessage = (err: unknown): string => {
    if (!err) return "Unable to sign in. Please try again.";
    // axios-like
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyErr = err as any;
    if (anyErr?.response?.data?.message) return String(anyErr.response.data.message);
    if (anyErr?.message) return String(anyErr.message);
    if (typeof anyErr === "string") return anyErr;
    return "Unable to sign in. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return; // guard duplicate

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");

    if (!username || !password) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter both username and password.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // assume loginUser returns a promise that resolves when login succeeds
      // and the server sets an httpOnly cookie for auth if appropriate.
      await loginUser({ username, password } as LoginPayload);

      // Optionally store non-sensitive UI info
      try {
        localStorage.setItem("dailybook_username", username);
      } catch {
        // localStorage might be unavailable in some privacy modes — ignore silently
      }

      // invalidate queries to refetch profile and home feed
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["homeEntries"] });

      toast({
        title: "Signed in",
        description: "Welcome back to DailyBook.",
      });

      // navigate to home
      navigate("/", { replace: true });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: extractErrorMessage(err),
      });
    } finally {
      // only update state if component is still mounted
      if (mountedRef.current) setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
            <Link to="/" className="block mb-8">
              <span className="font-serif text-3xl font-bold text-foreground">DailyBook</span>
            </Link>
            <h1 className="font-serif text-2xl font-semibold text-foreground">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to continue your writing journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="your-username"
                disabled={isLoading}
                aria-required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="pr-10"
                  disabled={isLoading}
                  aria-required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/90 transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        <img
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=1600&fit=crop"
          alt="Writing desk with pen and paper"
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-primary-foreground">
          <blockquote className="font-serif text-2xl italic text-foreground">
            "The first draft is just you telling yourself the story."
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">— Terry Pratchett</p>
        </div>
      </div>
    </div>
  );
}