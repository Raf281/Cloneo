import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Link2,
  Globe,
  Moon,
  Mail,
  Smartphone,
  Instagram,
  Check,
  ExternalLink,
  Trash2,
  Clock,
  Hash,
  Calendar,
  Zap,
  Loader2,
} from "lucide-react";
import { XIcon } from "@/components/x-posts";
import type {
  UserSettings,
  UpdateUserSettingsInput,
  UserProfile,
  UpdateProfileInput,
} from "@/lib/types";

// Response shape from GET /api/settings
interface SettingsResponse {
  settings: UserSettings;
  profile: UserProfile;
}

// TikTok icon component
function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const connectedPlatforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    connected: true,
    username: "@johndoe",
    color: "text-pink-400",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: TikTokIcon,
    connected: true,
    username: "@johndoe_content",
    color: "text-cyan-400",
  },
  {
    id: "x",
    name: "X (Twitter)",
    icon: XIcon,
    connected: true,
    username: "@johndoe_official",
    color: "text-white",
  },
];

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ------ Profile state ------
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // ------ Settings state ------
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [weeklyReport, setWeeklyReport] = useState<boolean>(true);
  const [autoPublish, setAutoPublish] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [timezone, setTimezone] = useState<string>("europe-berlin");
  const [language, setLanguage] = useState<string>("en");

  // ------ X/Twitter settings state ------
  const [xAutoPost, setXAutoPost] = useState<boolean>(false);
  const [xIncludeHashtags, setXIncludeHashtags] = useState<boolean>(true);
  const [xAutoThread, setXAutoThread] = useState<boolean>(false);
  const [xDefaultTone, setXDefaultTone] = useState<string>("motivational");
  const [xPostingSchedule, setXPostingSchedule] = useState<string>("optimal");
  const [xHashtagStyle, setXHashtagStyle] = useState<string>("moderate");

  // ------ Fetch settings ------
  const { data, isLoading, isError } = useQuery<SettingsResponse>({
    queryKey: ["settings"],
    queryFn: () => api.get<SettingsResponse>("/api/settings"),
  });

  // Populate state from fetched data
  useEffect(() => {
    if (!data) return;

    const { settings, profile } = data;

    // Profile: split name into first/last
    const nameParts = (profile.name ?? "").split(" ");
    setFirstName(nameParts[0] ?? "");
    setLastName(nameParts.slice(1).join(" "));
    setEmail(profile.email);

    // Settings
    setEmailNotifications(settings.emailNotifications);
    setPushNotifications(settings.pushNotifications);
    setWeeklyReport(settings.weeklyReport);
    setAutoPublish(settings.autoPublish);
    setDarkMode(settings.darkMode);
    setTimezone(settings.timezone);
    setLanguage(settings.language);

    // X settings
    setXAutoPost(settings.xAutoPost);
    setXIncludeHashtags(settings.xIncludeHashtags);
    setXAutoThread(settings.xAutoThread);
    setXDefaultTone(settings.xDefaultTone);
    setXPostingSchedule(settings.xPostingSchedule);
    setXHashtagStyle(settings.xHashtagStyle);
  }, [data]);

  // ------ Mutations ------
  const updateSettingsMutation = useMutation({
    mutationFn: (input: UpdateUserSettingsInput) =>
      api.put<UserSettings>("/api/settings", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      });
    },
    onError: (error: Error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to save settings. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      api.put<UserProfile>("/api/settings/profile", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Profile updated",
        description: "Your account information has been saved.",
      });
    },
    onError: (error: Error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update profile. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  // ------ Handlers ------
  function handleSaveProfile() {
    const fullName = `${firstName} ${lastName}`.trim();
    updateProfileMutation.mutate({
      name: fullName || undefined,
      email: email || undefined,
    });
  }

  function handleSaveXSettings() {
    updateSettingsMutation.mutate({
      xAutoPost,
      xIncludeHashtags,
      xAutoThread,
      xDefaultTone: xDefaultTone as UpdateUserSettingsInput["xDefaultTone"],
      xPostingSchedule: xPostingSchedule as UpdateUserSettingsInput["xPostingSchedule"],
      xHashtagStyle: xHashtagStyle as UpdateUserSettingsInput["xHashtagStyle"],
    });
  }

  function handleSaveNotifications() {
    updateSettingsMutation.mutate({
      emailNotifications,
      pushNotifications,
      weeklyReport,
    });
  }

  function handleSavePublishing() {
    updateSettingsMutation.mutate({
      autoPublish,
      timezone: timezone as UpdateUserSettingsInput["timezone"],
      language: language as UpdateUserSettingsInput["language"],
    });
  }

  function handleToggleDarkMode(checked: boolean) {
    setDarkMode(checked);
    updateSettingsMutation.mutate({ darkMode: checked });
  }

  // Toggle handlers that auto-save for notification switches
  function handleToggleEmailNotifications(checked: boolean) {
    setEmailNotifications(checked);
    updateSettingsMutation.mutate({
      emailNotifications: checked,
      pushNotifications,
      weeklyReport,
    });
  }

  function handleTogglePushNotifications(checked: boolean) {
    setPushNotifications(checked);
    updateSettingsMutation.mutate({
      emailNotifications,
      pushNotifications: checked,
      weeklyReport,
    });
  }

  function handleToggleWeeklyReport(checked: boolean) {
    setWeeklyReport(checked);
    updateSettingsMutation.mutate({
      emailNotifications,
      pushNotifications,
      weeklyReport: checked,
    });
  }

  const isSaving = updateSettingsMutation.isPending || updateProfileMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-zinc-400">Failed to load settings.</p>
        <Button
          variant="outline"
          className="border-zinc-700 text-zinc-300"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["settings"] })}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Settings</h1>
        <p className="text-zinc-400">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="space-y-6 lg:col-span-2">
          {/* Account Settings */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <User className="h-5 w-5 text-violet-400" />
                Account
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Your personal account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">First Name</Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Last Name</Label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
              <Button
                className="bg-violet-600 hover:bg-violet-700"
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* X/Twitter Settings */}
          <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900 to-black">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black border border-zinc-700">
                  <XIcon className="h-4 w-4 text-white" />
                </div>
                X (Twitter) Settings
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Configure your X/Twitter publishing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Connection Status */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="flex items-center gap-3">
                  <XIcon className="h-5 w-5 text-white" />
                  <div>
                    <p className="text-sm font-medium text-white">@johndoe_official</p>
                    <p className="text-xs text-zinc-500">Connected since Jan 2025</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400">
                  <Check className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              </div>

              <Separator className="bg-zinc-800" />

              {/* Auto-Posting */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Enable Auto-Posting</p>
                    <p className="text-xs text-zinc-500">
                      Automatically publish approved posts
                    </p>
                  </div>
                </div>
                <Switch checked={xAutoPost} onCheckedChange={setXAutoPost} />
              </div>

              <Separator className="bg-zinc-800" />

              {/* Posting Schedule */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <Label className="text-zinc-300">Posting Schedule</Label>
                </div>
                <Select value={xPostingSchedule} onValueChange={setXPostingSchedule}>
                  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900">
                    <SelectItem value="optimal">
                      <span className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-emerald-400" />
                        Optimal Times (AI-recommended)
                      </span>
                    </SelectItem>
                    <SelectItem value="morning">Morning (8:00 - 10:00)</SelectItem>
                    <SelectItem value="midday">Midday (12:00 - 14:00)</SelectItem>
                    <SelectItem value="evening">Evening (18:00 - 20:00)</SelectItem>
                    <SelectItem value="night">Late Night (21:00 - 23:00)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-500">
                  {xPostingSchedule === "optimal"
                    ? "AI analyzes your follower activity for best reach"
                    : "Your posts will be published at the selected time"}
                </p>
              </div>

              <Separator className="bg-zinc-800" />

              {/* Hashtag Preferences */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-zinc-400" />
                  <Label className="text-zinc-300">Hashtag Preferences</Label>
                </div>
                <Select value={xHashtagStyle} onValueChange={setXHashtagStyle}>
                  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900">
                    <SelectItem value="none">No Hashtags</SelectItem>
                    <SelectItem value="minimal">Minimal (1-2 Hashtags)</SelectItem>
                    <SelectItem value="moderate">Moderate (3-5 Hashtags)</SelectItem>
                    <SelectItem value="aggressive">Aggressive (5-10 Hashtags)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Auto-insert Hashtags</p>
                    <p className="text-xs text-zinc-500">
                      AI suggests relevant hashtags
                    </p>
                  </div>
                </div>
                <Switch checked={xIncludeHashtags} onCheckedChange={setXIncludeHashtags} />
              </div>

              <Separator className="bg-zinc-800" />

              {/* Thread Settings */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Auto-Thread for Long Content</p>
                    <p className="text-xs text-zinc-500">
                      Automatically create threads when text is too long
                    </p>
                  </div>
                </div>
                <Switch checked={xAutoThread} onCheckedChange={setXAutoThread} />
              </div>

              <Separator className="bg-zinc-800" />

              {/* Default Tone */}
              <div className="space-y-3">
                <Label className="text-zinc-300">Default Tone for X Posts</Label>
                <Select value={xDefaultTone} onValueChange={setXDefaultTone}>
                  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900">
                    <SelectItem value="motivational">Motivational</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="entertaining">Entertaining</SelectItem>
                    <SelectItem value="controversial">Controversial</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full gap-2 bg-black text-white hover:bg-zinc-900 border border-zinc-700"
                onClick={handleSaveXSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <XIcon className="h-4 w-4" />
                    Save X Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Bell className="h-5 w-5 text-violet-400" />
                Notifications
              </CardTitle>
              <CardDescription className="text-zinc-400">
                How and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Email Notifications</p>
                    <p className="text-xs text-zinc-500">
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={handleToggleEmailNotifications}
                />
              </div>
              <Separator className="bg-zinc-800" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Push Notifications</p>
                    <p className="text-xs text-zinc-500">
                      Notifications on your device
                    </p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={handleTogglePushNotifications}
                />
              </div>
              <Separator className="bg-zinc-800" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Weekly Report</p>
                    <p className="text-xs text-zinc-500">
                      Summary of your content performance
                    </p>
                  </div>
                </div>
                <Switch
                  checked={weeklyReport}
                  onCheckedChange={handleToggleWeeklyReport}
                />
              </div>
            </CardContent>
          </Card>

          {/* Connected Platforms */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Link2 className="h-5 w-5 text-violet-400" />
                Connected Platforms
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Manage your social media connections
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-800">
                {connectedPlatforms.map((platform) => (
                  <div key={platform.id} className="flex items-center gap-4 p-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      platform.id === "x" ? "bg-black" : ""
                    } ${platform.color}`}>
                      <platform.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{platform.name}</p>
                      {platform.connected ? (
                        <p className="text-xs text-zinc-500">{platform.username}</p>
                      ) : (
                        <p className="text-xs text-zinc-500">Not connected</p>
                      )}
                    </div>
                    {platform.connected ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400">
                          <Check className="mr-1 h-3 w-3" />
                          Connected
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-400 hover:text-red-400"
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Publishing Settings */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Globe className="h-5 w-5 text-violet-400" />
                Publishing
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Settings for content publishing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Auto-Publish</p>
                  <p className="text-xs text-zinc-500">
                    Automatically publish approved content
                  </p>
                </div>
                <Switch checked={autoPublish} onCheckedChange={setAutoPublish} />
              </div>
              <Separator className="bg-zinc-800" />
              <div className="space-y-2">
                <Label className="text-zinc-300">Default Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900">
                    <SelectItem value="europe-berlin">Europe/Berlin (CET)</SelectItem>
                    <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                    <SelectItem value="america-new-york">America/New York (EST)</SelectItem>
                    <SelectItem value="america-los-angeles">
                      America/Los Angeles (PST)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="bg-violet-600 hover:bg-violet-700"
                onClick={handleSavePublishing}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Publishing Settings"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plan Info */}
          <Card className="border-zinc-800 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <CreditCard className="h-5 w-5 text-violet-400" />
                Your Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Current Plan</span>
                <Badge className="bg-violet-500/20 text-violet-400">Pro</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Content / Month</span>
                <span className="text-white">45 / 50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Next Billing</span>
                <span className="text-white">March 15, 2025</span>
              </div>
              <Separator className="bg-zinc-700" />
              <Button
                variant="outline"
                className="w-full border-violet-500/50 text-violet-400 hover:bg-violet-500/10"
              >
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          {/* X Stats Quick View */}
          <Card className="border-zinc-800 bg-black">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <XIcon className="h-5 w-5" />
                X Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Posts This Week</span>
                <span className="text-white font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Threads</span>
                <span className="text-white font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Scheduled</span>
                <span className="text-blue-400 font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Awaiting Review</span>
                <span className="text-amber-400 font-semibold">2</span>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Moon className="h-5 w-5 text-violet-400" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Dark Mode</p>
                  <p className="text-xs text-zinc-500">Use dark theme</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={handleToggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Shield className="h-5 w-5 text-violet-400" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <Button
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-lg text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-zinc-800 bg-zinc-950">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                      This action cannot be undone. All your data,
                      your avatar, and your content will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
