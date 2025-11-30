import { Logger } from '../../../utils/Logger.js';

export class TreeBuilderLogger {
	static setDebugMode(debug: boolean): void {
		Logger.setDebugMode(debug);
	}

	static debug(message: string, data?: any): void {
		Logger.debug(`[TreeBuilder] ${message}`, data);
	}

	static info(message: string): void {
		Logger.info(`[TreeBuilder] ${message}`);
	}

	static warn(message: string, error?: any): void {
		Logger.warn(`[TreeBuilder] ${message}`, error);
	}

	static error(message: string, error?: any): void {
		Logger.error(`[TreeBuilder] ${message}`, error);
	}

	static performance(marker: string): void {
		Logger.performance(`[TreeBuilder] ${marker}`);
	}

	static logBuildStart(dirPath: string, options: any): void {
		this.debug(`Building tree for: ${dirPath}`, options);
	}

	static logBuildComplete(itemCount: number): void {
		this.debug(`Tree built successfully with ${itemCount} root items`);
	}

	static logDirectoryProcessing(dirPath: string, currentDepth: number): void {
		this.debug(`Processing directory: ${dirPath} (depth: ${currentDepth})`);
	}

	static logDirectoryComplete(dirPath: string, itemCount: number): void {
		this.debug(`Completed processing directory: ${dirPath} (processed ${itemCount} items)`);
	}

	static logBatchProcessing(batchNumber: number, totalBatches: number): void {
		this.debug(`Processing batch ${batchNumber} of ${totalBatches}`);
	}

	static logItemIgnored(item: string): void {
		this.debug(`Ignored item: ${item}`);
	}

	static logEnteringSubdirectory(dirPath: string): void {
		this.debug(`Entering subdirectory: ${dirPath}`);
	}

	static logMaxDepthReached(dirPath: string): void {
		this.debug(`Max depth reached for: ${dirPath}`);
	}

	static logCacheStats(stats: any): void {
		this.debug(`Cache statistics: ${JSON.stringify(stats)}`);
	}
}
