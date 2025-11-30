import { FileSystemLogger } from './logger.js';

export class FileSystemValidator {
	static validateFilePath(filePath: string): void {
		if (!filePath || typeof filePath !== 'string') {
			throw new Error('File path must be a non-empty string');
		}
	}

	static validateOptions(options: any): void {
		if (options && typeof options !== 'object') {
			throw new Error('Options must be an object');
		}

		if (
			options.maxSize !== undefined &&
			(typeof options.maxSize !== 'number' || options.maxSize < 0)
		) {
			throw new Error('Max size must be a non-negative number');
		}

		if (options.enableCache !== undefined && typeof options.enableCache !== 'boolean') {
			throw new Error('Enable cache must be a boolean');
		}

		FileSystemLogger.debug('File system options validated successfully');
	}
}
