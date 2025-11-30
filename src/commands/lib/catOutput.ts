import { promises as fs } from 'fs';
import { Formatter } from './../../utils/Formatter.js';
import { ProcessResults } from './catTypes.js';
import { CatLogger } from './catLogger.js';
export class CatOutput {
	static async formatResults(
		results: ProcessResults,
		format: 'json' | 'md' = 'json',
	): Promise<string> {
		CatLogger.debug(`Formatting output as: ${format}`);
		if (format === 'md') {
			return await Formatter.formatMarkdown(results);
		} else {
			return await Formatter.formatJSON(results);
		}
	}
	static async writeToFile(output: string, filePath: string): Promise<void> {
		CatLogger.debug(`Writing output to file: ${filePath}`);
		await fs.writeFile(filePath, output, 'utf8');
		CatLogger.success(`File metadata saved to: ${filePath}`);
	}
	static async handleOutput(
		results: ProcessResults,
		options: { format?: 'json' | 'md'; output?: string },
	): Promise<void> {
		const output = await this.formatResults(results, options.format);
		if (options.output) {
			await this.writeToFile(output, options.output);
		} else {
			console.log(output);
		}
	}
}
