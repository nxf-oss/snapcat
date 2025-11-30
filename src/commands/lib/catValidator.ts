import { Validator } from './../../utils/Validator.js';
import { ValidationResult } from './catTypes.js';
export class CatValidator {
	static validatePatterns(filePatterns: string[]): ValidationResult {
		return Validator.validatePatterns(filePatterns);
	}
	static validateOptions(options: any): ValidationResult {
		return Validator.validateOptions(options);
	}
	static validateFilePatterns(filePatterns: string[]): void {
		if (!filePatterns || filePatterns.length === 0) {
			throw new Error('At least one file pattern is required');
		}
		const patternsValidation = this.validatePatterns(filePatterns);
		if (!patternsValidation.isValid) {
			throw new Error(`Invalid file patterns: ${patternsValidation.error}`);
		}
	}
	static validateCommandOptions(options: any): void {
		const optionsValidation = this.validateOptions(options);
		if (!optionsValidation.isValid) {
			throw new Error(`Invalid options: ${optionsValidation.error}`);
		}
	}
}
