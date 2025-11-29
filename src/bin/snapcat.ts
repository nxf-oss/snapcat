#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { SnapCat } from '../core/SnapCat.js';
import { Logger } from '../utils/Logger.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const program = new Command();
const snapcat = new SnapCat();
const readMarkdownFile = (filename: string): string => {
	try {
		const filePath = path.join(__dirname, '..', 'src', 'meta', filename);
		return readFileSync(filePath, 'utf8');
	} catch (error) {
		return `Unable to load ${filename}. Please check the file exists.`;
	}
};
program
	.name('snapcat')
	.description(
		' SnapCat - Super Fast Tree & Cat Utility for Text Files\n\n Features:\n Lightning fast file tree generation\n Smart ignore patterns (.gitignore, .snapcatignore)\n JSON & Markdown output formats\n File metadata with SHA256 hashes\n Recursive directory traversal\n Pattern matching support\n Debug mode for development\n Performance optimized with caching',
	)
	.version('2.0.0', '-v, --version', 'Display version information')
	.helpOption('-h, --help', 'Display help for command')
	.addHelpText(
		'after',
		`
 Examples:
  $ snapcat tree                          # Tree of current directory
  $ snapcat tree src --format md          # Tree in markdown format
  $ snapcat tree --depth 2 --no-recursive # Non-recursive with depth limit
  $ snapcat tree --debug --verbose        # Debug mode with verbose output
  $ snapcat cat "*.ts" "*.json"           # Cat TypeScript and JSON files
  $ snapcat cat README.md --preview       # Preview file contents
  $ snapcat cat "src/**/*.ts" --max-size 102400 # Only files under 100KB
 Links:
  Homepage: https:
  Bugs: https:
  Contributing: https:
  License: MIT
 Tip: Use 'snapcat <command> --help' for detailed command usage
`,
	);
const treeCommand = program
	.command('tree [targetPath]')
	.description('Build a hierarchical tree of files and directories')
	.option('-r, --recursive', 'Enable recursive directory traversal (default: true)', true)
	.option('--no-recursive', 'Disable recursive directory traversal')
	.option('-d, --depth <number>', 'Maximum depth for recursion', (val) => parseInt(val, 10))
	.option('-f, --format <format>', 'Output format (json or md)', 'json')
	.option('-o, --output <file>', 'Save output to specified file')
	.option('--ignore <patterns...>', 'Additional ignore patterns (space separated)')
	.option('-p, --preview', 'Preview file contents in output')
	.option('-v, --verbose', 'Enable verbose output with detailed logging')
	.option('--debug', 'Enable debug mode with performance tracking')
	.option('--show-hidden', 'Include hidden files and directories')
	.option('--max-size <bytes>', 'Maximum file size to process', (val) => parseInt(val, 10))
	.addHelpText(
		'after',
		`
 Tree Command Examples:
  Basic Usage:
    $ snapcat tree                        # Current directory tree
    $ snapcat tree /path/to/project       # Specific directory tree
  Output Formats:
    $ snapcat tree --format json          # JSON output (default)
    $ snapcat tree --format md            # Markdown output
  Recursion Control:
    $ snapcat tree --no-recursive         # Current directory only
    $ snapcat tree --depth 3              # Limit recursion depth to 3
  File Management:
    $ snapcat tree --output tree.json     # Save to file
    $ snapcat tree --ignore "*.log tmp"   # Ignore log files and tmp dir
    $ snapcat tree --max-size 1048576     # Only process files under 1MB
  Advanced:
    $ snapcat tree --verbose --show-hidden # Detailed output with hidden files
    $ snapcat tree --debug --preview      # Debug mode with file content preview
 Tree Output Structure:
  The tree command generates a hierarchical structure where:
   Directories are represented as nested objects
   Files include metadata (size, SHA256, path info, permissions)
   Output can be formatted as JSON or Markdown
   Optional file content preview with --preview flag
`,
	);
