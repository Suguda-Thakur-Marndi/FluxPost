"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const navItems = [
  { label: "Features", href: "/features" },
  { label: "Workflow", href: "/workflow" },
  { label: "Channels", href: "/channels" },
  { label: "Pricing", href: "/pricing" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden dark:mesh-bg-dark mesh-bg selection:bg-primary/30 flex flex-col justify-between">
      {/* ── Navbar ────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-border/20 glass"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo className="shrink-0 scale-105" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-all hover:text-foreground hover:scale-105 ${
                    isActive ? "text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full px-5 text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  <Link href="/sign-in">Log in</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full px-6 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                >
                  <Link href="/sign-up">Get started</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  className="rounded-full px-5 text-sm font-medium hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20"
                >
                  <Link href="/schedule">Open workspace</Link>
                </Button>
                <UserButton
                  appearance={{
                    elements: { avatarBox: "h-9 w-9 ring-2 ring-primary/20" },
                  }}
                />
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── Page Content ──────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-border/20 glass px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link href="/">
            <Logo className="opacity-80 scale-105" />
          </Link>
          <p className="text-sm font-medium text-muted-foreground">
            © {new Date().getFullYear()} Lemon.ai Media Scheduler. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
