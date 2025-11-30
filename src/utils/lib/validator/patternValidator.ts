import { ValidationResult, PatternValidationOptions } from './types.js';
import { ValidatorLogger } from './validatorLogger.js';
export class PatternValidator {
	static validatePatterns(
		patterns: string[],
		options: PatternValidationOptions = {},
	): ValidationResult {
		const { maxPatternLength = 1024, minPatterns = 1, maxPatterns = 1000 } = options;
		ValidatorLogger.logPatternValidation(patterns.length);
		if (!Array.isArray(patterns)) {
			const error = 'Patterns must be an array';
			ValidatorLogger.logValidationFailure('PatternValidator', error);
			return { isValid: false, error };
		}
		if (patterns.length < minPatterns) {
			const error = `At least ${minPatterns} pattern(s) are required`;
			ValidatorLogger.logValidationFailure('PatternValidator', error);
			return { isValid: false, error };
		}
		if (patterns.length > maxPatterns) {
			const error = `Too many patterns (max: ${maxPatterns})`;
			ValidatorLogger.logValidationFailure('PatternValidator', error);
			return { isValid: false, error };
		}
		for (let i = 0; i < patterns.length; i++) {
			const pattern = patterns[i];
			const patternResult = this.validateSinglePattern(pattern ?? '', maxPatternLength);

			if (!patternResult.isValid) {
				const error = `Pattern ${i + 1}: ${patternResult.error}`;
				ValidatorLogger.logValidationFailure('PatternValidator', error);
				return { isValid: false, error };
			}
		}
		ValidatorLogger.logValidationSuccess('PatternValidator');
		return { isValid: true };
	}
	static validateSinglePattern(pattern: string, maxLength: number = 1024): ValidationResult {
		if (typeof pattern !== 'string') {
			return { isValid: false, error: 'Pattern must be a string' };
		}
		if (pattern.length === 0) {
			return { isValid: false, error: 'Pattern cannot be empty' };
		}
		if (pattern.length > maxLength) {
			return { isValid: false, error: `Pattern too long (max: ${maxLength} characters)` };
		}
		if (this.isDangerousPattern(pattern)) {
			return { isValid: false, error: 'Pattern contains potentially dangerous characters' };
		}
		return { isValid: true };
	}
	private static isDangerousPattern(pattern: string): boolean {
		const dangerousChars = ['\0', '\r', '\n', '\t', '\v', '\f'];
		return dangerousChars.some((char) => pattern.includes(char));
	}
	static normalizePatterns(patterns: string[]): string[] {
		return patterns.map((pattern) => pattern.trim()).filter((pattern) => pattern.length > 0);
	}
	static hasValidGlobPatterns(patterns: string[]): boolean {
		const globChars = ['*', '?', '!', '[', ']', '{', '}'];
		return patterns.some((pattern) => globChars.some((char) => pattern.includes(char)));
	}
}
