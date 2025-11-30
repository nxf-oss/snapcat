import { FileProcessingOptions } from './types.js';
import { FileProcessorLogger } from './logger.js';
export class FileProcessorValidator {
	static validateOptions(options: FileProcessingOptions): void {
		if (options.maxSize && options.maxSize < 0) {
			throw new Error('maxSize must be a positive number');
		}
		if (options.timeout && options.timeout < 0) {
			throw new Error('timeout must be a positive number');
		}
		FileProcessorLogger.debug('Options validated successfully');
	}
	static validateFilePatterns(patterns: string[]): void {
		if (!patterns || !Array.isArray(patterns) || patterns.length === 0) {
			throw new Error('At least one file pattern is required');
		}
		for (const pattern of patterns) {
			if (typeof pattern !== 'string' || pattern.trim().length === 0) {
				throw new Error('File pattern must be a non-empty string');
			}
		}
		FileProcessorLogger.debug(`File patterns validated: ${patterns.join(', ')}`);
	}
}
