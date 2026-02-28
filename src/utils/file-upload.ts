import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import {
  ClientFileValidator,
  DEFAULT_IMAGE_CONFIG,
  DEFAULT_PDF_CONFIG,
  DEFAULT_DOCUMENT_CONFIG,
  FileValidationConfig,
} from "./file-validation";

export interface UploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export class ServerFileUploadService {
  private static readonly UPLOAD_DIR = "public/uploads";
  private static readonly USE_BLOB_STORAGE =
    process.env.BLOB_READ_WRITE_TOKEN !== undefined;

  private static sanitizeFilename(filename: string): string {
    const sanitized = filename
      .replace(/[\/\\?%*:|"<>]/g, "_")
      .replace(/\s+/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/^_+|_+$/g, "");

    const maxLength = 255;
    if (sanitized.length > maxLength) {
      const ext = ClientFileValidator.getFileExtension(filename) || "";
      const nameWithoutExt = sanitized.substring(0, maxLength - ext.length - 1);
      return ext ? `${nameWithoutExt}.${ext}` : nameWithoutExt;
    }

    return sanitized || "file";
  }

  static async uploadFile(
    file: File,
    subDir?: string,
    fileType: "image" | "pdf" | "document" = "image",
    preserveFilename: boolean = false
  ): Promise<UploadResult> {
    try {
      let validationConfig: FileValidationConfig;
      switch (fileType) {
        case "pdf":
          validationConfig = DEFAULT_PDF_CONFIG;
          break;
        case "document":
          validationConfig = DEFAULT_DOCUMENT_CONFIG;
          break;
        default:
          validationConfig = DEFAULT_IMAGE_CONFIG;
      }

      const validationError = ClientFileValidator.validateFile(
        file,
        validationConfig
      );
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      let filename: string;
      if (preserveFilename) {
        filename = this.sanitizeFilename(file.name);
        const fileExtension =
          ClientFileValidator.getFileExtension(file.name) ||
          (fileType === "pdf" ? "pdf" : "jpg");
        if (!filename.includes(".")) {
          filename = `${filename}.${fileExtension}`;
        }
      } else {
        const fileExtension =
          ClientFileValidator.getFileExtension(file.name) || "jpg";
        filename = `${randomUUID()}.${fileExtension}`;
      }

      if (this.USE_BLOB_STORAGE) {
        try {
          const blobPath = subDir ? `${subDir}/${filename}` : filename;

          console.log("Attempting to upload to Vercel Blob:", {
            path: blobPath,
            size: file.size,
            type: file.type,
            preserveFilename,
            hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
            isVercel: !!process.env.VERCEL,
          });

          // Dynamic import to avoid build errors when @vercel/blob is not installed
          const { put } = await import("@vercel/blob");
          const blob = await put(blobPath, file, {
            access: "public",
            contentType: file.type || "application/octet-stream",
            addRandomSuffix: !preserveFilename,
            allowOverwrite: preserveFilename,
          });

          console.log("Blob uploaded successfully:", blob.url);

          return {
            success: true,
            filePath: blob.url,
          };
        } catch (blobError) {
          const errorMessage =
            blobError instanceof Error ? blobError.message : String(blobError);
          console.error("Blob storage error:", {
            error: blobError,
            message: errorMessage,
            stack: blobError instanceof Error ? blobError.stack : undefined,
            fileSize: file.size,
            fileName: file.name,
            preserveFilename,
          });

          let userFriendlyError = "حدث خطأ أثناء رفع الملف";

          if (errorMessage.includes("already exists")) {
            userFriendlyError =
              "هذا الملف موجود بالفعل. يرجى اختيار ملف آخر أو تغيير اسم الملف.";
          } else if (errorMessage.includes("BLOB_READ_WRITE_TOKEN")) {
            userFriendlyError =
              "خطأ في إعدادات التخزين. يرجى التواصل مع الدعم الفني.";
          } else if (
            errorMessage.includes("size") ||
            errorMessage.includes("large")
          ) {
            userFriendlyError =
              "حجم الملف كبير جداً. الحد الأقصى هو 4.5 ميجابايت.";
          } else if (
            errorMessage.includes("type") ||
            errorMessage.includes("format")
          ) {
            userFriendlyError =
              "نوع الملف غير مدعوم. يُسمح فقط بملفات الصور (JPEG, PNG, WebP, GIF).";
          } else {
            userFriendlyError = `حدث خطأ أثناء رفع الملف: ${errorMessage}`;
          }

          if (process.env.VERCEL) {
            return {
              success: false,
              error: userFriendlyError,
            };
          }
        }
      }

      const uploadPath = subDir
        ? join(process.cwd(), this.UPLOAD_DIR, subDir)
        : join(process.cwd(), this.UPLOAD_DIR);

      try {
        await mkdir(uploadPath, { recursive: true });
      } catch (error) {}

      const fullPath = join(uploadPath, filename);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(fullPath, buffer);

      const publicPath = subDir
        ? `/uploads/${subDir}/${filename}`
        : `/uploads/${filename}`;

      return {
        success: true,
        filePath: publicPath,
      };
    } catch (error) {
      console.error("File upload error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "حدث خطأ أثناء رفع الملف",
      };
    }
  }
}
