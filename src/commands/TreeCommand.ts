import path from 'path';
import { promises as fs } from 'fs';
import { TreeBuilder } from '../core/TreeBuilder.js';
import { FileProcessor } from '../core/FileProcessor.js';
import { Formatter } from '../utils/Formatter.js';
import { IgnoreManager } from '../utils/IgnoreManager.js';
import { Logger } from '../utils/Logger.js';
import { Validator } from '../utils/Validator.js';
import { CommandOptions } from '../types/index.js';
export class TreeCommand {
	private ignoreManager: IgnoreManager;
	private treeBuilder: TreeBuilder;
	private fileProcessor: FileProcessor;
	constructor() {
		this.ignoreManager = new IgnoreManager();
		this.treeBuilder = new TreeBuilder(this.ignoreManager);
		this.fileProcessor = new FileProcessor(this.ignoreManager);
	}
	async execute(targetPath: string = '.', options: CommandOptions = {}) {
		const startTime = Date.now();
		try {
			Logger.setDebugMode(!!options.debug);
			if (options.debug) {
				Logger.divider();
				Logger.debug('Tree Command Started', {
					targetPath,
					options,
				});
			}
			const sanitizedPath = Validator.sanitizePath(targetPath);
			Logger.debug(`Sanitized target path: ${sanitizedPath}`);
			const optionsValidation = Validator.validateOptions(options);
			if (!optionsValidation.isValid) {
				throw new Error(`Invalid options: ${optionsValidation.error}`);
			}
			await this.ignoreManager.initialize(path.dirname(sanitizedPath));
			if (options.ignore) {
				this.ignoreManager.addPatterns(options.ignore);
				Logger.debug(`Added custom ignore patterns: ${options.ignore.join(', ')}`);
			}
			Logger.info(`Building file tree for: ${sanitizedPath}`);
			const tree = await this.treeBuilder.buildTree(sanitizedPath, {
				recursive: options.recursive ?? true,
				depth: options.depth ?? Infinity,
				preview: options.preview ?? false,
				maxSize: options.maxSize,
				enableCache: !options.debug,
			});
			const format = options.format || 'json';
			let output: string;
			Logger.debug(`Formatting output as: ${format}`);
			if (format === 'md') {
				output = await Formatter.formatMarkdown(tree);
			} else {
				output = await Formatter.formatJSON(tree);
			}
			if (options.output) {
				Logger.debug(`Writing output to file: ${options.output}`);
				await fs.writeFile(options.output, output, 'utf8');
				Logger.success(`Tree structure saved to: ${options.output}`);
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
			Logger.debug(`Tree command completed in ${executionTime}ms`);
			if (options.verbose) {
				Logger.info(`Execution completed in ${executionTime}ms`);
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			Logger.error('Tree command failed', error);
			if (options.debug) {
				Logger.debug('Error context', {
					targetPath,
					options,
					timestamp: new Date().toISOString(),
				});
			}
			throw new Error(`Tree command failed: ${errorMessage}`);
		} finally {
			if (options.debug) {
				Logger.divider();
				Logger.debug('Tree Command Finished');
			}
		}
	}
}
