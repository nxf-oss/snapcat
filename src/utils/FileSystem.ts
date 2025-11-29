import { promises as fs, constants } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { FileMetadata } from '../types/index.js';
import { defaultConfig } from '../config/defaults.js';
import { Logger } from './Logger.js';

export class FileSystem {
	private static fileCache = new Map<string, Buffer>();
	private static statsCache = new Map<string, any>();

	static async getFileMetadata(
		filePath: string,
		relativePath: string,
		options: {
			preview?: boolean;
			maxSize?: number;
			enableCache?: boolean;
		} = {},
	): Promise<FileMetadata | null> {
		const cacheKey = `${filePath}-${options.preview}`;

		try {
			Logger.debug(`Getting file metadata for: ${filePath}`);

			const stats = await this.getFileStats(filePath, options.enableCache);
			const extension = path.extname(filePath);
			const baseName = path.basename(filePath, extension);
			const cfg = await defaultConfig();

			let sha256 = '';
			let sizeFormatted = '';
			let fileContent: string[] = [];
			let lastModified: string | undefined;
			let permissions: string | undefined;

			if (stats.isFile()) {
				Logger.debug(`Processing file: ${filePath} (Size: ${stats.size} bytes)`);

				const content = await this.readFileContent(filePath, options.enableCache);
				sha256 = crypto.createHash('sha256').update(content).digest('hex');
				sizeFormatted = this.formatSize(stats.size);
				lastModified = stats.mtime.toISOString();
				permissions = this.formatPermissions(stats.mode);
				if (
					options.preview &&
					(await this.isTextFile(extension)) &&
					stats.size <= (options.maxSize || cfg.maxFileSize)
				) {
					try {
						Logger.debug(`Reading file content for preview: ${filePath}`);
						const contentStr = content.toString('utf8');
						fileContent = contentStr
							.split('\n')
							.map((line) => line.trim())
							.filter((line) => line !== '');
						Logger.debug(`File content split into ${fileContent.length} lines`);
					} catch (readError) {
						Logger.warn(`Failed to read file content: ${filePath}`, readError);
						fileContent = ['[Error reading file content]'];
					}
				} else if (options.preview) {
					fileContent =
						stats.size > (options.maxSize || cfg.maxFileSize)
							? ['[File too large for preview]']
							: ['[Binary file or unsupported format]'];
				}
			}

			const metadata: FileMetadata = {
				extension,
				fullPath: filePath,
				relativePath,
				baseName,
				size: sizeFormatted,
				sha256,
				fileContent,
				fileType: {
					isFile: stats.isFile(),
					isDirectory: stats.isDirectory(),
					isSymbolicLink: stats.isSymbolicLink(),
				},
				lastModified,
				permissions,
			};

			Logger.debug(`File metadata generated for: ${filePath}`, {
				size: sizeFormatted,
				lines: fileContent.length,
				isFile: stats.isFile(),
			});

			return metadata;
		} catch (error) {
			Logger.error(`Failed to get file metadata: ${filePath}`, error);
			return null;
		}
	}

	public static async getFileStats(filePath: string, enableCache: boolean = true): Promise<any> {
		if (enableCache && this.statsCache.has(filePath)) {
			Logger.debug(`Cache hit for file stats: ${filePath}`);
			return this.statsCache.get(filePath);
		}

		const stats = await fs.stat(filePath);

		if (enableCache) {
			this.statsCache.set(filePath, stats);
		}

		return stats;
	}

	private static async readFileContent(
		filePath: string,
		enableCache: boolean = true,
	): Promise<Buffer> {
		if (enableCache && this.fileCache.has(filePath)) {
			Logger.debug(`Cache hit for file content: ${filePath}`);
			return this.fileCache.get(filePath)!;
		}

		const content = await fs.readFile(filePath);

		if (enableCache) {
			this.fileCache.set(filePath, content);
		}

		return content;
	}

	private static formatSize(bytes: number): string {
		const units = ['B', 'KB', 'MB', 'GB', 'TB'];

		if (bytes === 0) return '0B';

		let size = bytes;
		let unitIndex = 0;

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}

		return `${size.toFixed(2)}${units[unitIndex]}`;
	}

	private static formatPermissions(mode: number): string {
		const permissions = [
			mode & constants.S_IRUSR ? 'r' : '-',
			mode & constants.S_IWUSR ? 'w' : '-',
			mode & constants.S_IXUSR ? 'x' : '-',
			mode & constants.S_IRGRP ? 'r' : '-',
			mode & constants.S_IWGRP ? 'w' : '-',
			mode & constants.S_IXGRP ? 'x' : '-',
			mode & constants.S_IROTH ? 'r' : '-',
			mode & constants.S_IWOTH ? 'w' : '-',
			mode & constants.S_IXOTH ? 'x' : '-',
		].join('');

		return permissions;
	}

	private static async isTextFile(extension: string): Promise<boolean> {
		const cfg = await defaultConfig();
		const isText = cfg.allowedExtensions.includes(extension.toLowerCase());

		Logger.debug(`Checking if ${extension} is text file: ${isText}`);
		return isText;
	}

	static async readDirectory(dirPath: string): Promise<string[]> {
		try {
			Logger.debug(`Reading directory: ${dirPath}`);
			const items = await fs.readdir(dirPath);
			Logger.debug(`Found ${items.length} items in directory: ${dirPath}`);
			return items;
		} catch (error) {
			Logger.error(`Failed to read directory: ${dirPath}`, error);
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

	static clearCache(): void {
		Logger.debug('Clearing file system cache');
		this.fileCache.clear();
		this.statsCache.clear();
	}

	static getCacheStats(): { fileCache: number; statsCache: number } {
		return {
			fileCache: this.fileCache.size,
			statsCache: this.statsCache.size,
		};
	}
}
