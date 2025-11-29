import { TreeStructure, FileMetadata } from '../types/index.js';
import { Logger } from './Logger.js';
import prettier from 'prettier';

export class Formatter {
	static async formatJSON(tree: TreeStructure, tabSize: number = 2): Promise<string> {
		Logger.debug('Formatting tree as JSON with Prettier');
		const jsonString = JSON.stringify(tree, null, tabSize);
		const formatted = await prettier.format(jsonString, { parser: 'json' });

		Logger.debug(`JSON output length: ${formatted.length} characters`);
		return formatted;
	}

	static async formatMarkdown(tree: TreeStructure, level: number = 1): Promise<string> {
		Logger.debug('Formatting tree as Markdown with Prettier');
		let result = '';

		const buildMarkdown = (obj: TreeStructure | FileMetadata, lvl: number) => {
			for (const [key, value] of Object.entries(obj)) {
				if (this.isFileMetadata(value)) {
					result += `${'#'.repeat(lvl)} ${key}\n\n`;
					if (value.fileContent && value.fileContent.length > 0) {
						const lang = value.extension?.replace('.', '') || 'txt';
						result += `### File Content\n\n\`\`\`${lang}\n`;
						result += value.fileContent.join('\n');
						result += '\n```\n\n';
					}
					result += '### Metadata\n\n';
					const { fileContent, ...metadata } = value;
					result += '```json\n';
					result += JSON.stringify(metadata, null, 2);
					result += '\n```\n\n---\n\n';
				} else {
					result += `${'#'.repeat(lvl)} ${key}/\n\n`;
					buildMarkdown(value, lvl + 1);
				}
			}
		};

		buildMarkdown(tree, level);
		return await prettier.format(result, { parser: 'markdown' });
	}

	static formatPreview(metadata: FileMetadata): string {
		let result = `File: ${metadata.baseName}${metadata.extension}\n`;
		result += `Path: ${metadata.relativePath}\n`;
		result += `Size: ${metadata.size}\n`;
		result += `SHA256: ${metadata.sha256}\n`;
		result += `Modified: ${metadata.lastModified || 'N/A'}\n`;
		result += `Permissions: ${metadata.permissions || 'N/A'}\n\n`;
		if (metadata.fileContent?.length) {
			result += 'Content:\n```\n';
			result += metadata.fileContent.join('\n');
			result += '\n```\n';
		} else {
			result += 'No content preview available\n';
		}
		return result;
	}

	private static isFileMetadata(obj: any): obj is FileMetadata {
		return obj && typeof obj === 'object' && 'extension' in obj;
	}
}
