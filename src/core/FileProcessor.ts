import path from 'path';
import fastGlob from 'fast-glob';
import { FileMetadata, TreeStructure } from '../types/index.js';
import { FileSystem } from '../utils/FileSystem.js';
import { IgnoreManager } from '../utils/IgnoreManager.js';
import { Logger } from '../utils/Logger.js';
import { Validator } from '../utils/Validator.js';
import { defaultConfig } from '../config/defaults.js';
export class FileProcessor {
	constructor(private ignoreManager: IgnoreManager) {}
	async processFiles(
		patterns: string[],
		options: {
			preview?: boolean;
			maxSize?: number;
			enableCache?: boolean;
			timeout?: number;
		} = {},
	): Promise<TreeStructure> {
		const cfg = await defaultConfig();
		const {
			preview = false,
			maxSize = cfg.maxFileSize,
			enableCache = true,
			timeout = cfg.timeout,
		} = options;
		Logger.debug(`Processing files with patterns: ${patterns.join(', ')}`, {
			preview,
			maxSize,
			enableCache,
			timeout,
		});
		Logger.performance('File processing start');
		const validation = Validator.validatePatterns(patterns);
		if (!validation.isValid) {
			throw new Error(`Invalid patterns: ${validation.error}`);
		}
		const files = await this.expandPatterns(patterns);
		Logger.debug(`Found ${files.length} files matching patterns`);
		const results: TreeStructure = {};
		let processedCount = 0;
		let errorCount = 0;
		const concurrency = cfg.maxConcurrent;
		const batches = this.chunkArray(files, concurrency);
		for (const batch of batches) {
			Logger.debug(`Processing batch of ${batch.length} files`);
			const batchPromises = batch.map(async (filePath) => {
				try {
					const relativePath = path.relative(process.cwd(), filePath);
					const baseName = path.basename(filePath);
					if (this.ignoreManager.shouldIgnore(filePath, baseName)) {
						Logger.debug(`Ignored file: ${filePath}`);
						return null;
					}
					const metadata = await FileSystem.getFileMetadata(filePath, relativePath, {
						preview,
						maxSize,
						enableCache,
					});
					if (metadata) {
						results[baseName] = metadata;
						processedCount++;
					} else {
						errorCount++;
					}
				} catch (error) {
					Logger.error(`Error processing file: ${filePath}`, error);
					errorCount++;
				}
			});
			await Promise.race([
				Promise.all(batchPromises),
				new Promise((_, reject) =>
					setTimeout(() => reject(new Error('File processing timeout')), timeout),
				),
			]).catch((timeoutError) => {
				Logger.error('File processing timeout reached', timeoutError);
				throw timeoutError;
			});
		}
		Logger.performance('File processing end');
		Logger.debug(
			`File processing completed: ${processedCount} successful, ${errorCount} errors`,
		);
		if (processedCount === 0 && errorCount > 0) {
			throw new Error('No files were successfully processed');
		}
		return results;
	}
	private async expandPatterns(patterns: string[]): Promise<string[]> {
		Logger.debug('Expanding file patterns');
		const allFiles: string[] = [];
		for (const pattern of patterns) {
			try {
				Logger.debug(`Expanding pattern: ${pattern}`);
				const files = await fastGlob(pattern, {
					onlyFiles: true,
					absolute: true,
					dot: true,
				});
				Logger.debug(`Pattern "${pattern}" matched ${files.length} files`);
				allFiles.push(...files);
			} catch (error) {
				Logger.error(`Failed to expand pattern: ${pattern}`, error);
			}
		}
		const uniqueFiles = [...new Set(allFiles)].sort();
		Logger.debug(`Total unique files after expansion: ${uniqueFiles.length}`);
		return uniqueFiles;
	}
	private chunkArray<T>(array: T[], chunkSize: number): T[][] {
		const chunks: T[][] = [];
		for (let i = 0; i < array.length; i += chunkSize) {
			chunks.push(array.slice(i, i + chunkSize));
		}
		return chunks;
	}
	async validateFiles(files: string[]): Promise<{ valid: string[]; invalid: string[] }> {
		Logger.debug(`Validating ${files.length} files`);
		const valid: string[] = [];
		const invalid: string[] = [];
		for (const file of files) {
			const validation = Validator.validateFilePath(file);
			if (validation.isValid && (await FileSystem.fileExists(file))) {
				valid.push(file);
			} else {
				invalid.push(file);
				Logger.warn(`Invalid or non-existent file: ${file}`, null);
			}
		}
		Logger.debug(`File validation: ${valid.length} valid, ${invalid.length} invalid`);
		return { valid, invalid };
	}
}
