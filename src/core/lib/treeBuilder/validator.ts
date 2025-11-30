import { Validator } from '../../../utils/Validator.js';
import { TreeBuildOptions } from './types.js';
import { TreeBuilderLogger } from './logger.js';

export class TreeBuilderValidator {
	static validateDirectoryPath(dirPath: string): void {
		const validation = Validator.validateFilePath(dirPath);
		if (!validation.isValid) {
			throw new Error(`Invalid directory path: ${validation.error}`);
		}
		TreeBuilderLogger.debug(`Directory path validated: ${dirPath}`);
	}

	static validateBuildOptions(options: TreeBuildOptions): void {
		if (
			options.depth !== undefined &&
			(options.depth < 0 || !Number.isInteger(options.depth))
		) {
			throw new Error('Depth must be a non-negative integer');
		}

		if (options.maxSize !== undefined && options.maxSize < 0) {
			throw new Error('Max size must be a non-negative number');
		}

		TreeBuilderLogger.debug('Build options validated successfully', options);
	}

	static validateDepth(currentDepth: number, maxDepth: number): boolean {
		return currentDepth <= maxDepth;
	}
}
