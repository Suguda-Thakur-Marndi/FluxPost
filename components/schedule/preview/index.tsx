import { ChannelType } from "@/types/channel.type"
import { TwitterPreview } from "./twitter-preview"
import { FacebookPreview } from "./facebook-preview"
import { InstagramPreview } from "./instagram-preview"
import { BlueSkyPreview } from "./bluesky-preview"
import { Eye, Info } from "lucide-react"
import { ThreadPreview } from "./thread-preview"
import { LinkedinPreview } from "./linkedin-preview"
import { YoutubePreview } from "./youtube-preview"
import { TikTokPreview } from "./tiktok-preview"
import { ImageObject } from "@/types/post.type"
import { ChannelTypeEnum, getChannelIcon } from "@/constants/channels"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"

type ChannelContent = {
  text: string
  images: ImageObject[]
}

interface PreviewPanelProps {
  channel: ChannelType | null
  channels?: ChannelType[]
  onSelectChannel?: (channelId: string) => void
  content: ChannelContent
}

const PreviewPanel = ({
  channel,
  channels = [],
  onSelectChannel,
  content,
}: PreviewPanelProps) => {
  if (!channel) {
    return (
      <div className="flex flex-1 h-full flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-2">
        <Eye className="size-8 text-muted-foreground/50 mb-1" />
        <p className="text-xs font-semibold text-foreground">No channel selected for preview</p>
        <p className="text-[11px] text-muted-foreground max-w-xs">
          Select or click a channel to view a pixel-accurate rendering of your post.
        </p>
      </div>
    )
  }

  const label = `${channel?.name || "Feed"} Preview`
  const imageUrls = content?.images?.map(img => img.url)

  const renderPreview = () => {
    switch (channel.type) {
      case ChannelTypeEnum.TWITTER:
        return (
          <TwitterPreview
            text={content.text}
            images={imageUrls}
            profileImage={channel?.profile_image || ""}
            handle={channel?.handle || ""}
          />
        )
      case ChannelTypeEnum.LINKEDIN:
        return (
          <LinkedinPreview
            text={content.text}
            images={imageUrls}
            profileImage={channel?.profile_image || ""}
            handle={channel?.handle || ""}
          />
        )
      case ChannelTypeEnum.INSTAGRAM:
        return (
          <InstagramPreview
            text={content.text}
            images={imageUrls}
          />
        )
      case ChannelTypeEnum.THREADS:
        return (
          <ThreadPreview
            text={content.text}
            images={imageUrls}
          />
        )
      case ChannelTypeEnum.FACEBOOK:
        return (
          <FacebookPreview
            text={content.text}
            images={imageUrls}
          />
        )
      case ChannelTypeEnum.BLUESKY:
        return (
          <BlueSkyPreview
            text={content.text}
            images={imageUrls}
          />
        )
      case ChannelTypeEnum.YOUTUBE:
        return (
          <YoutubePreview
            text={content.text}
            images={imageUrls}
          />
        )
      case ChannelTypeEnum.TIKTOK:
        return (
          <TikTokPreview
            text={content.text}
            images={imageUrls}
            handle={channel?.handle || ""}
            profileImage={channel?.profile_image || ""}
          />
        )
      default:
        return (
          <div className="p-4 text-xs text-muted-foreground text-center">
            Standard preview for {channel.name}
          </div>
        )
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-3 h-full py-1">
      {/* Platform Switcher Chips inside Preview */}
      {channels.length > 1 && onSelectChannel && (
        <div className="px-5 pt-1 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {channels.map((c) => {
            const isSelected = c.id === channel.id
            const Icon = getChannelIcon(c.type)
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectChannel(c.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all shrink-0 cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                {Icon && (
                  <HugeiconsIcon icon={Icon} className="size-3 text-white" color="currentColor" />
                )}
                <span>{c.name}</span>
              </button>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-between px-5 pt-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-foreground">{label}</h3>
          <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
            <Info className="size-3" />
            Live Preview
          </span>
        </div>

        {!channel.connected && (
          <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-900 font-medium">
            Preview Only
          </span>
        )}
      </div>

      <div className="w-full flex-1 px-5 py-1 overflow-y-auto">
        {renderPreview()}
      </div>
    </div>
  )
}

export default PreviewPanel
