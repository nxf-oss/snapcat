import { FileMetadata, CacheEntry } from './types.js';
import { FileProcessorLogger } from './logger.js';
export class CacheManager {
	private cache: Map<string, CacheEntry> = new Map();
	private readonly defaultTTL: number = 5 * 60 * 1000;
	set(filePath: string, metadata: FileMetadata, ttl?: number): void {
		const entry: CacheEntry = {
			metadata,
			timestamp: Date.now(),
			size: JSON.stringify(metadata).length,
		};
		this.cache.set(filePath, entry);
		FileProcessorLogger.debug(`Cache set for: ${filePath}`);
	}
	get(filePath: string): FileMetadata | null {
		const entry = this.cache.get(filePath);
		if (!entry) {
			return null;
		}
		const isExpired = Date.now() - entry.timestamp > this.defaultTTL;
		if (isExpired) {
			this.cache.delete(filePath);
			FileProcessorLogger.debug(`Cache expired for: ${filePath}`);
			return null;
		}
		FileProcessorLogger.debug(`Cache hit for: ${filePath}`);
		return entry.metadata;
	}
	delete(filePath: string): void {
		this.cache.delete(filePath);
		FileProcessorLogger.debug(`Cache deleted for: ${filePath}`);
	}
	clear(): void {
		this.cache.clear();
		FileProcessorLogger.debug('Cache cleared');
	}
	getStats(): { size: number; hits: number } {
		return {
			size: this.cache.size,
			hits: Array.from(this.cache.values()).reduce((acc, entry) => acc + entry.size, 0),
		};
	}
}
