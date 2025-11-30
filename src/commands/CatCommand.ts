import { CatValidator } from './lib/catValidator.js';
import { CatProcessor } from './lib/catProcessor.js';
import { CatOutput } from './lib/catOutput.js';
import { CatLogger } from './lib/catLogger.js';
import { CatCommandOptions } from './lib/catTypes.js';
import { CommandOptions } from '../types/index.js';
export class CatCommand {
	private catProcessor: CatProcessor;
	constructor() {
		this.catProcessor = new CatProcessor();
	}
	async execute(filePatterns: string[], options: CommandOptions = {}) {
		const startTime = Date.now();
		const catOptions = options as CatCommandOptions;
		try {
			CatLogger.setDebugMode(!!catOptions.debug);
			if (catOptions.debug) {
				CatLogger.logCommandStart(filePatterns, catOptions);
			}

			CatValidator.validateFilePatterns(filePatterns);
			CatValidator.validateCommandOptions(catOptions);

			await this.catProcessor.initializeIgnoreManager(catOptions.ignore);
			const results = await this.catProcessor.processFiles(filePatterns, catOptions);

			await CatOutput.handleOutput(results, {
				format: catOptions.format,
				output: catOptions.output,
			});

			const executionTime = Date.now() - startTime;
			const fileCount = this.catProcessor.getFileCount(results);
			CatLogger.logCommandFinished(executionTime, fileCount, catOptions.verbose);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			if (catOptions.debug) {
				CatLogger.logErrorContext(error as Error, filePatterns, catOptions);
			}
			CatLogger.error('Cat command failed', error);
			throw new Error(`Cat command failed: ${errorMessage}`);
		} finally {
			if (catOptions.debug) {
				CatLogger.divider();
				CatLogger.debug('Cat Command Finished');
			}
		}
	}
}
