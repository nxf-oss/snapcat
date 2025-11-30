import { LogLevel, LogType, LogEntry } from './lib/logger/types.js';
import { LogLevelManager } from './lib/logger/logLevel.js';
import { PerformanceTracker } from './lib/logger/performanceTracker.js';
import { ConsoleWriter } from './lib/logger/consoleWriter.js';
import { LoggerValidator } from './lib/logger/validator.js';

export class Logger {
	private static levelManager = new LogLevelManager();
	private static performanceTracker = PerformanceTracker;

	static setLevel(level: LogLevel): void {
		LoggerValidator.validateLogLevel(level);

		this.levelManager.setLevel(level);
		this.debug(`Log level set to: ${level}`);
	}

	static setDebugMode(debug: boolean): void {
		this.levelManager.setDebugMode(debug);

		if (debug) {
			this.performanceTracker.reset();
			this.debug('Debug mode enabled - Starting performance tracking');
		}
	}

	static debug(message: string, data?: any): void {
		LoggerValidator.validateMessage(message);

		if (this.levelManager.shouldLog('debug') && this.levelManager.isDebugMode()) {
			const entry: LogEntry = {
				type: 'debug',
				message,
				data,
				timestamp: Date.now(),
				elapsed: this.performanceTracker.getElapsedTime(),
			};

			ConsoleWriter.write(entry);
		}
	}

	static info(message: string): void {
		LoggerValidator.validateMessage(message);

		if (this.levelManager.shouldLog('info')) {
			const entry: LogEntry = {
				type: 'info',
				message,
				timestamp: Date.now(),
				elapsed: this.performanceTracker.getElapsedTime(),
			};

			ConsoleWriter.write(entry);
		}
	}

	static success(message: string): void {
		LoggerValidator.validateMessage(message);

		if (this.levelManager.shouldLog('info')) {
			const entry: LogEntry = {
				type: 'success',
				message,
				timestamp: Date.now(),
				elapsed: this.performanceTracker.getElapsedTime(),
			};

			ConsoleWriter.write(entry);
		}
	}

	static warn(message: string, error?: any): void {
		LoggerValidator.validateMessage(message);

		if (this.levelManager.shouldLog('warn')) {
			const entry: LogEntry = {
				type: 'warn',
				message,
				error,
				timestamp: Date.now(),
				elapsed: this.performanceTracker.getElapsedTime(),
			};

			ConsoleWriter.write(entry);
		}
	}

	static error(message: string, error?: any): void {
		LoggerValidator.validateMessage(message);

		if (this.levelManager.shouldLog('error')) {
			const entry: LogEntry = {
				type: 'error',
				message,
				error,
				timestamp: Date.now(),
				elapsed: this.performanceTracker.getElapsedTime(),
			};

			ConsoleWriter.write(entry);
		}
	}

	static performance(marker: string): void {
		LoggerValidator.validateMessage(marker);

		if (this.levelManager.isDebugMode()) {
			const entry: LogEntry = {
				type: 'performance',
				message: marker,
				timestamp: Date.now(),
				elapsed: this.performanceTracker.getElapsedTime(),
			};

			ConsoleWriter.write(entry);
		}
	}

	static divider(): void {
		if (this.levelManager.isDebugMode()) {
			const entry: LogEntry = {
				type: 'divider',
				message: '',
				timestamp: Date.now(),
				elapsed: this.performanceTracker.getElapsedTime(),
			};

			ConsoleWriter.write(entry);
		}
	}

	// Additional utility methods
	static startPerformance(marker: string): void {
		if (this.levelManager.isDebugMode()) {
			this.performanceTracker.start(marker);
		}
	}

	static endPerformance(marker: string): number {
		if (this.levelManager.isDebugMode()) {
			const duration = this.performanceTracker.end(marker);
			this.performance(`Performance marker '${marker}': ${duration}ms`);
			return duration;
		}
		return 0;
	}

	static getCurrentLevel(): LogLevel {
		return this.levelManager.getCurrentLevel();
	}

	static isDebugEnabled(): boolean {
		return this.levelManager.isDebugMode();
	}

	static reset(): void {
		this.levelManager.setLevel('info');
		this.performanceTracker.reset();
	}
}
