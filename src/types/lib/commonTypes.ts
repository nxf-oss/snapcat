export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type OutputFormat = 'json' | 'md' | 'text' | 'yaml';

export interface CacheEntry<T = any> {
	data: T;
	timestamp: number;
	ttl: number;
	key: string;
}

export interface CacheStats {
	hits: number;
	misses: number;
	size: number;
	keys: number;
	hitRate: number;
}

export interface PerformanceMetrics {
	startTime: number;
	endTime: number;
	duration: number;
	memoryUsed: number;
	filesProcessed: number;
}

export interface ErrorWithContext {
	message: string;
	code?: string;
	stack?: string;
	context?: Record<string, any>;
	timestamp: Date;
}

export interface ValidationResult {
	isValid: boolean;
	error?: string;
	warnings?: string[];
}

export interface PaginationOptions {
	page?: number;
	limit?: number;
	offset?: number;
}
