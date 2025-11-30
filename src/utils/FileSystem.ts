import { FileMetadata } from '../types/index.js';
import { FileSystemOptions } from './lib/fileSystem/types.js';
import { FileReader } from './lib/fileSystem/fileReader.js';
import { FileSystemCacheManager } from './lib/fileSystem/cacheManager.js';
import { MetadataBuilder } from './lib/fileSystem/metadataBuilder.js';
import { FileSystemValidator } from './lib/fileSystem/validator.js';
import { FileSystemLogger } from './lib/fileSystem/logger.js';

export class FileSystem {
	static async getFileMetadata(
		filePath: string,
		relativePath: string,
		options: FileSystemOptions = {},
	): Promise<FileMetadata | null> {
		FileSystemValidator.validateFilePath(filePath);
		FileSystemValidator.validateOptions(options);

		try {
			const stats = await FileReader.getFileStats(filePath, options.enableCache);

			return await MetadataBuilder.buildFileMetadata({
				filePath,
				relativePath,
				stats,
				options,
			});
		} catch (error) {
			FileSystemLogger.error(`Failed to get file metadata: ${filePath}`, error);
			return null;
		}
	}

	static async readDirectory(dirPath: string): Promise<string[]> {
		return await FileReader.readDirectory(dirPath);
	}

	static async fileExists(filePath: string): Promise<boolean> {
		return await FileReader.fileExists(filePath);
	}

	static clearCache(): void {
		FileSystemCacheManager.clearCache();
	}

	static getCacheStats() {
		return FileSystemCacheManager.getCacheStats();
	}
}
