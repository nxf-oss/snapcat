import { TreeStructure } from '../types/index.js';
import { IgnoreManager } from '../utils/IgnoreManager.js';
import { FileSystem } from '../utils/FileSystem.js';
import { TreeBuilderCore } from './lib/treeBuilder/builder.js';
import { TreeBuilderLogger } from './lib/treeBuilder/logger.js';
import { TreeBuildOptions } from './lib/treeBuilder/types.js';

export class TreeBuilder {
	private builder: TreeBuilderCore;

	constructor(private ignoreManager: IgnoreManager) {
		this.builder = new TreeBuilderCore({
			ignoreManager,
			fileSystem: FileSystem, // Assuming FileSystem is a static class
		});

		TreeBuilderLogger.setDebugMode(false);
	}

	async buildTree(dirPath: string, options: TreeBuildOptions = {}): Promise<TreeStructure> {
		// Set debug mode based on options
		TreeBuilderLogger.setDebugMode(!!options.enableCache);

		return await this.builder.buildTree(dirPath, options);
	}

	// Optional: Expose cache management methods
	getCacheStats() {
		return this.builder.getCacheStats();
	}

	clearCache(): void {
		this.builder.clearCache();
	}
}
