import { glob } from 'glob';
import { FileProcessingOptions, ProcessedResults, FileProcessorDependencies } from './types.js';
import { FileReader } from './fileReader.js';
import { CacheManager } from './cacheManager.js';
import { FileProcessorValidator } from './validator.js';
import { FileProcessorLogger } from './logger.js';
export class FileProcessorCore {
	private cacheManager: CacheManager;
	private dependencies: FileProcessorDependencies;
	constructor(dependencies: FileProcessorDependencies) {
		this.dependencies = dependencies;
		this.cacheManager = new CacheManager();
	}
	async processFiles(
		patterns: string[],
		options: FileProcessingOptions = {},
	): Promise<ProcessedResults> {
		const startTime = Date.now();
		FileProcessorLogger.logProcessingStart(patterns, options);
		FileProcessorValidator.validateOptions(options);
		FileProcessorValidator.validateFilePatterns(patterns);
		const files = await this.expandPatterns(patterns);
		FileProcessorLogger.debug(`Found ${files.length} files matching patterns`);
		const results: ProcessedResults = {};
		const processingPromises = files.map((filePath) =>
			this.processSingleFile(filePath, options),
		);
		const processedFiles = await Promise.all(processingPromises);
		processedFiles.forEach((file) => {
			if (file) {
				results[file.path] = file;
			}
		});
		const processingTime = Date.now() - startTime;
		FileProcessorLogger.logProcessingComplete(Object.keys(results).length, processingTime);
		if (options.enableCache) {
			FileProcessorLogger.logCacheStats(this.cacheManager.getStats());
		}
		return results;
	}
	private async expandPatterns(patterns: string[]): Promise<string[]> {
		const allFiles: string[] = [];
		for (const pattern of patterns) {
			try {
				const files = await glob(pattern, {
					nodir: true,
					ignore: this.dependencies.ignoreManager.getPatterns(),
				});
				allFiles.push(...files);
			} catch (error) {
				FileProcessorLogger.warn(`Failed to expand pattern: ${pattern}`, error);
			}
		}
		const uniqueFiles = [...new Set(allFiles)].filter((filePath) =>
			FileReader.shouldProcessFile(filePath, this.dependencies.ignoreManager, {}),
		);
		return uniqueFiles;
	}
	private async processSingleFile(filePath: string, options: FileProcessingOptions) {
		try {
			if (options.enableCache) {
				const cached = this.cacheManager.get(filePath);
				if (cached) {
					return cached;
				}
			}
			const fileMetadata = await FileReader.readFile(filePath, options);
			if (options.enableCache && !fileMetadata.error) {
				this.cacheManager.set(filePath, fileMetadata);
			}
			return fileMetadata;
		} catch (error) {
			FileProcessorLogger.error(`Failed to process file: ${filePath}`, error);
			return null;
		}
	}
	clearCache(): void {
		this.cacheManager.clear();
	}
	getCacheStats(): { size: number; hits: number } {
		return this.cacheManager.getStats();
	}
}
