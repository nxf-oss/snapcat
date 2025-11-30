import { ValidationResult, OptionsValidationRules } from './types.js';
import { ValidatorLogger } from './validatorLogger.js';

export class OptionsValidator {
	static validateOptions(options: any, rules: OptionsValidationRules = {}): ValidationResult {
		const {
			allowedFormats = ['json', 'md'],
			maxDepth = 100,
			maxSize = Number.MAX_SAFE_INTEGER,
		} = rules;

		ValidatorLogger.logOptionsValidation();

		// Basic object validation
		if (typeof options !== 'object' || options === null) {
			const error = 'Options must be an object';
			ValidatorLogger.logValidationFailure('OptionsValidator', error);
			return { isValid: false, error };
		}

		// Depth validation
		if (options.depth !== undefined) {
			const depthResult = this.validateDepth(options.depth, maxDepth);
			if (!depthResult.isValid) {
				ValidatorLogger.logValidationFailure('OptionsValidator', depthResult.error!);
				return depthResult;
			}
		}

		// Max size validation
		if (options.maxSize !== undefined) {
			const sizeResult = this.validateMaxSize(options.maxSize, maxSize);
			if (!sizeResult.isValid) {
				ValidatorLogger.logValidationFailure('OptionsValidator', sizeResult.error!);
				return sizeResult;
			}
		}

		// Format validation
		if (options.format !== undefined) {
			const formatResult = this.validateFormat(options.format, allowedFormats);
			if (!formatResult.isValid) {
				ValidatorLogger.logValidationFailure('OptionsValidator', formatResult.error!);
				return formatResult;
			}
		}

		// Recursive validation
		if (options.recursive !== undefined && typeof options.recursive !== 'boolean') {
			const error = 'Recursive must be a boolean';
			ValidatorLogger.logValidationFailure('OptionsValidator', error);
			return { isValid: false, error };
		}

		// Preview validation
		if (options.preview !== undefined && typeof options.preview !== 'boolean') {
			const error = 'Preview must be a boolean';
			ValidatorLogger.logValidationFailure('OptionsValidator', error);
			return { isValid: false, error };
		}

		// Debug validation
		if (options.debug !== undefined && typeof options.debug !== 'boolean') {
			const error = 'Debug must be a boolean';
			ValidatorLogger.logValidationFailure('OptionsValidator', error);
			return { isValid: false, error };
		}

		ValidatorLogger.logValidationSuccess('OptionsValidator');
		return { isValid: true };
	}

	static validateDepth(depth: any, maxDepth: number): ValidationResult {
		if (typeof depth !== 'number' || !Number.isInteger(depth)) {
			return { isValid: false, error: 'Depth must be an integer' };
		}

		if (depth < 0) {
			return { isValid: false, error: 'Depth must be a non-negative number' };
		}

		if (depth > maxDepth) {
			return { isValid: false, error: `Depth too large (max: ${maxDepth})` };
		}

		return { isValid: true };
	}

	static validateMaxSize(maxSize: any, absoluteMax: number): ValidationResult {
		if (typeof maxSize !== 'number') {
			return { isValid: false, error: 'Max size must be a number' };
		}

		if (maxSize < 0) {
			return { isValid: false, error: 'Max size must be a non-negative number' };
		}

		if (maxSize > absoluteMax) {
			return { isValid: false, error: `Max size too large (max: ${absoluteMax})` };
		}

		return { isValid: true };
	}

	static validateFormat(format: any, allowedFormats: string[]): ValidationResult {
		if (typeof format !== 'string') {
			return { isValid: false, error: 'Format must be a string' };
		}

		if (!allowedFormats.includes(format)) {
			return { isValid: false, error: `Format must be one of: ${allowedFormats.join(', ')}` };
		}

		return { isValid: true };
	}

	static sanitizeOptions(options: any): any {
		const sanitized = { ...options };

		// Ensure numeric values are within bounds
		if (sanitized.depth !== undefined) {
			sanitized.depth = Math.max(0, Math.min(sanitized.depth, 1000));
		}

		if (sanitized.maxSize !== undefined) {
			sanitized.maxSize = Math.max(0, Math.min(sanitized.maxSize, Number.MAX_SAFE_INTEGER));
		}

		// Ensure boolean values are properly typed
		if (sanitized.recursive !== undefined) {
			sanitized.recursive = Boolean(sanitized.recursive);
		}

		if (sanitized.preview !== undefined) {
			sanitized.preview = Boolean(sanitized.preview);
		}

		if (sanitized.debug !== undefined) {
			sanitized.debug = Boolean(sanitized.debug);
		}

		return sanitized;
	}
}
