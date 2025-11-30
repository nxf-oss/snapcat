import { FileProcessingOptions, ProcessedResults } from './lib/fileProcessor/types.js';
import { FileProcessorCore } from './lib/fileProcessor/processor.js';
import { FileProcessorLogger } from './lib/fileProcessor/logger.js';
import { IgnoreManager } from '../utils/IgnoreManager.js';
export class FileProcessor {
	private processor: FileProcessorCore;
	constructor(ignoreManager: IgnoreManager) {
		this.processor = new FileProcessorCore({ ignoreManager });
		FileProcessorLogger.setDebugMode(false);
	}
	async processFiles(
		patterns: string[],
		options: FileProcessingOptions = {},
	): Promise<ProcessedResults> {
		FileProcessorLogger.setDebugMode(!!options.enableCache);
		return await this.processor.processFiles(patterns, options);
	}
	clearCache(): void {
		this.processor.clearCache();
	}
	getCacheStats(): { size: number; hits: number } {
		return this.processor.getCacheStats();
	}
}
