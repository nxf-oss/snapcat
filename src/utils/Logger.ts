import chalk from 'chalk';

export class Logger {
	private static level: 'debug' | 'info' | 'warn' | 'error' = 'info';
	private static isDebugMode = false;
	private static startTime: number = Date.now();

	static setLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
		this.level = level;
		this.isDebugMode = level === 'debug';
		this.debug(`Log level set to: ${level}`);
	}

	static setDebugMode(debug: boolean): void {
		this.isDebugMode = debug;
		if (debug) {
			this.level = 'debug';
			this.startTime = Date.now();
			this.debug('Debug mode enabled - Starting performance tracking');
		}
	}

	private static shouldLog(level: string): boolean {
		const levels = ['debug', 'info', 'warn', 'error'];
		return levels.indexOf(level) >= levels.indexOf(this.level);
	}

	private static getTimestamp(): string {
		const now = Date.now();
		const diff = now - this.startTime;
		return `+${diff}ms`;
	}

	static debug(message: string, data?: any): void {
		if (this.shouldLog('debug') && this.isDebugMode) {
			const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
			console.log(chalk.gray('🔍 [DEBUG]'), timestamp, chalk.gray(message));
			if (data) {
				console.log(chalk.gray('   Data:'), JSON.stringify(data, null, 2));
			}
		}
	}

	static info(message: string): void {
		if (this.shouldLog('info')) {
			console.log(chalk.blue('ℹ'), chalk.blue(message));
		}
	}

	static success(message: string): void {
		if (this.shouldLog('info')) {
			console.log(chalk.green('✅'), chalk.green(message));
		}
	}

	static warn(message: string, readError: unknown): void {
		if (this.shouldLog('warn')) {
			console.log(chalk.yellow('⚠'), chalk.yellow(message));
		}
	}

	static error(message: string, error?: any): void {
		if (this.shouldLog('error')) {
			console.log(chalk.red('❌'), chalk.red(message));
			if (error && this.isDebugMode) {
				console.log(chalk.red('   Error Details:'), error);
				if (error.stack) {
					console.log(chalk.red('   Stack Trace:'), error.stack);
				}
			}
		}
	}

	static performance(marker: string): void {
		if (this.isDebugMode) {
			const timestamp = this.getTimestamp();
			console.log(
				chalk.magenta('⏱️ [PERF]'),
				chalk.magenta(`[${timestamp}]`),
				chalk.magenta(marker),
			);
		}
	}

	static divider(): void {
		if (this.isDebugMode) {
			console.log(chalk.gray('─'.repeat(80)));
		}
	}
}
