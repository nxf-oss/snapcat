import { TreeStructure, FileMetadata } from '../../../types/index.js';
import { FormatterLogger } from './logger.js';
import { PrettierManager } from './prettierManager.js';
import { FormatResult, MarkdownFormatOptions } from './types.js';
export class MarkdownFormatter {
	static async format(
		tree: TreeStructure,
		options: MarkdownFormatOptions = {},
	): Promise<FormatResult> {
		const { level = 1, includeContent = true, includeMetadata = true } = options;
		FormatterLogger.logFormatStart('Markdown', Object.keys(tree).length);
		FormatterLogger.logMarkdownStructure(level, Object.keys(tree).length);
		try {
			let result = '';
			const buildMarkdown = (obj: TreeStructure | FileMetadata, currentLevel: number) => {
				for (const [key, value] of Object.entries(obj)) {
					if (this.isFileMetadata(value)) {
						result += this.formatFileSection(key, value, currentLevel, {
							includeContent,
							includeMetadata,
						});
					} else {
						result += this.formatDirectorySection(key, currentLevel);
						buildMarkdown(value, currentLevel + 1);
					}
				}
			};
			buildMarkdown(tree, level);
			const formatted = await PrettierManager.formatMarkdown(result);
			FormatterLogger.logFormatComplete('Markdown', formatted.length);
			return {
				content: formatted,
				length: formatted.length,
				format: 'markdown',
			};
		} catch (error) {
			FormatterLogger.error('Markdown formatting failed', error);
			throw new Error(
				`Markdown formatting failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}
	private static formatFileSection(
		key: string,
		value: FileMetadata,
		level: number,
		options: { includeContent: boolean; includeMetadata: boolean },
	): string {
		let section = `${'#'.repeat(level)} ${key}\n\n`;
		if (options.includeContent && value.fileContent && value.fileContent.length > 0) {
			const lang = value.extension?.replace('.', '') || 'txt';
			section += `### File Content\n\n\`\`\`${lang}\n`;
			section += value.fileContent.join('\n');
			section += '\n```\n\n';
		}
		if (options.includeMetadata) {
			section += '### Metadata\n\n';
			const { fileContent, ...metadata } = value;
			section += '```json\n';
			section += JSON.stringify(metadata, null, 2);
			section += '\n```\n\n';
		}
		section += '---\n\n';
		return section;
	}
	private static formatDirectorySection(key: string, level: number): string {
		return `${'#'.repeat(level)} ${key}/\n\n`;
	}
	private static isFileMetadata(obj: any): obj is FileMetadata {
		return obj && typeof obj === 'object' && 'extension' in obj && 'fileType' in obj;
	}
}
