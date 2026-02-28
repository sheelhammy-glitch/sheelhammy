"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { FileUploader } from "./FileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageUrlModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (url: string, alt?: string) => void;
  type?: "image" | "link";
  initialUrl?: string;
  initialText?: string;
}

export function ImageUrlModal({
  open,
  onOpenChange,
  onInsert,
  type = "image",
  initialUrl = "",
  initialText = "",
}: ImageUrlModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [alt, setAlt] = useState(initialText);
  const [error, setError] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");

  useEffect(() => {
    if (open) {
      setUrl(initialUrl);
      setAlt(initialText);
      setUploadedImageUrl(null);
      setError("");
      setActiveTab(initialUrl ? "url" : "upload");
    }
  }, [open, initialUrl, initialText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = activeTab === "upload" ? uploadedImageUrl : url.trim();
    
    if (!finalUrl) {
      setError(activeTab === "upload" ? "الرجاء رفع صورة" : "الرجاء إدخال رابط");
      return;
    }

    if (type === "image") {
      onInsert(finalUrl, alt.trim() || undefined);
    } else {
      onInsert(finalUrl, alt.trim() || undefined);
    }

    setUrl("");
    setAlt("");
    setUploadedImageUrl(null);
    setError("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setUrl("");
    setAlt("");
    setUploadedImageUrl(null);
    setError("");
    onOpenChange(false);
  };

  const imageUrl = activeTab === "upload" ? uploadedImageUrl : url;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {type === "image" ? "إضافة صورة" : "إضافة رابط"}
          </DialogTitle>
          <DialogDescription>
            {type === "image"
              ? "أدخل رابط الصورة لإضافتها إلى المحتوى"
              : "أدخل رابط URL والنص المراد عرضه"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "image" ? (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "url")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                  <Icon icon="solar:upload-bold" className="w-4 h-4 ml-2" style={{ display: "block" }} />
                  رفع ملف
                </TabsTrigger>
                <TabsTrigger value="url">
                  <Icon icon="solar:link-bold" className="w-4 h-4 ml-2" style={{ display: "block" }} />
                  رابط URL
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-4 mt-4">
                <div>
                  <Label>رفع صورة</Label>
                  <FileUploader
                    value={uploadedImageUrl || undefined}
                    onChange={(url) => {
                      const imageUrl = typeof url === "string" ? url : url?.[0] || null;
                      setUploadedImageUrl(imageUrl);
                      setError("");
                    }}
                    accept="image/*"
                    multiple={false}
                    maxSize={5}
                    label="اختر صورة"
                    description="يمكنك رفع صورة (حد أقصى 5 ميجابايت)"
                    type="image"
                  />
                  {error && activeTab === "upload" && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="url" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="url">رابط الصورة *</Label>
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError("");
                    }}
                    placeholder="https://example.com/image.jpg"
                    className={error && activeTab === "url" ? "border-red-500" : ""}
                  />
                  {error && activeTab === "url" && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div>
              <Label htmlFor="url">رابط URL *</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                placeholder="https://example.com"
                required
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
          )}

          {type === "link" && (
            <div>
              <Label htmlFor="text">النص المراد عرضه</Label>
              <Input
                id="text"
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="النص المراد عرضه للرابط"
              />
            </div>
          )}

          {type === "image" && (
            <div>
              <Label htmlFor="alt">النص البديل (Alt Text)</Label>
              <Input
                id="alt"
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="وصف الصورة (اختياري)"
              />
            </div>
          )}

          {imageUrl && type === "image" && (
            <div className="border rounded-lg p-2 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">معاينة:</p>
              <img
                src={imageUrl}
                alt={alt || "Preview"}
                className="max-w-full h-auto rounded max-h-48 mx-auto"
                onError={() => {
                  if (activeTab === "url") {
                    setError("رابط الصورة غير صحيح");
                  }
                }}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button type="submit">
              <Icon icon="solar:check-circle-bold" className="w-4 h-4 ml-2" />
              إضافة
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
