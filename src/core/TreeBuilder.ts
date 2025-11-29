import path from 'path';
import { TreeStructure, FileMetadata } from '../types/index.js';
import { FileSystem } from '../utils/FileSystem.js';
import { IgnoreManager } from '../utils/IgnoreManager.js';
import { Logger } from '../utils/Logger.js';
import { Validator } from '../utils/Validator.js';

export class TreeBuilder {
	constructor(private ignoreManager: IgnoreManager) {}

	async buildTree(
		dirPath: string,
		options: {
			recursive?: boolean;
			depth?: number;
			preview?: boolean;
			maxSize?: number;
			enableCache?: boolean;
		} = {},
	): Promise<TreeStructure> {
		const {
			recursive = true,
			depth = Infinity,
			preview = false,
			maxSize,
			enableCache = true,
		} = options;

		Logger.debug(`Building tree for: ${dirPath}`, {
			recursive,
			maxDepth: depth,
			preview,
			enableCache,
		});

		Logger.performance('Tree building start');

		// Validate directory path
		const validation = Validator.validateFilePath(dirPath);
		if (!validation.isValid) {
			throw new Error(`Invalid directory path: ${validation.error}`);
		}

		const tree = await this.buildTreeRecursive(
			dirPath,
			recursive,
			0,
			depth,
			preview,
			maxSize,
			enableCache,
		);

		Logger.performance('Tree building end');
		Logger.debug(`Tree built successfully with ${Object.keys(tree).length} root items`);

		// Log cache statistics if cache is enabled
		if (enableCache) {
			const cacheStats = FileSystem.getCacheStats();
			Logger.debug(`Cache statistics: ${JSON.stringify(cacheStats)}`);
		}

		return tree;
	}

	private async buildTreeRecursive(
		dirPath: string,
		recursive: boolean,
		currentDepth: number,
		maxDepth: number,
		preview: boolean,
		maxSize?: number,
		enableCache?: boolean,
	): Promise<TreeStructure> {
		Logger.debug(`Processing directory: ${dirPath} (depth: ${currentDepth})`);

		if (currentDepth > maxDepth) {
			Logger.debug(`Max depth reached for: ${dirPath}`);
			return {};
		}

		const tree: TreeStructure = {};
		const items = await FileSystem.readDirectory(dirPath);

		Logger.debug(`Found ${items.length} items in directory: ${dirPath}`);

		// Process items in batches for better performance
		const batchSize = 10;
		for (let i = 0; i < items.length; i += batchSize) {
			const batch = items.slice(i, i + batchSize);
			Logger.debug(
				`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(
					items.length / batchSize,
				)}`,
			);

			const batchPromises = batch.map(async (item) => {
				const fullPath = path.join(dirPath, item);
				const relativePath = path.relative(process.cwd(), fullPath);

				// Check if item should be ignored
				if (this.ignoreManager.shouldIgnore(fullPath, item)) {
					Logger.debug(`Ignored item: ${item}`);
					return null;
				}

				try {
					const metadata = await FileSystem.getFileMetadata(fullPath, relativePath, {
						preview,
						maxSize,
						enableCache,
					});

					if (!metadata) {
						Logger.warn(`Failed to get metadata for: ${fullPath}`,null);
						return null;
					}

					if (metadata.fileType.isDirectory && recursive && currentDepth < maxDepth) {
						Logger.debug(`Entering subdirectory: ${fullPath}`);
						const subtree = await this.buildTreeRecursive(
							fullPath,
							recursive,
							currentDepth + 1,
							maxDepth,
							preview,
							maxSize,
							enableCache,
						);
						tree[item] = subtree;
					} else {
						tree[item] = metadata;
					}
				} catch (error) {
					Logger.error(`Error processing item: ${item}`, error);
					// Continue with other items even if one fails
				}
			});

			// Wait for current batch to complete before processing next batch
			await Promise.all(batchPromises);
		}

		Logger.debug(
			`Completed processing directory: ${dirPath} (processed ${
				Object.keys(tree).length
			} items)`,
		);
		return tree;
	}
}
