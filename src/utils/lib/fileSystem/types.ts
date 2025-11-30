import { FileMetadata } from '../../../types/index.js';

export interface FileSystemOptions {
	preview?: boolean;
	maxSize?: number;
	enableCache?: boolean;
}

export interface FileStats {
	isFile: () => boolean;
	isDirectory: () => boolean;
	isSymbolicLink: () => boolean;
	size: number;
	mtime: Date;
	mode: number;
}

export interface CacheStats {
	fileCache: number;
	statsCache: number;
}

export interface FileContentResult {
	content: Buffer;
	fromCache: boolean;
}

export interface MetadataBuildOptions {
	filePath: string;
	relativePath: string;
	stats: FileStats;
	options: FileSystemOptions;
}
