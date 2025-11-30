import { Command } from 'commander';
import path from 'path';
import { SnapCat } from '../core/SnapCat.js';
import { Logger } from '../utils/Logger.js';
import helpBlocks from './lib/helpBlocks.js';
import treeHelp from './lib/treeHelp.js';
import catHelp from './lib/catHelp.js';
import { docsHelp } from './lib/docsHelp.js';
import infoHelp from './lib/infoHelp.js';

export class SnapCatCLI {
	private program: Command;
	private snapcat: SnapCat;

	constructor() {
		this.program = new Command();
		this.snapcat = new SnapCat();
		this.setupProgram();
	}

	private setupProgram(): void {
		this.program
			.name('snapcat')
			.description(helpBlocks.overview)
			.version('1.0.1', '-v, --version', 'Display version information')
			.helpOption('-h, --help', 'Display help for command')
			.addHelpText('after', helpBlocks.examples)
			.addHelpText('after', helpBlocks.links)
			.addHelpText('after', helpBlocks.footer);

		this.setupTreeCommand();
		this.setupCatCommand();
		this.setupDocsCommand();
		this.setupInfoCommand();
		this.setupHelpCommand();
		this.setupErrorHandling();
	}

	private setupTreeCommand(): void {
		this.program
			.command('tree [targetPath]')
			.description(treeHelp.description)
			.option('-r, --recursive', 'Enable recursive directory traversal (default: true)', true)
			.option('--no-recursive', 'Disable recursive directory traversal')
			.option('-d, --depth <number>', 'Maximum depth for recursion', (val) =>
				parseInt(val, 10),
			)
			.option('-f, --format <format>', 'Output format (json or md)', 'json')
			.option('-o, --output <file>', 'Save output to specified file')
			.option('--ignore <patterns...>', 'Additional ignore patterns (space separated)')
			.option('-p, --preview', 'Preview file contents in output')
			.option('-v, --verbose', 'Enable verbose output with detailed logging')
			.option('--debug', 'Enable debug mode with performance tracking')
			.option('--show-hidden', 'Include hidden files and directories')
			.option('--max-size <bytes>', 'Maximum file size to process', (val) =>
				parseInt(val, 10),
			)
			.addHelpText('after', treeHelp.helpText)
			.action(async (targetPath = '.', options) => {
				try {
					Logger.setDebugMode(!!options.debug);
					await this.snapcat.tree(path.resolve(targetPath), options);
				} catch (err: any) {
					console.error(' Error running tree command:', err.message);
					if (options.debug) console.error(' Debug info:', err.stack);
					process.exit(1);
				}
			});
	}

	private setupCatCommand(): void {
		this.program
			.command('cat <patterns...>')
			.description(catHelp.description)
			.option('-f, --format <format>', 'Output format (json or md)', 'json')
			.option('-o, --output <file>', 'Save output to specified file')
			.option('--ignore <patterns...>', 'Additional ignore patterns (space separated)')
			.option('-p, --preview', 'Preview file contents in output')
			.option('-v, --verbose', 'Enable verbose output with detailed logging')
			.option('--debug', 'Enable debug mode with performance tracking')
			.option('--max-size <bytes>', 'Maximum file size to process', (val) =>
				parseInt(val, 10),
			)
			.option('--timeout <ms>', 'Processing timeout in milliseconds', (val) =>
				parseInt(val, 10),
			)
			.addHelpText('after', catHelp.helpText)
			.action(async (patterns: string[], options) => {
				try {
					Logger.setDebugMode(!!options.debug);
					await this.snapcat.cat(patterns, options);
				} catch (err: any) {
					console.error(' Error running cat command:', err.message);
					if (options.debug) console.error(' Debug info:', err.stack);
					process.exit(1);
				}
			});
	}

	private setupDocsCommand(): void {
		this.program
			.command('docs')
			.description('Display documentation and help resources')
			.argument('[topic]', 'Documentation topic (readme, license, contributing, tutorial)')
			.action((topic) => {
				try {
					switch (topic?.toLowerCase()) {
						case docsHelp.topics.readme:
							console.log('\n SNAPCAT README\n', docsHelp.readmeText);
							break;
						case docsHelp.topics.license:
							console.log('\n SNAPCAT LICENSE\n', docsHelp.licenseText);
							break;
						case docsHelp.topics.contributing:
							console.log('\n CONTRIBUTING GUIDELINES\n', docsHelp.contributingText);
							break;
						case docsHelp.topics.tutorial:
							console.log('\n SNAPCAT TUTORIAL\n', docsHelp.tutorialText);
							break;
						default:
							console.log(docsHelp.defaultDocs);
					}
				} catch (error) {
					Logger.error('Error displaying documentation', error);
					console.log(' Documentation files not available. Please check installation.');
				}
			});
	}

	private setupInfoCommand(): void {
		this.program
			.command('info')
			.description('Display project information and links')
			.action(() => {
				try {
					console.log(infoHelp.infoText);
				} catch (error) {
					Logger.error('Error displaying info', error);
				}
			});
	}

	private setupHelpCommand(): void {
		this.program.addHelpCommand('help [command]', 'Display help for specific command');
	}

	private setupErrorHandling(): void {
		// INVALID COMMAND fallback
		this.program.on('command:*', () => {
			console.error(' Invalid command: %s\n', this.program.args.join(' '));
			console.log(' Available commands:');
			this.program.commands.forEach((cmd) =>
				console.log(`  ${cmd.name()} - ${cmd.description()}`),
			);
			console.log('\n Use "snapcat --help" for complete usage information');
			process.exit(1);
		});

		// GLOBAL ERROR HANDLING
		process.on('uncaughtException', (error) => {
			Logger.error('Uncaught Exception', error);
			process.exit(1);
		});

		process.on('unhandledRejection', (reason, promise) => {
			Logger.error('Unhandled Rejection', { promise, reason });
			process.exit(1);
		});
	}

	public run(): void {
		try {
			this.program.parse(process.argv);
			if (!process.argv.slice(2).length) this.program.outputHelp();
		} catch (error) {
			Logger.error('Failed to parse command line arguments', error);
			process.exit(1);
		}
	}
}
export default SnapCatCLI;
