import path from 'path';
import { TreeValidator } from './lib/treeValidator.js';
import { TreeProcessor } from './lib/treeProcessor.js';
import { TreeOutput } from './lib/treeOutput.js';
import { TreeLogger } from './lib/treeLogger.js';
import { TreeCommandOptions } from './lib/treeTypes.js';
import { CommandOptions } from '../types/index.js';
export class TreeCommand {
	private treeProcessor: TreeProcessor;
	constructor() {
		this.treeProcessor = new TreeProcessor();
	}
	async execute(targetPath: string = '.', options: CommandOptions = {}) {
		const startTime = Date.now();
		const treeOptions = options as TreeCommandOptions;
		try {
			TreeLogger.setDebugMode(!!treeOptions.debug);
			if (treeOptions.debug) {
				TreeLogger.logCommandStart(targetPath, treeOptions);
			}
			const sanitizedPath = TreeValidator.sanitizePath(targetPath);
			TreeLogger.logSanitizedPath(sanitizedPath);
			TreeValidator.validateTargetPath(sanitizedPath);
			TreeValidator.validateCommandOptions(treeOptions);
			TreeValidator.validateDepth(treeOptions.depth);
			await this.treeProcessor.initializeIgnoreManager(
				path.dirname(sanitizedPath),
				treeOptions.ignore,
			);
			const tree = await this.treeProcessor.buildTree(sanitizedPath, treeOptions);
			await TreeOutput.handleOutput(tree, {
				format: treeOptions.format,
				output: treeOptions.output,
			});
			const executionTime = Date.now() - startTime;
			TreeLogger.logCommandFinished(executionTime, treeOptions.verbose);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			if (treeOptions.debug) {
				TreeLogger.logErrorContext(error as Error, targetPath, treeOptions);
			}
			TreeLogger.error('Tree command failed', error);
			throw new Error(`Tree command failed: ${errorMessage}`);
		} finally {
			if (treeOptions.debug) {
				TreeLogger.divider();
				TreeLogger.debug('Tree Command Finished');
			}
		}
	}
}
