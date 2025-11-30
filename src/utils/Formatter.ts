import { TreeStructure, FileMetadata } from '../types/index.js';
import { JSONFormatter } from './lib/formatter/jsonFormatter.js';
import { MarkdownFormatter } from './lib/formatter/markdownFormatter.js';
import { PreviewFormatter } from './lib/formatter/previewFormatter.js';
import { FormatterValidator } from './lib/formatter/validator.js';
import { FormatterLogger } from './lib/formatter/logger.js';
import { FormatOptions } from './lib/formatter/types.js';
export class Formatter {
	static async formatJSON(tree: TreeStructure, tabSize: number = 2): Promise<string> {
		FormatterValidator.validateTreeStructure(tree);
		FormatterValidator.validateFormatOptions({ tabSize });
		const result = await JSONFormatter.format(tree, { tabSize });
		return result.content;
	}
	static async formatMarkdown(tree: TreeStructure, level: number = 1): Promise<string> {
		FormatterValidator.validateTreeStructure(tree);
		FormatterValidator.validateFormatOptions({ level });
		const result = await MarkdownFormatter.format(tree, { level });
		return result.content;
	}
	static formatPreview(metadata: FileMetadata): string {
		FormatterValidator.validateFileMetadata(metadata);
		const result = PreviewFormatter.format(metadata);
		return result.content;
	}
	static async formatWithOptions(
		tree: TreeStructure,
		format: 'json' | 'markdown',
		options: FormatOptions = {},
	): Promise<string> {
		FormatterValidator.validateTreeStructure(tree);
		FormatterValidator.validateFormatOptions(options);
		if (format === 'json') {
			const result = await JSONFormatter.format(tree, options);
			return result.content;
		} else {
			const result = await MarkdownFormatter.format(tree, options);
			return result.content;
		}
	}
	static setDebugMode(debug: boolean): void {
		FormatterLogger.setDebugMode(debug);
	}
}
