import { promises as fs } from 'fs';
import path from 'path';
import { FileLoadResult } from './types.js';
import { IgnoreManagerLogger } from './logger.js';

export class IgnoreFileLoader {
	static async loadIgnoreFile(filePath: string, fileName: string): Promise<FileLoadResult> {
		IgnoreManagerLogger.logFileLoadAttempt(filePath, fileName);

		try {
			if (await this.fileExists(filePath)) {
				const patterns = await this.parseIgnoreFile(filePath);
				IgnoreManagerLogger.logFileLoadSuccess(fileName, patterns.length);

				return {
					success: true,
					patterns,
					filePath,
					fileName,
				};
			} else {
				IgnoreManagerLogger.logFileNotFound(filePath, fileName);
				return {
					success: true,
					patterns: [],
					filePath,
					fileName,
				};
			}
		} catch (error) {
			IgnoreManagerLogger.logFileLoadError(filePath, fileName, error);

			return {
				success: false,
				patterns: [],
				filePath,
				fileName,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private static async parseIgnoreFile(filePath: string): Promise<string[]> {
		try {
			const content = await fs.readFile(filePath, 'utf8');
			return content
				.split('\n')
				.map((line) => line.trim())
				.filter((line) => line && !line.startsWith('#'))
				.map((pattern) => pattern.trim())
				.filter((pattern) => pattern.length > 0);
		} catch (error) {
			IgnoreManagerLogger.error(`Failed to parse ignore file: ${filePath}`, error);
			return [];
		}
	}

	static async fileExists(filePath: string): Promise<boolean> {
		try {
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}

	static async loadMultipleFiles(
		files: Array<{ path: string; name: string }>,
	): Promise<{ patterns: string[]; errors: string[] }> {
		const allPatterns: string[] = [];
		const errors: string[] = [];

		for (const file of files) {
			const result = await this.loadIgnoreFile(file.path, file.name);

			if (result.success) {
				allPatterns.push(...result.patterns);
			} else if (result.error) {
				errors.push(`Failed to load ${file.name}: ${result.error}`);
			}
		}

		return { patterns: allPatterns, errors };
	}
}
