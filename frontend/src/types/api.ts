/**
 * API Response Types
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
  tokens: TokenResponse;
}

export interface GeneratePromptRequest {
  topic: string;
  context?: string;
  targetModel: string;
  techniques?: string[];
}

export interface OptimizePromptRequest {
  originalPrompt: string;
  targetModel: string;
  preserveIntent?: boolean;
}

export interface GeneratedVersion {
  type: 'extended' | 'standard' | 'minimal';
  content: string;
  tokenCount: number;
  techniques: string[];
}

export interface GeneratePromptResponse {
  versions: GeneratedVersion[];
  metadata: {
    targetModel: string;
    generatedAt: string;
    processingTime: number;
  };
}

export interface OptimizePromptResponse {
  optimizedPrompt: string;
  improvements: string[];
  originalTokenCount: number;
  optimizedTokenCount: number;
  targetModel: string;
}
