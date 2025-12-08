import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold text-foreground">
                DailyBook
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              A place for thoughtful writing and meaningful stories. Share your
              ideas with the world, one word at a time.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans text-sm font-semibold text-foreground mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Popular Stories
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Topics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} DailyBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
