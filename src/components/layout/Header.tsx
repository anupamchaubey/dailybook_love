import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, PenSquare, Menu, X, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getStoredToken, clearStoredAuth } from "@/lib/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!getStoredToken();
  const currentUsername = localStorage.getItem("dailybook_username");

  const handleLogout = () => {
    clearStoredAuth();
    localStorage.removeItem("dailybook_username");
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            DailyBook
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/explore"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Explore
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/my-posts"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                My Posts
              </Link>
              <Link
                to="/followers"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Followers
              </Link>
              <Link
                to="/following"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Following
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <div
              className={cn(
                "flex items-center transition-all duration-300",
                isSearchOpen ? "w-64" : "w-10"
              )}
            >
              {isSearchOpen && (
  <Input
    type="search"
    placeholder="Search stories..."
    className="h-10 pr-10 animate-fade-in"
    autoFocus
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchOpen(false);
      }
    }}
    onBlur={() => setIsSearchOpen(false)}
  />
)}

              <Button
                variant="ghost"
                size="icon"
                className={cn("shrink-0", isSearchOpen && "absolute right-0")}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/notifications">
                  <Bell className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="default" size="sm" asChild>
                <Link to="/write">
                  <PenSquare className="h-4 w-4 mr-2" />
                  Write
                </Link>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                    {currentUsername ?? "Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                  >
                    My profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/my-posts")}
                  >
                    My posts
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/followers")}
                  >
                    Followers
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/following")}
                  >
                    Following
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/follow-requests")}
                  >
                    Follow requests
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-down">
          <div className="container py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
  type="search"
  placeholder="Search stories..."
  className="pl-10"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  }}
/>

            </div>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/explore"
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    to="/my-posts"
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Posts
                  </Link>
                  <Link
                    to="/followers"
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Followers
                  </Link>
                  <Link
                    to="/following"
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Following
                  </Link>
                  <Link
                    to="/follow-requests"
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Follow requests
                  </Link>
                  <Link
                    to="/notifications"
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/write"
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Write
                  </Link>
                  <Link
                    to="/profile"
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="px-3 py-2 text-sm font-medium rounded-md text-left text-destructive hover:bg-secondary"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
