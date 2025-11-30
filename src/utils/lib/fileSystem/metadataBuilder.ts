import path from 'path';
import crypto from 'crypto';
import { FileMetadata } from '../../../types/index.js';
import { FileSystemLogger } from './logger.js';
import { FileSystemFormatter } from './formatter.js';
import { FileReader } from './fileReader.js';
import { MetadataBuildOptions } from './types.js';
import { defaultConfig } from '../../../config/defaults.js';

export class MetadataBuilder {
	static async buildFileMetadata(options: MetadataBuildOptions): Promise<FileMetadata | null> {
		const { filePath, relativePath, stats, options: buildOptions } = options;

		try {
			FileSystemLogger.debug(`Getting file metadata for: ${filePath}`);

			const extension = path.extname(filePath);
			const baseName = path.basename(filePath, extension);
			const cfg = await defaultConfig();

			let sha256 = '';
			let sizeFormatted = '';
			let fileContent: string[] = [];
			let lastModified: string | undefined;
			let permissions: string | undefined;

			if (stats.isFile()) {
				FileSystemLogger.logFileProcessing(filePath, stats.size);

				const content = await FileReader.readFileContent(
					filePath,
					buildOptions.enableCache,
				);
				sha256 = crypto.createHash('sha256').update(content).digest('hex');
				sizeFormatted = FileSystemFormatter.formatSize(stats.size);
				lastModified = stats.mtime.toISOString();
				permissions = FileSystemFormatter.formatPermissions(stats.mode);

				if (
					buildOptions.preview &&
					(await this.isTextFile(extension)) &&
					stats.size <= (buildOptions.maxSize || cfg.maxFileSize)
				) {
					FileSystemLogger.debug(`Reading file content for preview: ${filePath}`);
					fileContent = FileSystemFormatter.formatFileContent(content, true);
					FileSystemLogger.logFileContentRead(filePath, fileContent.length);
				} else if (buildOptions.preview) {
					fileContent = FileSystemFormatter.getPreviewContent(
						stats,
						extension,
						buildOptions.maxSize,
					);
				}
			}

			const metadata: FileMetadata = {
				extension,
				fullPath: filePath,
				relativePath,
				baseName,
				size: sizeFormatted,
				sha256,
				fileContent,
				fileType: {
					isFile: stats.isFile(),
					isDirectory: stats.isDirectory(),
					isSymbolicLink: stats.isSymbolicLink(),
				},
				lastModified,
				permissions,
			};

			FileSystemLogger.logFileMetadata(filePath, metadata);
			return metadata;
		} catch (error) {
			FileSystemLogger.error(`Failed to build file metadata: ${filePath}`, error);
			return null;
		}
	}

	private static async isTextFile(extension: string): Promise<boolean> {
		const cfg = await defaultConfig();
		const isText = cfg.allowedExtensions.includes(extension.toLowerCase());
		FileSystemLogger.logTextFileCheck(extension, isText);
		return isText;
	}
}
