import { promises as fs } from 'fs';
import path from 'path';
import { FileMetadata, FileReaderOptions } from './types.js';
import { FileProcessorLogger } from './logger.js';
export class FileReader {
	static async readFile(
		filePath: string,
		options: FileReaderOptions = {},
	): Promise<FileMetadata> {
		const startTime = Date.now();
		try {
			const stats = await fs.stat(filePath);
			const fileInfo = this.getFileInfo(filePath, stats);
			if (options.maxSize && stats.size > options.maxSize) {
				FileProcessorLogger.debug(`Skipping large file: ${filePath} (${stats.size} bytes)`);
				return { ...fileInfo, error: 'File too large' };
			}
			if (options.preview) {
				FileProcessorLogger.debug(`Preview mode - skipping content for: ${filePath}`);
				return fileInfo;
			}
			const content = await this.readFileContent(filePath, options);
			const lines = content ? content.split('\n').length : 0;
			const processingTime = Date.now() - startTime;
			FileProcessorLogger.debug(`File processed: ${filePath} (${processingTime}ms)`);
			return {
				...fileInfo,
				content,
				lines,
			};
		} catch (error) {
			FileProcessorLogger.debug(`Error reading file: ${filePath}`, { error });
			return this.getFileInfo(
				filePath,
				null,
				error instanceof Error ? error.message : 'Unknown error',
			);
		}
	}
	private static getFileInfo(filePath: string, stats: any | null, error?: string): FileMetadata {
		return {
			path: filePath,
			name: path.basename(filePath),
			size: stats?.size || 0,
			extension: path.extname(filePath).toLowerCase(),
			...(error && { error }),
		};
	}
	private static async readFileContent(
		filePath: string,
		options: FileReaderOptions,
	): Promise<string | undefined> {
		try {
			if (options.timeout) {
				return await Promise.race([
					fs.readFile(filePath, 'utf8'),
					new Promise<never>((_, reject) =>
						setTimeout(() => reject(new Error('File read timeout')), options.timeout),
					),
				]);
			}
			return await fs.readFile(filePath, 'utf8');
		} catch (error) {
			FileProcessorLogger.debug(`Failed to read file content: ${filePath}`, { error });
			return undefined;
		}
	}
	static shouldProcessFile(
		filePath: string,
		ignoreManager: any,
		options: FileReaderOptions,
	): boolean {
		if (ignoreManager.shouldIgnore(filePath)) {
			FileProcessorLogger.debug(`File ignored: ${filePath}`);
			return false;
		}

		return true;
	}
}
