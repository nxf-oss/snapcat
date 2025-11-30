import { IgnoreManagerLogger } from './logger.js';

export class IgnoreManagerValidator {
	static validateInitialization(initialized: boolean): void {
		if (!initialized) {
			IgnoreManagerLogger.logUninitializedWarning();
			throw new Error('IgnoreManager not initialized. Call initialize() first.');
		}
	}

	static validatePatterns(patterns: string[]): void {
		if (!Array.isArray(patterns)) {
			throw new Error('Patterns must be an array');
		}

		for (const pattern of patterns) {
			if (typeof pattern !== 'string') {
				throw new Error('All patterns must be strings');
			}

			if (pattern.trim().length === 0) {
				throw new Error('Patterns cannot be empty strings');
			}
		}

		IgnoreManagerLogger.debug('Patterns validated successfully');
	}

	static validateFilePath(filePath: string): void {
		if (!filePath || typeof filePath !== 'string') {
			throw new Error('File path must be a non-empty string');
		}
	}

	static validateBaseName(baseName: string): void {
		if (!baseName || typeof baseName !== 'string') {
			throw new Error('Base name must be a non-empty string');
		}
	}

	static validateOptions(options: any): void {
		if (options && typeof options !== 'object') {
			throw new Error('Options must be an object');
		}

		IgnoreManagerLogger.debug('Options validated successfully');
	}
}
