import { TreeStructure } from '../../../types/index.js';
import { FormatterLogger } from './logger.js';
import { PrettierManager } from './prettierManager.js';
import { FormatResult, JSONFormatOptions } from './types.js';
export class JSONFormatter {
	static async format(
		tree: TreeStructure,
		options: JSONFormatOptions = {},
	): Promise<FormatResult> {
		const { tabSize = 2 } = options;
		FormatterLogger.logFormatStart('JSON', Object.keys(tree).length);
		FormatterLogger.logJSONStructure(Object.keys(tree).length);
		try {
			const jsonString = JSON.stringify(tree, null, tabSize);
			const formatted = await PrettierManager.formatJSON(jsonString);
			FormatterLogger.logFormatComplete('JSON', formatted.length);
			return {
				content: formatted,
				length: formatted.length,
				format: 'json',
			};
		} catch (error) {
			FormatterLogger.error('JSON formatting failed', error);
			throw new Error(
				`JSON formatting failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}
	static formatSimple(obj: any, tabSize: number = 2): string {
		return JSON.stringify(obj, null, tabSize);
	}
}
