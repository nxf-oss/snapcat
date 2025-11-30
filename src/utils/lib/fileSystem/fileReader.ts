import { promises as fs } from 'fs';
import { FileSystemLogger } from './logger.js';
import { FileSystemCacheManager } from './cacheManager.js';
import { FileStats, FileContentResult } from './types.js';

export class FileReader {
	static async getFileStats(filePath: string, enableCache: boolean = true): Promise<any> {
		if (enableCache) {
			const cachedStats = FileSystemCacheManager.getFileStats(filePath);
			if (cachedStats) {
				return cachedStats;
			}
		}

		const stats = await fs.stat(filePath);

		if (enableCache) {
			FileSystemCacheManager.setFileStats(filePath, stats);
		}

		return stats;
	}

	static async readFileContent(filePath: string, enableCache: boolean = true): Promise<Buffer> {
		if (enableCache) {
			const cachedContent = FileSystemCacheManager.getFileContent(filePath);
			if (cachedContent) {
				return cachedContent.content;
			}
		}

		const content = await fs.readFile(filePath);

		if (enableCache) {
			FileSystemCacheManager.setFileContent(filePath, content);
		}

		return content;
	}

	static async readDirectory(dirPath: string): Promise<string[]> {
		try {
			FileSystemLogger.debug(`Reading directory: ${dirPath}`);
			const items = await fs.readdir(dirPath);
			FileSystemLogger.logDirectoryRead(dirPath, items.length);
			return items;
		} catch (error) {
			FileSystemLogger.error(`Failed to read directory: ${dirPath}`, error);
			return [];
		}
	}

	static async fileExists(filePath: string): Promise<boolean> {
		try {
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}
}
