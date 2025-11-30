import path from 'path';
import { TreeStructure, FileMetadata } from '../../../types/index.js';
import { TreeBuilderLogger } from './logger.js';
import { BatchProcessingOptions } from './types.js';

export class BatchProcessor {
	private static readonly DEFAULT_BATCH_SIZE = 10;

	static async processBatch(
		items: string[],
		dirPath: string,
		dependencies: any,
		options: BatchProcessingOptions,
	): Promise<TreeStructure> {
		const tree: TreeStructure = {};
		const batchSize = options.batchSize || this.DEFAULT_BATCH_SIZE;

		for (let i = 0; i < items.length; i += batchSize) {
			const batch = items.slice(i, i + batchSize);
			const batchNumber = Math.floor(i / batchSize) + 1;
			const totalBatches = Math.ceil(items.length / batchSize);

			TreeBuilderLogger.logBatchProcessing(batchNumber, totalBatches);

			const batchResults = await this.processBatchItems(
				batch,
				dirPath,
				dependencies,
				options,
			);

			Object.assign(tree, batchResults);
		}

		return tree;
	}

	private static async processBatchItems(
		batch: string[],
		dirPath: string,
		dependencies: any,
		options: BatchProcessingOptions,
	): Promise<TreeStructure> {
		const tree: TreeStructure = {};
		const batchPromises = batch.map(async (item) => {
			const result = await this.processSingleItem(item, dirPath, dependencies, options);
			return { item, result };
		});

		const results = await Promise.all(batchPromises);

		results.forEach(({ item, result }) => {
			if (result !== null) {
				tree[item] = result;
			}
		});

		return tree;
	}

	private static async processSingleItem(
		item: string,
		dirPath: string,
		dependencies: any,
		options: BatchProcessingOptions,
	): Promise<TreeStructure | FileMetadata | null> {
		const fullPath = path.join(dirPath, item);
		const relativePath = path.relative(process.cwd(), fullPath);

		// Check if item should be ignored
		if (dependencies.ignoreManager.shouldIgnore(fullPath, item)) {
			TreeBuilderLogger.logItemIgnored(item);
			return null;
		}

		try {
			const metadata = await dependencies.fileSystem.getFileMetadata(fullPath, relativePath, {
				preview: options.preview,
				maxSize: options.maxSize,
				enableCache: options.enableCache,
			});

			if (!metadata) {
				TreeBuilderLogger.warn(`Failed to get metadata for: ${fullPath}`, null);
				return null;
			}

			if (
				metadata.fileType?.isDirectory &&
				options.recursive &&
				options.currentDepth! < options.maxDepth!
			) {
				TreeBuilderLogger.logEnteringSubdirectory(fullPath);

				// Recursive processing would be handled by the main builder
				// Return metadata to indicate this is a directory that needs further processing
				return metadata;
			}

			return metadata;
		} catch (error) {
			TreeBuilderLogger.error(`Error processing item: ${item}`, error);
			return null;
		}
	}
}
