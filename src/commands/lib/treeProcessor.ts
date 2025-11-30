import path from 'path';
import { IgnoreManager } from '../../utils/IgnoreManager.js';
import { TreeBuilder } from '../../core/TreeBuilder.js';
import { TreeCommandOptions, TreeStructure } from './treeTypes.js';
import { TreeLogger } from './treeLogger.js';
export class TreeProcessor {
	private ignoreManager: IgnoreManager;
	private treeBuilder: TreeBuilder;
	constructor() {
		this.ignoreManager = new IgnoreManager();
		this.treeBuilder = new TreeBuilder(this.ignoreManager);
	}
	async initializeIgnoreManager(
		basePath: string,
		customIgnorePatterns?: string[],
	): Promise<void> {
		await this.ignoreManager.initialize(basePath);
		if (customIgnorePatterns && customIgnorePatterns.length > 0) {
			this.ignoreManager.addPatterns(customIgnorePatterns);
			TreeLogger.debug(`Added custom ignore patterns: ${customIgnorePatterns.join(', ')}`);
		}
	}
	async buildTree(targetPath: string, options: TreeCommandOptions): Promise<TreeStructure> {
		TreeLogger.info(`Building file tree for: ${targetPath}`);
		return await this.treeBuilder.buildTree(targetPath, {
			recursive: options.recursive ?? true,
			depth: options.depth ?? Infinity,
			preview: options.preview ?? false,
			maxSize: options.maxSize,
			enableCache: !options.debug,
		});
	}
}
