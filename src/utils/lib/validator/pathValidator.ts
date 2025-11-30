import path from 'path';
import { ValidationResult, PathValidationOptions } from './types.js';
import { ValidatorLogger } from './validatorLogger.js';

export class PathValidator {
	static validateFilePath(
		filePath: string,
		options: PathValidationOptions = {},
	): ValidationResult {
		const { maxLength = 4096, allowRelative = true, requireAbsolute = false } = options;

		ValidatorLogger.logPathValidation(filePath);

		// Basic validation
		if (!filePath || typeof filePath !== 'string') {
			const error = 'File path must be a non-empty string';
			ValidatorLogger.logValidationFailure('PathValidator', error);
			return { isValid: false, error };
		}

		if (filePath.length > maxLength) {
			const error = `File path too long (max: ${maxLength} characters)`;
			ValidatorLogger.logValidationFailure('PathValidator', error);
			return { isValid: false, error };
		}

		if (filePath.includes('\0')) {
			const error = 'File path contains null bytes';
			ValidatorLogger.logValidationFailure('PathValidator', error);
			return { isValid: false, error };
		}

		// Path type validation
		if (requireAbsolute && !path.isAbsolute(filePath)) {
			const error = 'File path must be absolute';
			ValidatorLogger.logValidationFailure('PathValidator', error);
			return { isValid: false, error };
		}

		if (!allowRelative && !path.isAbsolute(filePath)) {
			const error = 'Relative file paths are not allowed';
			ValidatorLogger.logValidationFailure('PathValidator', error);
			return { isValid: false, error };
		}

		// Security validation
		const resolvedPath = path.resolve(filePath);
		if (!resolvedPath.startsWith(process.cwd()) && !path.isAbsolute(filePath)) {
			const error = 'Invalid file path: potential directory traversal';
			ValidatorLogger.logValidationFailure('PathValidator', error);
			return { isValid: false, error };
		}

		ValidatorLogger.logValidationSuccess('PathValidator');
		return { isValid: true };
	}

	static isSafePath(filePath: string): boolean {
		try {
			const resolved = path.resolve(filePath);
			const normalized = path.normalize(resolved);

			// Check for directory traversal attempts
			if (normalized.includes('..')) {
				return false;
			}

			// Check if path is within current working directory
			return normalized.startsWith(process.cwd());
		} catch {
			return false;
		}
	}

	static isValidPathFormat(filePath: string): boolean {
		const pathRegex = /^[^\0]+$/; // No null bytes
		return typeof filePath === 'string' && pathRegex.test(filePath);
	}
}
