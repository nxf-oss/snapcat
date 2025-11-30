import { Logger } from '../../Logger.js';

export class FileSystemLogger {
	static setDebugMode(debug: boolean): void {
		Logger.setDebugMode(debug);
	}

	static debug(message: string, data?: any): void {
		Logger.debug(`[FileSystem] ${message}`, data);
	}

	static info(message: string): void {
		Logger.info(`[FileSystem] ${message}`);
	}

	static warn(message: string, error?: any): void {
		Logger.warn(`[FileSystem] ${message}`, error);
	}

	static error(message: string, error?: any): void {
		Logger.error(`[FileSystem] ${message}`, error);
	}

	static logFileMetadata(filePath: string, metadata: any): void {
		this.debug(`File metadata generated for: ${filePath}`, {
			size: metadata.size,
			lines: metadata.fileContent.length,
			isFile: metadata.fileType.isFile,
		});
	}

	static logFileProcessing(filePath: string, size: number): void {
		this.debug(`Processing file: ${filePath} (Size: ${size} bytes)`);
	}

	static logCacheHit(filePath: string, type: 'stats' | 'content'): void {
		this.debug(`Cache hit for file ${type}: ${filePath}`);
	}

	static logDirectoryRead(dirPath: string, itemCount: number): void {
		this.debug(`Found ${itemCount} items in directory: ${dirPath}`);
	}

	static logFileContentRead(filePath: string, lineCount: number): void {
		this.debug(`File content split into ${lineCount} lines`);
	}

	static logTextFileCheck(extension: string, isText: boolean): void {
		this.debug(`Checking if ${extension} is text file: ${isText}`);
	}

	static logCacheClear(): void {
		this.debug('Clearing file system cache');
	}
}
