/**
 * Error handling utilities for database and API errors
 */

export interface FormattedError {
  message: string;
  userMessage: string;
  type: 'DATABASE' | 'VALIDATION' | 'AUTHENTICATION' | 'AUTHORIZATION' | 'NETWORK' | 'SERVER' | 'UNKNOWN';
  code?: string;
  details?: string;
  retryable: boolean;
}

/**
 * Checks if an error is a database pool timeout error
 */
function isPoolTimeoutError(error: any): boolean {
  const errorMessage = error?.message || String(error);
  return (
    errorMessage.includes('pool timeout') ||
    errorMessage.includes('failed to retrieve a connection from pool') ||
    errorMessage.includes('acquireTimeout') ||
    errorMessage.includes('connection pool') ||
    error?.code === 'ETIMEDOUT' ||
    error?.code === 'ECONNREFUSED' ||
    error?.code === 'PROTOCOL_CONNECTION_LOST'
  );
}

/**
 * Checks if an error is a database connection error
 */
function isDatabaseConnectionError(error: any): boolean {
  const errorMessage = error?.message || String(error);
  return (
    isPoolTimeoutError(error) ||
    errorMessage.includes('ECONNREFUSED') ||
    errorMessage.includes('ENOTFOUND') ||
    errorMessage.includes('ETIMEDOUT') ||
    errorMessage.includes('Connection lost') ||
    errorMessage.includes('Can\'t reach database server') ||
    error?.code === 'P1001' || // Prisma connection error
    error?.code === 'P1002' || // Prisma connection timeout
    error?.code === 'P1003' || // Prisma database does not exist
    error?.code === 'P1017'    // Prisma server closed connection
  );
}

/**
 * Checks if an error is a Prisma error
 */
function isPrismaError(error: any): boolean {
  return (
    error?.code?.startsWith('P') ||
    error?.meta !== undefined ||
    error?.clientVersion !== undefined
  );
}

/**
 * Formats database errors into user-friendly messages
 */
