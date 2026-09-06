"use client"

import { useState, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Image as ImageIcon, 
  UploadCloud, 
  LayoutGrid, 
  List, 
  Search, 
  Plus, 
  Eye, 
  CheckCircle2, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import CreatePostDialog from "@/components/schedule/create-post-dialog";
import { PostType, ImageObject } from "@/types/post.type";
import { toast } from "sonner";

interface MediaAsset {
  id: string;
  url: string;
  key?: string;
  name: string;
  size?: string;
  type: string;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [uploadedAssets, setUploadedAssets] = useState<MediaAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch posts to aggregate all media previously uploaded in scheduled posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["content-posts-media"],
    queryFn: async () => {
      const res = await fetch("/api/post");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  // Extract media items from posts
  const postAssets: MediaAsset[] = useMemo(() => {
    const posts = (postsData?.posts || []) as PostType[];
    const items: MediaAsset[] = [];
    const seenUrls = new Set<string>();

    posts.forEach((post) => {
      if (post.images && Array.isArray(post.images)) {
        post.images.forEach((img: ImageObject, idx: number) => {
          if (img.url && !seenUrls.has(img.url)) {
            seenUrls.add(img.url);
            items.push({
              id: `${post.id}-${idx}`,
              url: img.url,
              key: img.key,
              name: img.url.split("/").pop() || `Asset-${post.id.slice(0, 6)}`,
              size: "1.2 MB",
              type: "image/jpeg",
              createdAt: post.scheduled_at,
            });
          }
        });
      }
    });

    return items;
  }, [postsData]);

  // Combine post assets with newly uploaded assets
  const allAssets = useMemo(() => {
    const combined = [...uploadedAssets, ...postAssets];
    // deduplicate by URL
    const map = new Map<string, MediaAsset>();
    combined.forEach((a) => {
      if (!map.has(a.url)) map.set(a.url, a);
    });
    return Array.from(map.values());
  }, [uploadedAssets, postAssets]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || (typeFilter === "image" && asset.type.startsWith("image"));
      return matchesSearch && matchesType;
    });
  }, [allAssets, searchQuery, typeFilter]);

  // Handle File Upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    let successCount = 0;
    const newItems: MediaAsset[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();

        if (data?.image?.url) {
          successCount++;
          newItems.push({
            id: `upload-${Date.now()}-${i}`,
            url: data.image.url,
            key: data.image.key,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            type: file.type,
            createdAt: new Date().toISOString(),
          });
        }
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} asset${successCount > 1 ? "s" : ""}`);
      setUploadedAssets((prev) => [...newItems, ...prev]);
    }
    setIsUploading(false);
  };

  const toggleSelectAsset = (id: string) => {
    setSelectedAssetIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Media Library
            </h1>
            <Badge variant="outline" className="text-xs font-semibold border-border bg-muted/40">
              {allAssets.length} Assets
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Store, organize, and reuse multi-platform media assets for social posts and carousels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFileUpload(e.target.files)} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 gap-1.5"
          >
            <UploadCloud className="size-4" />
            <span>{isUploading ? "Uploading..." : "Upload Assets"}</span>
          </Button>
        </div>
      </div>

      {/* Filter and View Toggle Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search assets by file name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant={typeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("all")}
              className="text-xs h-9 px-3 rounded-lg"
            >
              All
            </Button>
            <Button
              variant={typeFilter === "image" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("image")}
              className="text-xs h-9 px-3 rounded-lg gap-1.5"
            >
              <ImageIcon className="size-3" />
              <span>Images</span>
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-muted/40 self-end sm:self-auto">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="size-8 rounded-md"
            title="Grid View"
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="size-8 rounded-md"
            title="List View"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {/* Drag and Drop Dropzone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-xl p-6 text-center cursor-pointer bg-muted/10 hover:bg-muted/30 transition-all duration-200"
      >
        <UploadCloud className="size-8 mx-auto text-muted-foreground/70 mb-2" />
        <p className="text-xs font-semibold text-foreground">
          Click or drag and drop images here to upload
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Supports JPG, PNG, WEBP, and GIF up to 25MB per file
        </p>
      </div>

      {/* Multi-Select Floating Bar */}
      {selectedAssetIds.length > 0 && (
        <div className="sticky top-4 z-20 flex items-center justify-between p-3 px-4 rounded-xl bg-primary text-primary-foreground shadow-lg animate-in fade-in-0 slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span>{selectedAssetIds.length} asset{selectedAssetIds.length > 1 ? "s" : ""} selected</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsCreateOpen(true)}
              className="text-xs h-8 px-3 font-semibold"
            >
              <Plus className="size-3.5 mr-1" />
              Create Post with Media
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedAssetIds([])}
              className="text-xs h-8 px-2 text-primary-foreground hover:bg-white/20"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Asset Canvas */}
      {postsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
        </div>
      ) : filteredAssets.length === 0 ? (
        <Card className="surface-card">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
              <ImageIcon className="size-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">No media assets found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                Upload creative graphics, photos, or banners to organize your brand assets.
              </p>
            </div>
            <Button 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 bg-primary text-primary-foreground font-semibold shadow-xs"
            >
              <UploadCloud className="size-3.5 mr-1.5" />
              Upload First Asset
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => {
            const isSelected = selectedAssetIds.includes(asset.id);
            return (
              <div
                key={asset.id}
                className={`group relative rounded-xl border overflow-hidden bg-card transition-all duration-200 ${
                  isSelected 
                    ? "border-primary ring-2 ring-primary/40 shadow-sm" 
                    : "border-border hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs"
                }`}
              >
                {/* Media Image Container */}
                <div className="aspect-square w-full bg-muted/30 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={asset.url} 
                    alt={asset.name} 
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />

                  {/* Top Select Checkbox */}
                  <div 
                    onClick={() => toggleSelectAsset(asset.id)}
                    className="absolute top-2 left-2 z-10 cursor-pointer"
                  >
                    <div className={`size-5 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected 
                        ? "bg-primary border-primary text-white" 
                        : "bg-black/40 border-white/60 text-transparent group-hover:border-white"
                    }`}>
                      <CheckCircle2 className="size-3.5 fill-current" />
                    </div>
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setPreviewAsset(asset)}
                      className="size-8 rounded-lg shadow-sm"
                      title="Preview"
                    >
                      <Eye className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="default"
                      onClick={() => setIsCreateOpen(true)}
                      className="size-8 rounded-lg shadow-sm bg-primary hover:bg-primary/90"
                      title="Use in Post"
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Card Footer Metadata */}
                <div className="p-2.5 bg-card">
                  <p className="text-xs font-medium text-foreground truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {asset.size || "1.2 MB"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card className="surface-card">
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAssetIds.includes(asset.id);
                return (
                  <div 
                    key={asset.id}
                    className={`p-3 px-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors ${
                      isSelected ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => toggleSelectAsset(asset.id)}
                        className="size-4 rounded border-border text-primary focus:ring-primary" 
                      />
                      <div className="size-11 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset.url} alt={asset.name} className="size-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">{asset.name}</p>
                        <p className="text-[11px] text-muted-foreground">{asset.size} &bull; {asset.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewAsset(asset)}
                        className="text-xs h-8 px-2.5"
                      >
                        <Eye className="size-3.5 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsCreateOpen(true)}
                        className="text-xs h-8 px-2.5 bg-primary text-primary-foreground font-semibold shadow-xs"
                      >
                        <Plus className="size-3.5 mr-1" />
                        Use
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Preview Modal */}
      <Dialog open={!!previewAsset} onOpenChange={(open) => !open && setPreviewAsset(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold truncate">
              {previewAsset?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {previewAsset?.type} &bull; {previewAsset?.size}
            </DialogDescription>
          </DialogHeader>

          {previewAsset && (
            <div className="rounded-xl overflow-hidden border border-border bg-muted/40 max-h-[450px] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={previewAsset.url} 
                alt={previewAsset.name} 
                className="max-h-[420px] w-auto object-contain rounded-lg" 
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewAsset(null)}
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setPreviewAsset(null);
                setIsCreateOpen(true);
              }}
              className="bg-primary text-primary-foreground font-semibold"
            >
              <Plus className="size-3.5 mr-1.5" />
              Use in New Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Composer Dialog */}
      <CreatePostDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}
