"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X, ArrowRight } from "lucide-react";

const navItems = [
  { label: "Features", href: "/features" },
  { label: "Workflow", href: "/workflow" },
  { label: "Channels", href: "/channels" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* ── Top Announcement Banner ─────────────────────── */}
      <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center text-xs font-medium text-primary">
        <span>✨ Experience next-generation multi-channel publishing with AI drafting and realistic feed previews.</span>
      </div>

      {/* ── Navbar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="shrink-0" />
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-xs font-semibold tracking-wide transition-colors py-1 ${
                      isActive 
                        ? "text-primary font-bold border-b-2 border-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />

            {!isSignedIn ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground h-9 px-3.5"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="text-xs font-semibold h-9 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
                >
                  <Link href="/sign-up">Start Free</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  size="sm"
                  className="text-xs font-semibold h-9 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs gap-1.5"
                >
                  <Link href="/dashboard">
                    Dashboard
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
                <UserButton
                  appearance={{
                    elements: { avatarBox: "h-8 w-8 ring-2 ring-primary/20" },
                  }}
                />
              </div>
            )}

            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden size-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card px-4 py-4 space-y-3">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-2 px-3 rounded-md transition-colors ${
                    pathname === item.href 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {!isSignedIn && (
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <Button asChild variant="outline" size="sm" className="w-full justify-center">
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild size="sm" className="w-full justify-center bg-primary">
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>Start Free</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Page Content ──────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-border/80 bg-card/60 px-6 py-12 text-xs">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/">
              <Logo className="opacity-90" />
            </Link>
            <p className="text-muted-foreground">
              Plan, create, schedule and publish social media content from one command center.
            </p>
          </div>

          <div className="flex items-center gap-6 text-muted-foreground font-medium">
            <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/workflow" className="hover:text-foreground transition-colors">Workflow</Link>
            <Link href="/channels" className="hover:text-foreground transition-colors">Channels</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>

          <div className="text-muted-foreground text-center md:text-right">
            <p>© {new Date().getFullYear()} Media Scheduler Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
