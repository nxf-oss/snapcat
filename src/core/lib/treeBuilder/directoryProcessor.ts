import path from 'path';
import { TreeStructure, FileMetadata } from '../../../types/index.js';
import { TreeBuilderLogger } from './logger.js';
import { TreeBuildOptions } from './types.js';

export class DirectoryProcessor {
	constructor(private dependencies: any) {}

	async processDirectory(
		dirPath: string,
		options: TreeBuildOptions & { currentDepth?: number } = {},
	): Promise<TreeStructure> {
		const {
			recursive = true,
			depth = Infinity,
			preview = false,
			maxSize,
			enableCache = true,
			currentDepth = 0,
		} = options;

		TreeBuilderLogger.logDirectoryProcessing(dirPath, currentDepth);

		if (currentDepth > depth) {
			TreeBuilderLogger.logMaxDepthReached(dirPath);
			return {};
		}

		const items = await this.dependencies.fileSystem.readDirectory(dirPath);
		TreeBuilderLogger.debug(`Found ${items.length} items in directory: ${dirPath}`);

		const tree: TreeStructure = {};

		for (const item of items) {
			const result = await this.processDirectoryItem(item, dirPath, {
				recursive,
				depth,
				preview,
				maxSize,
				enableCache,
				currentDepth,
			});

			if (result) {
				tree[item] = result;
			}
		}

		TreeBuilderLogger.logDirectoryComplete(dirPath, Object.keys(tree).length);
		return tree;
	}

	private async processDirectoryItem(
		item: string,
		dirPath: string,
		options: any,
	): Promise<TreeStructure | FileMetadata | null> {
		const fullPath = path.join(dirPath, item);
		const relativePath = path.relative(process.cwd(), fullPath);

		// Check if item should be ignored
		if (this.dependencies.ignoreManager.shouldIgnore(fullPath, item)) {
			TreeBuilderLogger.logItemIgnored(item);
			return null;
		}

		try {
			const metadata = await this.dependencies.fileSystem.getFileMetadata(
				fullPath,
				relativePath,
				{
					preview: options.preview,
					maxSize: options.maxSize,
					enableCache: options.enableCache,
				},
			);

			if (!metadata) {
				TreeBuilderLogger.warn(`Failed to get metadata for: ${fullPath}`, null);
				return null;
			}

			if (
				metadata.fileType?.isDirectory &&
				options.recursive &&
				options.currentDepth < options.depth
			) {
				TreeBuilderLogger.logEnteringSubdirectory(fullPath);

				const subtree = await this.processDirectory(fullPath, {
					...options,
					currentDepth: options.currentDepth + 1,
				});

				return subtree;
			}

			return metadata;
		} catch (error) {
			TreeBuilderLogger.error(`Error processing item: ${item}`, error);
			return null;
		}
	}
}
