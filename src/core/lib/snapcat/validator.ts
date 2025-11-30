import { CommandOptions } from '../../../types/index.js';
import { SnapCatLogger } from './logger.js';

export class SnapCatValidator {
	static validateCommandOptions(options: CommandOptions): void {
		if (options && typeof options !== 'object') {
			throw new Error('Command options must be an object');
		}

		// Validate specific options if needed
		if (options.debug !== undefined && typeof options.debug !== 'boolean') {
			throw new Error('Debug option must be a boolean');
		}

		if (options.verbose !== undefined && typeof options.verbose !== 'boolean') {
			throw new Error('Verbose option must be a boolean');
		}

		SnapCatLogger.debug('Command options validated successfully');
	}

	static validateFilePatterns(filePatterns: string[]): void {
		if (!filePatterns || !Array.isArray(filePatterns)) {
			throw new Error('File patterns must be an array');
		}

		if (filePatterns.length === 0) {
			throw new Error('At least one file pattern is required');
		}

		for (const pattern of filePatterns) {
			if (typeof pattern !== 'string' || pattern.trim().length === 0) {
				throw new Error('File pattern must be a non-empty string');
			}
		}

		SnapCatLogger.debug(`File patterns validated: ${filePatterns.join(', ')}`);
	}

	static validateTargetPath(targetPath?: string): string {
		const path = targetPath || '.';

		if (typeof path !== 'string') {
			throw new Error('Target path must be a string');
		}

		if (path.trim().length === 0) {
			throw new Error('Target path cannot be empty');
		}

		SnapCatLogger.debug(`Target path validated: ${path}`);
		return path;
	}
}
