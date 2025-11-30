import { Logger } from '../../../utils/Logger.js';
import { FileProcessingOptions } from './types.js';
export class FileProcessorLogger {
	static setDebugMode(debug: boolean): void {
		Logger.setDebugMode(debug);
	}
	static debug(message: string, data?: any): void {
		Logger.debug(`[FileProcessor] ${message}`, data);
	}
	static info(message: string): void {
		Logger.info(`[FileProcessor] ${message}`);
	}
	static warn(message: string, error?: any): void {
		Logger.warn(`[FileProcessor] ${message}`, error);
	}
	static error(message: string, error?: any): void {
		Logger.error(`[FileProcessor] ${message}`, error);
	}
	static logProcessingStart(patterns: string[], options: FileProcessingOptions): void {
		this.debug('File processing started', {
			patterns,
			options,
			timestamp: new Date().toISOString(),
		});
	}
	static logProcessingComplete(resultsCount: number, processingTime: number): void {
		this.debug('File processing completed', {
			filesProcessed: resultsCount,
			processingTime: `${processingTime}ms`,
		});
	}
	static logCacheStats(stats: { size: number; hits: number }): void {
		this.debug('Cache statistics', stats);
	}
}
