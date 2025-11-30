import { Validator } from '../../utils/Validator.js';
import { TreeValidationResult, TreeCommandOptions } from './treeTypes.js';
export class TreeValidator {
	static validateOptions(options: any): TreeValidationResult {
		return Validator.validateOptions(options);
	}
	static sanitizePath(targetPath: string): string {
		return Validator.sanitizePath(targetPath);
	}
	static validateTargetPath(targetPath: string): void {
		const sanitizedPath = this.sanitizePath(targetPath);
		if (!sanitizedPath || sanitizedPath === '.') {
			throw new Error('Invalid target path');
		}
	}
	static validateCommandOptions(options: TreeCommandOptions): void {
		const optionsValidation = this.validateOptions(options);
		if (!optionsValidation.isValid) {
			throw new Error(`Invalid options: ${optionsValidation.error}`);
		}
	}
	static validateDepth(depth?: number): void {
		if (depth !== undefined && (depth < 0 || !Number.isInteger(depth))) {
			throw new Error('Depth must be a positive integer');
		}
	}
}
