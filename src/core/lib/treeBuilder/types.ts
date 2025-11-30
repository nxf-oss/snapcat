import { TreeStructure, FileMetadata } from '../../../types/index.js';

export interface TreeBuildOptions {
	recursive?: boolean;
	depth?: number;
	preview?: boolean;
	maxSize?: number;
	enableCache?: boolean;
}

export interface TreeBuilderDependencies {
	ignoreManager: any; // IgnoreManager type
	fileSystem: any; // FileSystem type
}

export interface DirectoryProcessingResult {
	tree: TreeStructure;
	processedItems: number;
}

export interface BatchProcessingOptions {
	batchSize?: number;
	maxDepth?: number;
	currentDepth?: number;
	recursive?: boolean;
	preview?: boolean;
	maxSize?: number;
	enableCache?: boolean;
}

export interface CacheStats {
	hits: number;
	misses: number;
	size: number;
}
