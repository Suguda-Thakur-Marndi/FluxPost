"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  CreditCard, 
  Lightbulb, 
  Plus, 
  PlusCircleIcon, 
  Settings, 
  LayoutDashboard, 
  Layers, 
  Image as ImageIcon, 
  BarChart3 
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { getChannelIcon, getChannelUrl } from '@/constants/channels';
import { ChannelType } from '@/types/channel.type';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { UserButton, useUser } from '@clerk/nextjs';
import ChannelAvatar from '@/components/channel-avatar';
import { toast } from 'sonner';
import { useState } from 'react';
import CreatePostDialog from '@/components/schedule/create-post-dialog';
import { Share2 } from 'lucide-react';

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Ideas", href: "/ideas", icon: Lightbulb },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Channels", href: "/settings?tab=channels", icon: Share2 },
  { name: "Content", href: "/content", icon: Layers },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Media Library", href: "/media", icon: ImageIcon },
];

const secondaryNav = [
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { user } = useUser()
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false)

  const connectMutation = useMutation({
    mutationFn: async (channelTypeId: string) => {
      const res = await fetch("/api/channel/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelTypeId,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to connect channel")
      }
      return data
    },
    onSuccess: ({url}) => {
      window.location.href = url
    },
    onError: () => {
      toast.error("Failed to connect channel")
    }
  })

  const {data:channelsData, isPending} = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const res = await fetch("/api/channel");
      const data = await res.json();
      return data
    }
  })

  const channels = (channelsData?.channels || []) as ChannelType[]
  const unconnectedChannels = channels.filter((channel: ChannelType) => !channel.connected);
  const connectedChannels = channels.filter((channel: ChannelType) => channel.connected);

  const connectedCount = channelsData?.connectedCount || 0;
  const totalChannels = channelsData?.totalChannels || 0;
  const limitedChannels = unconnectedChannels.slice(0, 4);

  const handleConnect = (channelTypeId: string) => {
    if(connectMutation.isPending) return;
    connectMutation.mutate(channelTypeId);
  }

  return (
    <>
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className={cn("p-4 border-b border-sidebar-border/60", isCollapsed && "p-2")}>
        <div className='flex items-center justify-between'>
           <Logo hideName={isCollapsed} className="scale-100 ml-1" />
           <SidebarTrigger className="hidden md:flex text-muted-foreground hover:text-foreground" />
        </div>
        <Button 
          className='mt-4 w-full rounded-lg bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 transition-colors'
          size={isCollapsed ? "icon": "default"}
          onClick={() => setIsCreatePostOpen(true)}
          title="Create New Post"
        >
          <Plus className="size-4" />
          {!isCollapsed && <span>New Post</span>}
        </Button>
      </SidebarHeader>

      <SidebarContent className={cn("px-2 py-3 space-y-4", isCollapsed && "px-1")}>
        {/* Main Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 px-2'>
            {!isCollapsed && "Workspace"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainNav.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={cn(
                        "rounded-lg transition-colors py-2 px-3",
                        isActive 
                          ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20" 
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="size-4.5 shrink-0" />
                        <span className='text-sm font-medium'>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Connected Channels */}
        {connectedChannels.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 px-2'>
              {!isCollapsed && "Connected Channels"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {isPending ? (
                  <div className='flex flex-col gap-1.5 px-2'>
                    <Skeleton className='h-7 w-full' />
                    <Skeleton className='h-7 w-full' />
                  </div>
                ) : (
                  connectedChannels.map((channel: ChannelType) => {
                    const url = getChannelUrl(channel.type);
                    return (
                      <SidebarMenuItem key={channel.id}>
                        <SidebarMenuButton asChild tooltip={channel.name}>
                          <a
                            href={`${url}/${channel.handle}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
                          >
                            <ChannelAvatar
                              size="sm"
                              className="shrink-0"
                              type={channel.type}
                              color={channel.color}
                              profileImage={channel.profile_image}
                              name={!isCollapsed ? (channel.handle || channel.name) : ""}
                            />
                            {!isCollapsed && (
                              <span className="text-xs truncate font-medium text-foreground">
                                {channel.handle || channel.name}
                              </span>
                            )}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Connect More Channels */}
        {limitedChannels.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 px-2'>
              {!isCollapsed && "Connect Channels"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {limitedChannels.map((channel: ChannelType) => {
                  const icon = getChannelIcon(channel.type);
                  return (
                    <SidebarMenuItem key={channel.id}>
                      <SidebarMenuButton asChild tooltip={`Connect ${channel.name}`}>
                        <button
                          className='w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-left'
                          disabled={connectMutation.isPending}
                          onClick={() => handleConnect(channel.id)}
                        >
                          <div className='relative shrink-0'>
                            {icon ? (
                              <HugeiconsIcon 
                                icon={icon} 
                                color='currentColor'
                                className="text-white size-5 p-0.5 rounded-sm"
                                style={{ background: channel.color }}
                              />
                            ) : null}
                            <div className="absolute -right-1 -bottom-0.5 p-0.5 bg-background rounded-xs border border-border">
                              <HugeiconsIcon icon={PlusSignIcon} className="size-2 text-muted-foreground" />
                            </div>
                          </div>
                          {!isCollapsed && (
                            <span className='text-xs truncate text-muted-foreground hover:text-foreground font-medium'>
                              {channel.name}
                            </span>
                          )}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="All Channels">
                    <Link href="/settings" className='w-full flex items-center gap-2 px-2 py-1.5 text-xs text-primary font-medium hover:underline'>
                      <PlusCircleIcon className='size-3.5' />
                      {!isCollapsed && <span>More channels</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-auto pt-2 border-t border-sidebar-border/60">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                    className="rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors py-2 px-3"
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="size-4 shrink-0" />
                      <span className='text-sm font-medium'>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 p-3 bg-sidebar">
        {!isCollapsed && (
          <div className="mb-2.5 px-1 space-y-1.5">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Channels Connected</span>
              <span className="text-foreground font-bold">{connectedCount}/{totalChannels}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${totalChannels > 0 ? Math.min(100, Math.round((connectedCount / totalChannels) * 100)) : 0}%` }}
              />
            </div>
          </div>
        )}
        <div className="flex items-center gap-2.5 px-1 py-1">
          <UserButton
            showName={false}
            appearance={{
              elements: {
                avatarBox: "h-7 w-7",
              },
            }}
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">
                {user?.fullName || "User Account"}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
    
    <CreatePostDialog
      open={isCreatePostOpen}
      onOpenChange={setIsCreatePostOpen}
    />
    </>
  );
};

export default AppSidebar;