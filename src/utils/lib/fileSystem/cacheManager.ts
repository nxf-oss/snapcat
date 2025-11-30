import { FileSystemLogger } from './logger.js';
import { CacheStats, FileContentResult } from './types.js';

export class FileSystemCacheManager {
	private static fileCache = new Map<string, Buffer>();
	private static statsCache = new Map<string, any>();

	static getFileStats(filePath: string): any | null {
		if (this.statsCache.has(filePath)) {
			FileSystemLogger.logCacheHit(filePath, 'stats');
			return this.statsCache.get(filePath);
		}
		return null;
	}

	static setFileStats(filePath: string, stats: any): void {
		this.statsCache.set(filePath, stats);
	}

	static getFileContent(filePath: string): FileContentResult | null {
		if (this.fileCache.has(filePath)) {
			FileSystemLogger.logCacheHit(filePath, 'content');
			return {
				content: this.fileCache.get(filePath)!,
				fromCache: true,
			};
		}
		return null;
	}

	static setFileContent(filePath: string, content: Buffer): void {
		this.fileCache.set(filePath, content);
	}

	static clearCache(): void {
		FileSystemLogger.logCacheClear();
		this.fileCache.clear();
		this.statsCache.clear();
	}

	static getCacheStats(): CacheStats {
		return {
			fileCache: this.fileCache.size,
			statsCache: this.statsCache.size,
		};
	}

	static hasFileStats(filePath: string): boolean {
		return this.statsCache.has(filePath);
	}

	static hasFileContent(filePath: string): boolean {
		return this.fileCache.has(filePath);
	}
}
