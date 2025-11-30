import { IgnoreManagerLogger } from './logger.js';

export class IgnoreCacheManager {
	private static patternCache = new Map<string, any>();
	private static fileContentCache = new Map<string, string>();

	static getPatterns(key: string): any | null {
		return this.patternCache.get(key) || null;
	}

	static setPatterns(key: string, patterns: any): void {
		this.patternCache.set(key, patterns);
	}

	static getFileContent(filePath: string): string | null {
		return this.fileContentCache.get(filePath) || null;
	}

	static setFileContent(filePath: string, content: string): void {
		this.fileContentCache.set(filePath, content);
	}

	static clearCache(): void {
		IgnoreManagerLogger.debug('Clearing ignore manager cache');
		this.patternCache.clear();
		this.fileContentCache.clear();
	}

	static getCacheStats(): { patternCache: number; fileCache: number } {
		return {
			patternCache: this.patternCache.size,
			fileCache: this.fileContentCache.size,
		};
	}

	static hasFileContent(filePath: string): boolean {
		return this.fileContentCache.has(filePath);
	}

	static hasPatterns(key: string): boolean {
		return this.patternCache.has(key);
	}
}
