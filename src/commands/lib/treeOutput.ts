import { promises as fs } from 'fs';
import { Formatter } from '../../utils/Formatter.js';
import { TreeStructure } from './treeTypes.js';
import { TreeLogger } from './treeLogger.js';

export class TreeOutput {
	static async formatResults(
		tree: TreeStructure,
		format: 'json' | 'md' = 'json',
	): Promise<string> {
		TreeLogger.debug(`Formatting output as: ${format}`);

		if (format === 'md') {
			return await Formatter.formatMarkdown(tree);
		} else {
			return await Formatter.formatJSON(tree);
		}
	}

	static async writeToFile(output: string, filePath: string): Promise<void> {
		TreeLogger.debug(`Writing output to file: ${filePath}`);
		await fs.writeFile(filePath, output, 'utf8');
		TreeLogger.success(`Tree structure saved to: ${filePath}`);
	}

	static async handleOutput(
		tree: TreeStructure,
		options: { format?: 'json' | 'md'; output?: string },
	): Promise<void> {
		const output = await this.formatResults(tree, options.format);

		if (options.output) {
			await this.writeToFile(output, options.output);
		} else {
			console.log(output);
		}
	}
}
