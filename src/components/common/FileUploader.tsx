"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploaderProps {
  value?: string | string[]; // URL or array of URLs
  onChange: (url: string | string[] | null) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  type?: "image" | "file"; // image shows preview, file shows list
}

export function FileUploader({
  value,
  onChange,
  accept = "image/*",
  multiple = false,
  maxFiles = 1,
  maxSize = 10,
  label = "رفع الملفات",
  description,
  disabled = false,
  className,
  type = "image",
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFiles = Array.isArray(value) ? value : value ? [value] : [];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file count
    if (files.length > maxFiles) {
      setUploadError(`يمكنك رفع ${maxFiles} ملف كحد أقصى`);
      return;
    }

    // Validate file sizes
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        setUploadError(`حجم الملف ${file.name} أكبر من ${maxSize} ميجابايت`);
        return;
      }
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "فشل رفع الملف");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      // Update value
      if (multiple) {
        const newUrls = [...currentFiles, ...uploadedUrls];
        onChange(newUrls.slice(0, maxFiles));
      } else {
        onChange(uploadedUrls[0] || null);
      }
      
      setUploadError(null);
    } catch (error: any) {
      setUploadError(error.message || "حدث خطأ أثناء رفع الملف");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    if (Array.isArray(value)) {
      const newUrls = value.filter((_, i) => i !== index);
      onChange(newUrls.length > 0 ? newUrls : null);
    } else {
      onChange(null);
    }
  };

  const handleRemoveAll = () => {
    onChange(null);
  };

  return (
    <div className={cn("space-y-2", className)} dir="rtl">
      {label && <Label>{label}</Label>}
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}

      <div className="space-y-3">
        {/* File Input */}
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="hidden"
            id="file-upload-input"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الرفع...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 ml-2" />
                {multiple ? "رفع ملفات" : "رفع ملف"}
              </>
            )}
          </Button>
        </div>

        {/* Error Message */}
        {uploadError && (
          <p className="text-sm text-red-600">{uploadError}</p>
        )}

        {/* Preview/List */}
        {currentFiles.length > 0 && (
          <div className="space-y-2">
            {type === "image" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentFiles.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg border overflow-hidden bg-gray-100">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemove(index)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {currentFiles.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium truncate max-w-xs">
                        {url.split("/").pop() || `ملف ${index + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        عرض
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(index)}
                        disabled={disabled}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentFiles.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveAll}
                disabled={disabled}
                className="w-full"
              >
                <X className="h-4 w-4 ml-2" />
                حذف الكل
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
