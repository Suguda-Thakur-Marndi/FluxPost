"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile, useUser } from "@clerk/nextjs"
import { Layers, Palette, User } from "lucide-react"
import ChannelsTab from "@/components/settings/channels-tab"
import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

const SettingsPage = () => {
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 space-y-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Settings & Preferences
            </h1>
            <Badge variant="outline" className="text-xs font-semibold border-border bg-muted/40">
              Account
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your connected social networks, account profile, and dashboard appearance.
          </p>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="channels">
            <div className="mb-6 w-full border-b border-border/60 pb-3">
              <TabsList className="bg-muted/50 p-1 rounded-lg border border-border flex w-fit gap-1">
                <TabsTrigger 
                  value="profile" 
                  className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-xs data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-4 py-1.5 font-medium text-xs"
                >
                  <User className="size-3.5 mr-1.5" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="channels" 
                  className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-xs data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-4 py-1.5 font-medium text-xs"
                >
                  <Layers className="size-3.5 mr-1.5" />
                  Channels
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-xs data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-4 py-1.5 font-medium text-xs"
                >
                  <Palette className="size-3.5 mr-1.5" />
                  Appearance
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="mt-0">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Your Profile</CardTitle>
                  <CardDescription className="text-xs">Manage your account information and preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/70">
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt="Profile"
                        className="h-16 w-16 rounded-full border-2 border-border shadow-xs"
                        width={64}
                        height={64}
                      />
                    ):(
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted border-2 border-border shadow-xs">
                        <User className="size-8 text-muted-foreground" />
                      </div>
                    )}

                    <div>
                      <p className="text-base font-bold text-foreground">{user?.fullName || "No name set"}</p>
                      <p className="text-xs font-medium text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>
                   <div className="mt-6">
                    <UserProfile
                      routing="hash"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "border-0 shadow-none bg-transparent",
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="channels">
              <ChannelsTab  />
            </TabsContent>

            <TabsContent value="appearance" className="mt-0">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Appearance</CardTitle>
                  <CardDescription className="text-xs">Customize how the dashboard looks for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/70">
                    <div className="space-y-0.5">
                      <Label htmlFor="theme" className="text-sm font-semibold">Dark mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Toggle between crisp light mode and deep obsidian dark mode
                      </p>
                    </div>
                    <Switch
                      id="theme"
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      className="data-[state=checked]:bg-primary"
                    />
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

export default SettingsPage