export function formatDatabaseError(error: any): FormattedError {
  const errorMessage = error?.message || String(error);
  const errorCode = error?.code;

  // Pool timeout errors
  if (isPoolTimeoutError(error)) {
    return {
      message: errorMessage,
      userMessage: 'انتهت مهلة الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى بعد قليل.',
      type: 'DATABASE',
      code: errorCode || 'POOL_TIMEOUT',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      retryable: true,
    };
  }

  // Connection errors
  if (isDatabaseConnectionError(error)) {
    return {
      message: errorMessage,
      userMessage: 'لا يمكن الاتصال بقاعدة البيانات. يرجى التحقق من الاتصال والمحاولة مرة أخرى.',
      type: 'DATABASE',
      code: errorCode || 'CONNECTION_ERROR',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      retryable: true,
    };
  }

  // Prisma errors
  if (isPrismaError(error)) {
    // Foreign key constraint error (P2003)
    if (errorCode === 'P2003') {
      const fieldName = error?.meta?.field_name || error?.meta?.fieldName || '';
      const modelName = error?.meta?.model_name || error?.meta?.modelName || '';
      
      // Map common field names to Arabic
      const fieldNames: Record<string, string> = {
        'clientId': 'العميل',
        'projectId': 'المشروع',
        'packageId': 'الباقة',
        'supplierId': 'المورد',
        'employeeId': 'الموظف',
        'invoiceId': 'الفاتورة',
        'orderId': 'الطلب',
        'materialId': 'المادة',
        'serviceId': 'الخدمة',
        'productId': 'المنتج',
        'taskId': 'المهمة',
        'userId': 'المستخدم',
      };

      const fieldDisplayName = fieldNames[fieldName] || fieldName;
      
      let userMessage = `المرجع المحدد في حقل "${fieldDisplayName}" غير موجود. يرجى التأكد من اختيار قيمة صحيحة.`;
      
      if (modelName) {
        const modelNames: Record<string, string> = {
          'Client': 'العميل',
          'Project': 'المشروع',
          'Package': 'الباقة',
          'Supplier': 'المورد',
          'Employee': 'الموظف',
          'Invoice': 'الفاتورة',
          'Order': 'الطلب',
          'Material': 'المادة',
          'Service': 'الخدمة',
          'Product': 'المنتج',
          'Task': 'المهمة',
          'User': 'المستخدم',
        };
        const modelDisplayName = modelNames[modelName] || modelName;
        userMessage = `المرجع المحدد في حقل "${fieldDisplayName}" غير موجود في ${modelDisplayName}. يرجى التأكد من اختيار قيمة صحيحة.`;
      }

      return {
        message: errorMessage,
        userMessage,
        type: 'DATABASE',
        code: errorCode,
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        retryable: false,
      };
    }

    // Unique constraint error (P2002)
    if (errorCode === 'P2002') {
      const target = error?.meta?.target || [];
      const fieldName = Array.isArray(target) ? target[0] : target;
      
      const fieldNames: Record<string, string> = {
        'email': 'البريد الإلكتروني',
        'phone': 'رقم الهاتف',
        'slug': 'الرابط',
        'invoiceNumber': 'رقم الفاتورة',
        'orderNumber': 'رقم الطلب',
        'username': 'اسم المستخدم',
      };

      const fieldDisplayName = fieldNames[fieldName] || fieldName;
      const userMessage = `هذا ${fieldDisplayName} مستخدم بالفعل. يرجى اختيار قيمة أخرى.`;

      return {
        message: errorMessage,
        userMessage,
        type: 'DATABASE',
        code: errorCode,
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        retryable: false,
      };
    }

    // Record not found error (P2025)
    if (errorCode === 'P2025') {
      const modelName = error?.meta?.model_name || error?.meta?.modelName || '';
      const modelNames: Record<string, string> = {
        'Client': 'العميل',
        'Project': 'المشروع',
        'Package': 'الباقة',
        'Supplier': 'المورد',
        'Employee': 'الموظف',
        'Invoice': 'الفاتورة',
        'Order': 'الطلب',
        'Material': 'المادة',
        'Service': 'الخدمة',
        'Product': 'المنتج',
        'Task': 'المهمة',
        'User': 'المستخدم',
        'Testimonial': 'الشهادة',
      };
      const modelDisplayName = modelNames[modelName] || modelName;
      const userMessage = `${modelDisplayName} غير موجود.`;

      return {
        message: errorMessage,
        userMessage,
        type: 'DATABASE',
        code: errorCode,
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        retryable: false,
      };
    }

    // Common Prisma error codes
    const prismaErrorMessages: Record<string, string> = {
      P1001: 'لا يمكن الاتصال بقاعدة البيانات',
      P1002: 'انتهت مهلة الاتصال',
      P1003: 'قاعدة البيانات غير موجودة',
      P1017: 'تم إغلاق الاتصال من قبل الخادم',
      P2000: 'القيمة المحددة كبيرة جداً',
      P2001: 'السجل المطلوب غير موجود',
      P2004: 'فشل القيد في قاعدة البيانات',
      P2005: 'قيمة الحقل غير صالحة',
      P2006: 'قيمة الحقل غير صالحة',
      P2007: 'خطأ في التحقق من صحة البيانات',
      P2008: 'خطأ في استعلام قاعدة البيانات',
      P2009: 'خطأ في التحقق من صحة الاستعلام',
      P2010: 'خطأ في قاعدة البيانات',
      P2011: 'فشل القيد',
      P2012: 'خطأ في البيانات المطلوبة',
      P2013: 'خطأ في العلاقة بين البيانات',
      P2014: 'فشل القيد في العلاقة',
      P2015: 'السجل المرتبط غير موجود',
      P2016: 'خطأ في تفسير الاستعلام',
      P2017: 'السجلات المرتبطة غير موجودة',
      P2018: 'السجلات المطلوبة غير موجودة',
      P2019: 'خطأ في القيد',
      P2020: 'القيمة خارج النطاق',
      P2021: 'الجدول غير موجود في قاعدة البيانات',
      P2022: 'العمود غير موجود في قاعدة البيانات',
      P2023: 'خطأ في البيانات',
      P2024: 'خطأ في الاتصال',
      P2026: 'السجل غير موجود',
      P2027: 'خطأ في التحقق من صحة البيانات',
    };

    const userMessage = prismaErrorMessages[errorCode] || 'حدث خطأ في قاعدة البيانات';

    return {
      message: errorMessage,
      userMessage,
      type: 'DATABASE',
      code: errorCode,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      retryable: errorCode === 'P1001' || errorCode === 'P1002' || errorCode === 'P1017',
    };
  }

  // Generic database error
  return {
    message: errorMessage,
    userMessage: 'حدث خطأ في قاعدة البيانات. يرجى المحاولة مرة أخرى.',
    type: 'DATABASE',
    code: errorCode,
    details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    retryable: true,
  };
}

