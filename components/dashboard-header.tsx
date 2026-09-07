"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Bell, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
} from "lucide-react";
import { ModeToggle } from "@/components/dark-mode-toggle";
import { UserButton } from "@clerk/nextjs";
import CreatePostDialog from "@/components/schedule/create-post-dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const pathTitles: Record<string, { title: string; category: string }> = {
  "/dashboard": { title: "Overview", category: "Workspace" },
  "/schedule": { title: "Schedule Calendar", category: "Publishing" },
  "/content": { title: "Content Manager", category: "Publishing" },
  "/ideas": { title: "Ideas Board", category: "Creative" },
  "/media": { title: "Media Library", category: "Assets" },
  "/analytics": { title: "Analytics & Performance", category: "Insights" },
  "/settings": { title: "Settings & Preferences", category: "Account" },
  "/billing": { title: "Billing & Subscription", category: "Account" },
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const matched = Object.entries(pathTitles).find(([route]) => 
    pathname === route || (route !== "/dashboard" && pathname.startsWith(route))
  );

  const currentInfo = matched ? matched[1] : { title: "Dashboard", category: "Workspace" };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur-md transition-colors md:px-6">
        {/* Left Side: Mobile Sidebar Trigger + Breadcrumb */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden text-muted-foreground hover:text-foreground" />

          <nav className="flex items-center gap-1.5 text-xs">
            <span className="font-medium text-muted-foreground hidden sm:inline-block">
              {currentInfo.category}
            </span>
            <ChevronRight className="size-3 text-muted-foreground/60 hidden sm:inline-block" />
            <h1 className="font-semibold text-foreground text-sm tracking-tight">
              {currentInfo.title}
            </h1>
          </nav>
        </div>

        {/* Right Side: Quick Search, Notifications, Create Post, Theme Toggle, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="hidden lg:flex items-center gap-2 h-8 px-3 rounded-lg border-border/80 text-xs text-muted-foreground hover:text-foreground bg-muted/30"
          >
            <Search className="size-3.5" />
            <span>Search or command...</span>
            <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              ⌘K
            </kbd>
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 relative rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
              <div className="flex items-center justify-between px-2 py-1.5">
                <DropdownMenuLabel className="p-0 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Notifications
                </DropdownMenuLabel>
                <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5">
                  Live
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-2.5 rounded-lg flex items-start gap-2.5 cursor-pointer">
                <div className="size-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground">Inngest publishing engine active</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Background worker queue running healthy</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2.5 rounded-lg flex items-start gap-2.5 cursor-pointer">
                <div className="size-6 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground">Scheduled queue operational</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Posts will publish automatically at slot times</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="p-1">
                <Button asChild variant="ghost" size="sm" className="w-full text-xs justify-center text-primary h-7">
                  <Link href="/schedule">View Scheduled Posts</Link>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Quick Create CTA */}
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="sm"
            className="h-8 px-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 gap-1.5 transition-colors"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline-block">Create Post</span>
          </Button>

          {/* User Profile */}
          <div className="pl-1">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-7.5 rounded-lg ring-1 ring-border shadow-xs",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Quick Post Dialog from Header */}
      <CreatePostDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </>
  );
}
