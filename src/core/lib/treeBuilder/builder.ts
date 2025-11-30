import { TreeStructure } from '../../../types/index.js';
import { CacheStats, TreeBuildOptions, TreeBuilderDependencies } from './types.js';
import { TreeBuilderValidator } from './validator.js';
import { TreeBuilderLogger } from './logger.js';
import { DirectoryProcessor } from './directoryProcessor.js';
import { TreeBuilderCacheManager } from './cacheManager.js';

export class TreeBuilderCore {
	private directoryProcessor: DirectoryProcessor;

	constructor(private dependencies: TreeBuilderDependencies) {
		this.directoryProcessor = new DirectoryProcessor(dependencies);
	}

	async buildTree(dirPath: string, options: TreeBuildOptions = {}): Promise<TreeStructure> {
		const {
			recursive = true,
			depth = Infinity,
			preview = false,
			maxSize,
			enableCache = true,
		} = options;

		TreeBuilderLogger.performance('Tree building start');
		TreeBuilderLogger.logBuildStart(dirPath, {
			recursive,
			maxDepth: depth,
			preview,
			enableCache,
		});

		// Validate inputs
		TreeBuilderValidator.validateDirectoryPath(dirPath);
		TreeBuilderValidator.validateBuildOptions(options);

		// Build the tree
		const tree = await this.directoryProcessor.processDirectory(dirPath, {
			recursive,
			depth,
			preview,
			maxSize,
			enableCache,
			currentDepth: 0,
		});

		TreeBuilderLogger.performance('Tree building end');
		TreeBuilderLogger.logBuildComplete(Object.keys(tree).length);

		// Log cache statistics if cache is enabled
		if (enableCache) {
			TreeBuilderCacheManager.getCacheStats(this.dependencies.fileSystem);
		}

		return tree;
	}

	getCacheStats(): CacheStats {
		return TreeBuilderCacheManager.getCacheStats(this.dependencies.fileSystem);
	}

	clearCache(): void {
		TreeBuilderCacheManager.clearCache(this.dependencies.fileSystem);
	}
}
