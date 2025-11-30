import { FileMetadata } from '../../../types/index.js';
import { FormatterLogger } from './logger.js';
import { FormatResult, PreviewFormatOptions } from './types.js';
export class PreviewFormatter {
	static format(metadata: FileMetadata, options: PreviewFormatOptions = {}): FormatResult {
		const { showContent = true, showMetadata = true } = options;
		FormatterLogger.logPreviewGeneration(metadata);
		let result = '';
		if (showMetadata) {
			result += this.formatMetadataSection(metadata);
		}
		if (showContent && metadata.fileContent?.length) {
			result += this.formatContentSection(metadata);
		} else if (showContent) {
			result += 'No content preview available\n';
		}
		return {
			content: result,
			length: result.length,
			format: 'preview',
		};
	}
	private static formatMetadataSection(metadata: FileMetadata): string {
		let section = `File: ${metadata.baseName}${metadata.extension}\n`;
		section += `Path: ${metadata.relativePath}\n`;
		section += `Size: ${metadata.size}\n`;
		section += `SHA256: ${metadata.sha256}\n`;
		section += `Modified: ${metadata.lastModified || 'N/A'}\n`;
		section += `Permissions: ${metadata.permissions || 'N/A'}\n\n`;
		return section;
	}
	private static formatContentSection(metadata: FileMetadata): string {
		let section = 'Content:\n```\n';
		section += metadata.fileContent.join('\n');
		section += '\n```\n';
		return section;
	}
	static formatSimple(metadata: FileMetadata): string {
		return this.format(metadata).content;
	}
}
