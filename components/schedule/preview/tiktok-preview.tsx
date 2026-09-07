"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Bookmark, Share2, Music, Disc } from "lucide-react";

interface TikTokPreviewProps {
  text: string;
  images?: string[];
  handle?: string;
  profileImage?: string;
}

export function TikTokPreview({ text, images, handle = "creator", profileImage }: TikTokPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayHandle = handle.startsWith("@") ? handle : `@${handle}`;
  const firstImage = images && images.length > 0 ? images[0] : null;

  return (
    <Card className="overflow-hidden border border-border/80 rounded-2xl bg-black text-white max-w-[320px] mx-auto shadow-xl">
      <CardContent className="p-0 relative aspect-[9/16] flex flex-col justify-between overflow-hidden bg-neutral-900">
        {/* Background media or fallback */}
        {firstImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstImage}
            alt="TikTok post visual"
            className="absolute inset-0 size-full object-cover opacity-90"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-neutral-400 bg-gradient-to-b from-neutral-800 to-neutral-950">
            <Music className="size-10 mb-2 opacity-40 text-rose-500" />
            <p className="text-xs font-medium">Add media for visual TikTok post</p>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="relative z-10 p-4 pt-3 flex items-center justify-between text-xs font-semibold text-white/80">
          <span className="cursor-pointer hover:text-white">Following</span>
          <span className="text-white border-b-2 border-white pb-0.5 font-bold">For You</span>
          <span className="size-4" />
        </div>

        {/* Floating Right Interaction Bar */}
        <div className="absolute right-2.5 bottom-16 z-20 flex flex-col items-center gap-4 text-white">
          <div className="relative mb-1">
            <Avatar className="size-10 border-2 border-white">
              {profileImage && <AvatarImage src={profileImage} />}
              <AvatarFallback className="bg-primary text-white text-xs font-bold">
                {displayHandle.substring(1, 3).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
              +
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="size-9 rounded-full bg-neutral-800/60 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
              <Heart className="size-5 fill-white text-white" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">84.2K</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="size-9 rounded-full bg-neutral-800/60 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
              <MessageCircle className="size-5 fill-white text-white" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">1,249</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="size-9 rounded-full bg-neutral-800/60 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
              <Bookmark className="size-5 fill-white text-white" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">14.8K</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="size-9 rounded-full bg-neutral-800/60 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
              <Share2 className="size-5 fill-white text-white" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">Share</span>
          </div>

          <div className="size-8 rounded-full border-2 border-neutral-700 bg-neutral-900 flex items-center justify-center animate-spin duration-3000">
            <Disc className="size-4 text-rose-500" />
          </div>
        </div>

        {/* Bottom Content & Handle Overlay */}
        <div className="relative z-10 p-4 pr-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-10 space-y-1.5">
          <p className="font-bold text-sm tracking-tight text-white drop-shadow-sm">
            {displayHandle}
          </p>

          <div className="text-xs text-neutral-200 leading-snug drop-shadow-sm">
            {!text ? (
              <span className="italic text-neutral-400">Caption goes here... #scheduler</span>
            ) : text.length > 80 && !isExpanded ? (
              <span>
                {text.slice(0, 80)}...{" "}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="font-bold text-white underline ml-1"
                >
                  more
                </button>
              </span>
            ) : (
              <span>{text}</span>
            )}
          </div>

          {/* Audio bar */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-300 pt-1">
            <Music className="size-3 text-white" />
            <span className="truncate">Original Sound — {displayHandle}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
