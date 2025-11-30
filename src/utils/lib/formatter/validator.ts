import { TreeStructure, FileMetadata } from '../../../types/index.js';
import { FormatterLogger } from './logger.js';
export class FormatterValidator {
	static validateTreeStructure(tree: TreeStructure): void {
		if (!tree || typeof tree !== 'object') {
			throw new Error('Tree structure must be a valid object');
		}
		if (Object.keys(tree).length === 0) {
			FormatterLogger.warn('Tree structure is empty', null);
		}
		FormatterLogger.debug('Tree structure validated successfully');
	}
	static validateFileMetadata(metadata: FileMetadata): void {
		if (!metadata || typeof metadata !== 'object') {
			throw new Error('File metadata must be a valid object');
		}
		if (!metadata.extension || !metadata.baseName) {
			throw new Error('File metadata must include extension and baseName');
		}
		FormatterLogger.debug('File metadata validated successfully');
	}
	static validateFormatOptions(options: any): void {
		if (options && typeof options !== 'object') {
			throw new Error('Format options must be an object');
		}
		if (
			options.tabSize !== undefined &&
			(typeof options.tabSize !== 'number' || options.tabSize < 0)
		) {
			throw new Error('Tab size must be a non-negative number');
		}
		if (
			options.level !== undefined &&
			(typeof options.level !== 'number' || options.level < 1)
		) {
			throw new Error('Level must be a positive number');
		}
		FormatterLogger.debug('Format options validated successfully');
	}
}
