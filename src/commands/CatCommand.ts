import { promises as fs } from 'fs';
import { FileProcessor } from '../core/FileProcessor.js';
import { Formatter } from '../utils/Formatter.js';
import { IgnoreManager } from '../utils/IgnoreManager.js';
import { Logger } from '../utils/Logger.js';
import { Validator } from '../utils/Validator.js';
import { CommandOptions } from '../types/index.js';
export class CatCommand {
	private ignoreManager: IgnoreManager;
	private fileProcessor: FileProcessor;
	constructor() {
		this.ignoreManager = new IgnoreManager();
		this.fileProcessor = new FileProcessor(this.ignoreManager);
	}
	async execute(filePatterns: string[], options: CommandOptions = {}) {
		const startTime = Date.now();
		try {
			Logger.setDebugMode(!!options.debug);
			if (options.debug) {
				Logger.divider();
				Logger.debug('Cat Command Started', {
					filePatterns,
					options,
				});
			}
			const patternsValidation = Validator.validatePatterns(filePatterns);
			if (!patternsValidation.isValid) {
				throw new Error(`Invalid file patterns: ${patternsValidation.error}`);
			}
			const optionsValidation = Validator.validateOptions(options);
			if (!optionsValidation.isValid) {
				throw new Error(`Invalid options: ${optionsValidation.error}`);
			}
			await this.ignoreManager.initialize();
			if (options.ignore) {
				this.ignoreManager.addPatterns(options.ignore);
				Logger.debug(`Added custom ignore patterns: ${options.ignore.join(', ')}`);
			}
			Logger.info(`Processing ${filePatterns.length} file pattern(s)...`);
			const results = await this.fileProcessor.processFiles(filePatterns, {
				preview: options.preview ?? false,
				maxSize: options.maxSize,
				enableCache: !options.debug,
				timeout: options.timeout,
			});
			const format = options.format || 'json';
			let output: string;
			Logger.debug(`Formatting output as: ${format}`);
			if (format === 'md') {
				output = await Formatter.formatMarkdown(results);
			} else {
				output = await Formatter.formatJSON(results);
			}
			if (options.output) {
				Logger.debug(`Writing output to file: ${options.output}`);
				await fs.writeFile(options.output, output, 'utf8');
				Logger.success(`File metadata saved to: ${options.output}`);
				if (options.output) {
					Logger.debug(`Writing output to file: ${options.output}`);
					await fs.writeFile(options.output, output, 'utf8');
					Logger.success(`File metadata saved to: ${options.output}`);
					process.exit(0);
				}
			} else {
				console.log(output);
			}
			const executionTime = Date.now() - startTime;
			Logger.debug(`Cat command completed in ${executionTime}ms`);
			if (options.verbose) {
				const fileCount = Object.keys(results).length;
				Logger.info(`Processed ${fileCount} files in ${executionTime}ms`);
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			Logger.error('Cat command failed', error);
			if (options.debug) {
				Logger.debug('Error context', {
					filePatterns,
					options,
					timestamp: new Date().toISOString(),
				});
			}
			throw new Error(`Cat command failed: ${errorMessage}`);
		} finally {
			if (options.debug) {
				Logger.divider();
				Logger.debug('Cat Command Finished');
			}
		}
	}
}
