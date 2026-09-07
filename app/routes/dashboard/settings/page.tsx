"use client"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile, useUser } from "@clerk/nextjs"
import { Bell, Check, Laptop, Layers, Moon, Palette, ShieldCheck, Sun, User } from "lucide-react"
import ChannelsTab from "@/components/settings/channels-tab"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

function SettingsContent() {
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentTab = searchParams.get("tab") || "channels"

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.replace(`/settings?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 space-y-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Settings & Preferences
            </h1>
            <Badge variant="outline" className="text-xs font-semibold border-border bg-muted/40">
              Workspace
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your connected social accounts, appearance, security, and profile preferences.
          </p>
        </div>

        <div className="mt-6">
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <div className="mb-6 w-full border-b border-border/60 pb-3">
              <TabsList className="bg-muted/50 p-1 rounded-lg border border-border flex w-fit gap-1">
                <TabsTrigger 
                  value="channels" 
                  className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-xs data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-4 py-1.5 font-medium text-xs cursor-pointer"
                >
                  <Layers className="size-3.5 mr-1.5" />
                  Channels
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-xs data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-4 py-1.5 font-medium text-xs cursor-pointer"
                >
                  <User className="size-3.5 mr-1.5" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-xs data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-4 py-1.5 font-medium text-xs cursor-pointer"
                >
                  <Palette className="size-3.5 mr-1.5" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger 
                  value="preferences" 
                  className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-xs data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-4 py-1.5 font-medium text-xs cursor-pointer"
                >
                  <ShieldCheck className="size-3.5 mr-1.5" />
                  Security & Notifications
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="channels">
              <ChannelsTab />
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Your Profile</CardTitle>
                  <CardDescription className="text-xs">Manage your Clerk account information, email addresses, and active sessions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/70">
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt="Profile"
                        className="h-14 w-14 rounded-full border-2 border-border shadow-xs object-cover"
                        width={56}
                        height={56}
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border-2 border-border shadow-xs">
                        <User className="size-7 text-muted-foreground" />
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-bold text-foreground">{user?.fullName || "No name set"}</p>
                      <p className="text-xs font-medium text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>
                  <div>
                    <UserProfile
                      routing="hash"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "border-0 shadow-none bg-transparent p-0",
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Appearance & Theme</CardTitle>
                  <CardDescription className="text-xs">Select your preferred color mode for the dashboard interface.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Light Theme Option */}
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={cn(
                        "group flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
                        theme === "light" 
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs" 
                          : "border-border bg-card hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <div className="w-full h-24 rounded-lg bg-slate-100 border border-slate-200 p-2.5 flex flex-col justify-between mb-3 overflow-hidden shadow-2xs">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-slate-300" />
                          <span className="size-2 rounded-full bg-slate-300" />
                          <span className="size-2 rounded-full bg-slate-300" />
                          <div className="ml-auto h-2 w-10 bg-slate-300 rounded" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2 w-14 bg-slate-800 rounded" />
                          <div className="h-2 w-20 bg-slate-400 rounded" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Sun className="size-4 text-amber-500" />
                          <span className="text-xs font-semibold text-foreground">Light Mode</span>
                        </div>
                        {theme === "light" && <Check className="size-4 text-primary" />}
                      </div>
                    </button>

                    {/* Dark Theme Option */}
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "group flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
                        theme === "dark" 
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs" 
                          : "border-border bg-card hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <div className="w-full h-24 rounded-lg bg-slate-950 border border-slate-800 p-2.5 flex flex-col justify-between mb-3 overflow-hidden shadow-2xs">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-slate-700" />
                          <span className="size-2 rounded-full bg-slate-700" />
                          <span className="size-2 rounded-full bg-slate-700" />
                          <div className="ml-auto h-2 w-10 bg-slate-700 rounded" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2 w-14 bg-slate-100 rounded" />
                          <div className="h-2 w-20 bg-slate-600 rounded" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Moon className="size-4 text-primary" />
                          <span className="text-xs font-semibold text-foreground">Dark Mode</span>
                        </div>
                        {theme === "dark" && <Check className="size-4 text-primary" />}
                      </div>
                    </button>

                    {/* System Theme Option */}
                    <button
                      type="button"
                      onClick={() => setTheme("system")}
                      className={cn(
                        "group flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
                        theme === "system" 
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs" 
                          : "border-border bg-card hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <div className="w-full h-24 rounded-lg bg-gradient-to-r from-slate-100 to-slate-950 border border-slate-300 dark:border-slate-800 p-2.5 flex flex-col justify-between mb-3 overflow-hidden shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="size-2 rounded-full bg-slate-400" />
                          <span className="size-2 rounded-full bg-slate-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-2 w-16 bg-slate-400 rounded" />
                          <div className="h-2 w-12 bg-slate-600 rounded" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Laptop className="size-4 text-muted-foreground" />
                          <span className="text-xs font-semibold text-foreground">System</span>
                        </div>
                        {theme === "system" && <Check className="size-4 text-primary" />}
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-0">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Security & Publishing Alerts</CardTitle>
                  <CardDescription className="text-xs">Preferences for scheduled publishing notices and OAuth account protection.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/70">
                    <div className="flex items-start gap-3">
                      <Bell className="size-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">Publishing Failure Notifications</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Receive banner notices when a scheduled social channel post fails due to token expiration.
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/70">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="size-4 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">OAuth Token Protection</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          All channel access tokens and credentials are securely encrypted in InsForge PostgreSQL.
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold border-border">
                      Encrypted
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

const SettingsPage = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  )
}

export default SettingsPage