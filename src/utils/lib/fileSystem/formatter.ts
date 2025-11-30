import { constants } from 'fs';
import { FileSystemLogger } from './logger.js';

export class FileSystemFormatter {
	static formatSize(bytes: number): string {
		const units = ['B', 'KB', 'MB', 'GB', 'TB'];

		if (bytes === 0) return '0B';

		let size = bytes;
		let unitIndex = 0;

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}

		return `${size.toFixed(2)}${units[unitIndex]}`;
	}

	static formatPermissions(mode: number): string {
		const permissions = [
			mode & constants.S_IRUSR ? 'r' : '-',
			mode & constants.S_IWUSR ? 'w' : '-',
			mode & constants.S_IXUSR ? 'x' : '-',
			mode & constants.S_IRGRP ? 'r' : '-',
			mode & constants.S_IWGRP ? 'w' : '-',
			mode & constants.S_IXGRP ? 'x' : '-',
			mode & constants.S_IROTH ? 'r' : '-',
			mode & constants.S_IWOTH ? 'w' : '-',
			mode & constants.S_IXOTH ? 'x' : '-',
		].join('');

		return permissions;
	}

	static formatFileContent(content: Buffer, preview: boolean, maxSize?: number): string[] {
		if (!preview) {
			return [];
		}

		try {
			const contentStr = content.toString('utf8');
			return contentStr
				.split('\n')
				.map((line) => line.trim())
				.filter((line) => line !== '');
		} catch (error) {
			FileSystemLogger.warn('Failed to format file content', error);
			return ['[Error reading file content]'];
		}
	}

	static getPreviewContent(stats: any, extension: string, maxSize?: number): string[] {
		if (stats.size > (maxSize || 0)) {
			return ['[File too large for preview]'];
		}
		return ['[Binary file or unsupported format]'];
	}
}