treeCommand.action(async (targetPath = '.', options) => {
	try {
		await snapcat.tree(path.resolve(targetPath), options);
	} catch (err: any) {
		console.error(' Error running tree command:', err.message);
		if (options.debug) {
			console.error(' Debug info:', err.stack);
		}
		process.exit(1);
	}
});
const catCommand = program
	.command('cat <patterns...>')
	.description('Read files and output their metadata and/or contents')
	.option('-f, --format <format>', 'Output format (json or md)', 'json')
	.option('-o, --output <file>', 'Save output to specified file')
	.option('--ignore <patterns...>', 'Additional ignore patterns (space separated)')
	.option('-p, --preview', 'Preview file contents in output')
	.option('-v, --verbose', 'Enable verbose output with detailed logging')
	.option('--debug', 'Enable debug mode with performance tracking')
	.option('--max-size <bytes>', 'Maximum file size to process', (val) => parseInt(val, 10))
	.option('--timeout <ms>', 'Processing timeout in milliseconds', (val) => parseInt(val, 10))
	.addHelpText(
		'after',
		`
 Cat Command Examples:
  Basic File Reading:
    $ snapcat cat file.txt                # Single file metadata
    $ snapcat cat file1.txt file2.js      # Multiple files metadata
  Pattern Matching:
    $ snapcat cat "*.ts"                  # All TypeScript files
    $ snapcat cat "src/**/*.js"           # All JS files in src subdirectories
    $ snapcat cat "*.{json,md,txt}"       # Multiple file extensions
  Output Control:
    $ snapcat cat "*.js" --format md      # Markdown format output
    $ snapcat cat "*.md" --output report.md # Save to markdown file
  Content Features:
    $ snapcat cat README.md --preview     # Include file content in output
    $ snapcat cat "*.txt" --max-size 102400 # Only files under 100KB
  Advanced Usage:
    $ snapcat cat "*.log" --ignore "error.log" --verbose
    $ snapcat cat "*.ts" --debug --timeout 30000 # Debug mode with 30s timeout
 Cat Output Includes:
   File metadata (extension, size, SHA256 hash, permissions)
   Path information (full, relative, basename)
   File type detection (file, directory, symlink)
   Last modified timestamp
   Optional file content preview with --preview flag
`,
	);
catCommand.action(async (patterns: string[], options) => {
	try {
		await snapcat.cat(patterns, options);
	} catch (err: any) {
		console.error(' Error running cat command:', err.message);
		if (options.debug) {
			console.error(' Debug info:', err.stack);
		}
		process.exit(1);
	}
});
program
	.command('docs')
	.description('Display documentation and help resources')
	.argument('[topic]', 'Documentation topic (readme, license, contributing, tutorial)')
	.action((topic) => {
		switch (topic?.toLowerCase()) {
			case 'readme':
				console.log('\n SNAPCAT README\n');
				console.log(readMarkdownFile('readme.txt'));
				break;
			case 'license':
				console.log('\n SNAPCAT LICENSE\n');
				console.log(readMarkdownFile('license.txt'));
				break;
			case 'contributing':
				console.log('\n CONTRIBUTING GUIDELINES\n');
				console.log(readMarkdownFile('contributing.txt'));
				break;
			case 'tutorial':
				console.log('\n SNAPCAT TUTORIAL\n');
				console.log(readMarkdownFile('tutorial.txt'));
				break;
			default:
				console.log(`
 Available Documentation Topics:
  readme       - Project overview and features
  license      - MIT License details
  contributing - How to contribute to SnapCat
  tutorial     - Step-by-step usage tutorial
Usage: snapcat docs <topic>
        `);
		}
	});
program
	.command('info')
	.description('Display project information and links')
	.action(() => {
		console.log(`
 SNAPCAT - Super Fast Tree & Cat Utility
Version: 2.0.0 (TypeScript Edition)
 Features:
   Lightning-fast file tree generation
   Smart ignore patterns (.gitignore, .snapcatignore)
   Multiple output formats (JSON, Markdown)
   File metadata with SHA256 hashes
   Pattern matching and filtering
   Recursive directory traversal
   Configurable output and formatting
   Debug mode with performance tracking
   File content preview
   Permission and timestamp metadata
 Important Links:
   Homepage: https:
   Bug Reports: https:
   Contributing: https:
   License: MIT
 Quick Start:
  $ snapcat tree --help
  $ snapcat cat --help
  $ snapcat docs tutorial
    `);
	});
program.addHelpCommand('help [command]', 'Display help for specific command');
program.on('command:*', () => {
	console.error(' Invalid command: %s\n', program.args.join(' '));
	console.log(' Available commands:');
	program.commands.forEach((cmd) => {
		console.log(`  ${cmd.name()} - ${cmd.description()}`);
	});
	console.log('\n Use "snapcat --help" for complete usage information');
	process.exit(1);
});
process.on('uncaughtException', (error) => {
	Logger.error('Uncaught Exception', error);
	process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
	Logger.error('Unhandled Rejection', { promise, reason });
	process.exit(1);
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
	program.outputHelp();
}