/**
 * Formats any error into a standardized format
 */
export function formatError(error: any): FormattedError {
  // If error already has formatted property (from handlePrismaError), use it
  if (error?.formatted) {
    return error.formatted;
  }

  // Database errors
  if (isDatabaseConnectionError(error) || isPrismaError(error)) {
    return formatDatabaseError(error);
  }

  // Validation errors (Zod, etc.)
  if (error?.issues && Array.isArray(error.issues)) {
    const firstIssue = error.issues[0];
    return {
      message: error.message || 'Validation error',
      userMessage: firstIssue?.message || 'بيانات غير صحيحة',
      type: 'VALIDATION',
      code: 'VALIDATION_ERROR',
      details: process.env.NODE_ENV === 'development' ? JSON.stringify(error.issues) : undefined,
      retryable: false,
    };
  }

  // Network errors
  if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND' || error?.code === 'ETIMEDOUT') {
    return {
      message: error.message || 'Network error',
      userMessage: 'خطأ في الاتصال بالشبكة. يرجى التحقق من الاتصال والمحاولة مرة أخرى.',
      type: 'NETWORK',
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      retryable: true,
    };
  }

  // Error objects with message
  if (error instanceof Error) {
    // Check if message contains Arabic keywords that indicate it's a user-friendly message
    const hasArabicKeywords = /(خطأ|مطلوب|يجب|غير موجود|مستخدم|صحيح|صحيحة|صالح|صالحة|فشل|فشلت)/.test(error.message);
    
    return {
      message: error.message,
      userMessage: hasArabicKeywords || error.message.length < 100 
        ? error.message 
        : `حدث خطأ: ${error.message.substring(0, 100)}${error.message.length > 100 ? '...' : ''}`,
      type: 'SERVER',
      code: (error as any)?.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      retryable: false,
    };
  }

  // String errors
  if (typeof error === 'string') {
    return {
      message: error,
      userMessage: error.includes('خطأ') ? error : 'حدث خطأ غير متوقع',
      type: 'UNKNOWN',
      retryable: false,
    };
  }

  // Unknown error format
  return {
    message: String(error),
    userMessage: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    type: 'UNKNOWN',
    details: process.env.NODE_ENV === 'development' ? JSON.stringify(error) : undefined,
    retryable: false,
  };
}

/**
 * Creates a standardized API error response
 */
export function createErrorResponse(
  error: any,
  statusCode: number = 500
): { error: string; details?: string; code?: string; retryable?: boolean } {
  const formatted = formatError(error);

  const response: any = {
    error: formatted.userMessage,
  };

  if (formatted.code) {
    response.code = formatted.code;
  }

  if (formatted.details && process.env.NODE_ENV === 'development') {
    response.details = formatted.details;
  }

  if (formatted.retryable !== undefined) {
    response.retryable = formatted.retryable;
  }

  return response;
}

/**
 * Wraps an async function with error handling
 */
export async function handleAsyncError<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: any) => FormattedError
): Promise<{ success: true; data: T } | { success: false; error: FormattedError }> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    const formatted = errorHandler ? errorHandler(error) : formatError(error);
    console.error('Async error:', error);
    return { success: false, error: formatted };
  }
}
