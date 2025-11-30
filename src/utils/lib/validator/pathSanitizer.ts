import path from 'path';
import { SanitizationOptions } from './types.js';
import { ValidatorLogger } from './validatorLogger.js';

export class PathSanitizer {
	static sanitizePath(inputPath: string, options: SanitizationOptions = {}): string {
		const { removeNullBytes = true, resolveRelative = true, normalizePath = true } = options;

		ValidatorLogger.logPathSanitization(inputPath);

		let sanitized = inputPath;

		// Remove null bytes
		if (removeNullBytes) {
			sanitized = sanitized.replace(/\0/g, '');
		}

		// Resolve relative paths
		if (resolveRelative && !path.isAbsolute(sanitized)) {
			sanitized = path.resolve(process.cwd(), sanitized);
		}

		// Normalize path
		if (normalizePath) {
			sanitized = path.normalize(sanitized);
		}

		ValidatorLogger.logSanitizedPath(sanitized);
		return sanitized;
	}

	static ensureAbsolutePath(inputPath: string): string {
		if (path.isAbsolute(inputPath)) {
			return path.normalize(inputPath);
		}
		return path.resolve(process.cwd(), inputPath);
	}

	static makeRelativeToCwd(absolutePath: string): string {
		try {
			return path.relative(process.cwd(), absolutePath);
		} catch {
			return absolutePath;
		}
	}

	static sanitizeForDisplay(filePath: string): string {
		return filePath
			.replace(/\0/g, '')
			.replace(/\\/g, '/') // Normalize slashes
			.replace(/\/+/g, '/') // Remove duplicate slashes
			.replace(/^\.\//, ''); // Remove leading ./
	}

	static isWithinCwd(filePath: string): boolean {
		try {
			const resolved = path.resolve(filePath);
			const cwd = process.cwd();
			return resolved.startsWith(cwd);
		} catch {
			return false;
		}
	}
}
