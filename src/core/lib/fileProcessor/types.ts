import { IgnoreManager } from '../../../utils/IgnoreManager.js';
export interface FileProcessingOptions {
	preview?: boolean;
	maxSize?: number;
	enableCache?: boolean;
	timeout?: number;
}
export interface FileMetadata {
	path: string;
	name: string;
	size: number;
	extension: string;
	content?: string;
	lines?: number;
	error?: string;
}
export interface ProcessedResults {
	[filePath: string]: FileMetadata;
}
export interface FileProcessorDependencies {
	ignoreManager: IgnoreManager;
}
export interface CacheEntry {
	metadata: FileMetadata;
	timestamp: number;
	size: number;
}
export interface FileReaderOptions {
	maxSize?: number;
	preview?: boolean;
	timeout?: number;
}
