/**
 * API route error handler wrapper
 */
import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse, formatError } from "./error-handler";

/**
 * Wraps an API route handler with error handling
 */
export function withErrorHandler<T = any>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error: any) {
      console.error("API Route Error:", error);
      
      const formatted = formatError(error);
      
      // Determine status code based on error type
      let statusCode = 500;
      if (formatted.type === 'VALIDATION') {
        statusCode = 400;
      } else if (formatted.type === 'AUTHENTICATION') {
        statusCode = 401;
      } else if (formatted.type === 'AUTHORIZATION') {
        statusCode = 403;
      } else if (formatted.type === 'DATABASE' || formatted.type === 'NETWORK') {
        statusCode = 503; // Service Unavailable for connection issues
      }

      const errorResponse = createErrorResponse(error, statusCode);
      
      return NextResponse.json(errorResponse, { status: statusCode });
    }
  };
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse {
  const response: any = { success: true, data };
  if (message) {
    response.message = message;
  }
  return NextResponse.json(response, { status: statusCode });
}

/**
 * Creates a standardized error response
 */
export function createApiErrorResponse(
  error: any,
  statusCode: number = 500
): NextResponse {
  const errorResponse = createErrorResponse(error, statusCode);
  return NextResponse.json(errorResponse, { status: statusCode });
}
