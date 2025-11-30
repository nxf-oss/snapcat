import { ValidationResult } from './lib/validator/types.js';
import { PathValidator } from './lib/validator/pathValidator.js';
import { PatternValidator } from './lib/validator/patternValidator.js';
import { OptionsValidator } from './lib/validator/optionsValidator.js';
import { PathSanitizer } from './lib/validator/pathSanitizer.js';
import { ValidatorLogger } from './lib/validator/validatorLogger.js';
import { CommonValidator } from './lib/validator/commonValidator.js';

export class Validator {
	static validateFilePath(filePath: string): ValidationResult {
		return PathValidator.validateFilePath(filePath);
	}

	static validatePatterns(patterns: string[]): ValidationResult {
		return PatternValidator.validatePatterns(patterns);
	}

	static validateOptions(options: any): ValidationResult {
		return OptionsValidator.validateOptions(options);
	}

	static sanitizePath(inputPath: string): string {
		return PathSanitizer.sanitizePath(inputPath);
	}

	// Additional utility methods
	static validateString(value: any, fieldName?: string): ValidationResult {
		return CommonValidator.validateString(value, fieldName);
	}

	static validateNumber(value: any, fieldName?: string): ValidationResult {
		return CommonValidator.validateNumber(value, fieldName);
	}

	static validatePositiveNumber(value: any, fieldName?: string): ValidationResult {
		return CommonValidator.validatePositiveNumber(value, fieldName);
	}

	static validateInteger(value: any, fieldName?: string): ValidationResult {
		return CommonValidator.validateInteger(value, fieldName);
	}

	static validateBoolean(value: any, fieldName?: string): ValidationResult {
		return CommonValidator.validateBoolean(value, fieldName);
	}

	static validateArray(value: any, fieldName?: string): ValidationResult {
		return CommonValidator.validateArray(value, fieldName);
	}

	static validateObject(value: any, fieldName?: string): ValidationResult {
		return CommonValidator.validateObject(value, fieldName);
	}

	static validateEnum(value: any, allowedValues: any[], fieldName?: string): ValidationResult {
		return CommonValidator.validateEnum(value, allowedValues, fieldName);
	}

	static validateRange(
		value: number,
		min: number,
		max: number,
		fieldName?: string,
	): ValidationResult {
		return CommonValidator.validateRange(value, min, max, fieldName);
	}

	static sanitizeOptions(options: any): any {
		return OptionsValidator.sanitizeOptions(options);
	}

	static setDebugMode(debug: boolean): void {
		ValidatorLogger.setDebugMode(debug);
	}

	static isSafePath(filePath: string): boolean {
		return PathValidator.isSafePath(filePath);
	}

	static ensureAbsolutePath(inputPath: string): string {
		return PathSanitizer.ensureAbsolutePath(inputPath);
	}

	static makeRelativeToCwd(absolutePath: string): string {
		return PathSanitizer.makeRelativeToCwd(absolutePath);
	}
}
