import path from 'path';
import { Logger } from './Logger.js';
export class Validator {
	static validateFilePath(filePath: string): { isValid: boolean; error?: string } {
		Logger.debug(`Validating file path: ${filePath}`);
		if (!filePath || typeof filePath !== 'string') {
			return { isValid: false, error: 'File path must be a non-empty string' };
		}
		if (filePath.length > 4096) {
			return { isValid: false, error: 'File path too long' };
		}
		if (filePath.includes('\0')) {
			return { isValid: false, error: 'File path contains null bytes' };
		}
		const resolvedPath = path.resolve(filePath);
		if (!resolvedPath.startsWith(process.cwd()) && !path.isAbsolute(filePath)) {
			return { isValid: false, error: 'Invalid file path: potential directory traversal' };
		}
		return { isValid: true };
	}
	static validatePatterns(patterns: string[]): { isValid: boolean; error?: string } {
		Logger.debug(`Validating ${patterns.length} patterns`);
		if (!Array.isArray(patterns)) {
			return { isValid: false, error: 'Patterns must be an array' };
		}
		if (patterns.length === 0) {
			return { isValid: false, error: 'At least one pattern is required' };
		}
		for (const pattern of patterns) {
			if (typeof pattern !== 'string') {
				return { isValid: false, error: 'All patterns must be strings' };
			}
			if (pattern.length === 0) {
				return { isValid: false, error: 'Pattern cannot be empty' };
			}
			if (pattern.length > 1024) {
				return { isValid: false, error: 'Pattern too long' };
			}
		}
		return { isValid: true };
	}
	static validateOptions(options: any): { isValid: boolean; error?: string } {
		Logger.debug('Validating command options');
		if (typeof options !== 'object' || options === null) {
			return { isValid: false, error: 'Options must be an object' };
		}
		if (options.depth !== undefined) {
			if (
				typeof options.depth !== 'number' ||
				!Number.isInteger(options.depth) ||
				options.depth < 0
			) {
				return { isValid: false, error: 'Depth must be a non-negative integer' };
			}
		}
		if (options.maxSize !== undefined) {
			if (typeof options.maxSize !== 'number' || options.maxSize < 0) {
				return { isValid: false, error: 'Max size must be a non-negative number' };
			}
		}
		if (options.format !== undefined && !['json', 'md'].includes(options.format)) {
			return { isValid: false, error: 'Format must be either "json" or "md"' };
		}
		return { isValid: true };
	}
	static sanitizePath(inputPath: string): string {
		Logger.debug(`Sanitizing path: ${inputPath}`);
		let sanitized = inputPath.replace(/\0/g, '');
		if (!path.isAbsolute(sanitized)) {
			sanitized = path.resolve(process.cwd(), sanitized);
		}
		sanitized = path.normalize(sanitized);
		Logger.debug(`Sanitized path: ${sanitized}`);
		return sanitized;
	}
}
