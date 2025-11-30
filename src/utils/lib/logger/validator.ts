import { LogLevel, LogType } from './types.js';
import { LOG_LEVELS } from './constants.js';

export class LoggerValidator {
	static validateLogLevel(level: string): level is LogLevel {
		const validLevels = Object.keys(LOG_LEVELS) as LogLevel[];
		return validLevels.includes(level as LogLevel);
	}

	static validateLogType(type: string): type is LogType {
		const validTypes: LogType[] = [
			'debug',
			'info',
			'success',
			'warn',
			'error',
			'performance',
			'divider',
		];
		return validTypes.includes(type as LogType);
	}

	static validateMessage(message: string): void {
		if (!message || typeof message !== 'string') {
			throw new Error('Log message must be a non-empty string');
		}
	}

	static validateOptions(options: any): void {
		if (options && typeof options !== 'object') {
			throw new Error('Logger options must be an object');
		}

		if (options.level && !this.validateLogLevel(options.level)) {
			throw new Error(`Invalid log level: ${options.level}`);
		}

		if (options.debugMode !== undefined && typeof options.debugMode !== 'boolean') {
			throw new Error('Debug mode must be a boolean');
		}
	}
}
