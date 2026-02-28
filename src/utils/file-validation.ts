export interface FileValidationConfig {
  maxSize: number; // in bytes
  allowedTypes: string[];
  allowedExtensions?: string[];
}

export const DEFAULT_IMAGE_CONFIG: FileValidationConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  allowedExtensions: ["jpg", "jpeg", "png", "gif", "webp"],
};

export const DEFAULT_PDF_CONFIG: FileValidationConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["application/pdf"],
  allowedExtensions: ["pdf"],
};

export const DEFAULT_DOCUMENT_CONFIG: FileValidationConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  allowedExtensions: ["pdf", "doc", "docx", "xls", "xlsx"],
};

export class ClientFileValidator {
  static getFileExtension(filename: string): string | null {
    const parts = filename.split(".");
    if (parts.length < 2) return null;
    return parts[parts.length - 1].toLowerCase();
  }

  static validateFile(
    file: File,
    config: FileValidationConfig
  ): string | null {
    // Check file size
    if (file.size > config.maxSize) {
      const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(2);
      return `حجم الملف كبير جداً. الحد الأقصى هو ${maxSizeMB} ميجابايت.`;
    }

    // Check file type
    if (config.allowedTypes.length > 0) {
      if (!config.allowedTypes.includes(file.type)) {
        return `نوع الملف غير مدعوم. الأنواع المسموحة: ${config.allowedTypes.join(", ")}`;
      }
    }

    // Check file extension
    if (config.allowedExtensions && config.allowedExtensions.length > 0) {
      const extension = this.getFileExtension(file.name);
      if (!extension || !config.allowedExtensions.includes(extension)) {
        return `امتداد الملف غير مدعوم. الامتدادات المسموحة: ${config.allowedExtensions.join(", ")}`;
      }
    }

    return null; // File is valid
  }
}
