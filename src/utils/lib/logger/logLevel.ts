import { LogLevel } from './types.js';
import { LOG_LEVELS } from './constants.js';

export class LogLevelManager {
	private currentLevel: LogLevel = 'info';
	private debugMode: boolean = false;
	private startTime: number = Date.now();

	setLevel(level: LogLevel): void {
		this.currentLevel = level;
		this.debugMode = level === 'debug';
	}

	setDebugMode(debug: boolean): void {
		this.debugMode = debug;
		if (debug) {
			this.currentLevel = 'debug';
			this.startTime = Date.now();
		}
	}

	shouldLog(level: LogLevel): boolean {
		return LOG_LEVELS[level] >= LOG_LEVELS[this.currentLevel];
	}

	isDebugMode(): boolean {
		return this.debugMode;
	}

	getStartTime(): number {
		return this.startTime;
	}

	resetStartTime(): void {
		this.startTime = Date.now();
	}

	getCurrentLevel(): LogLevel {
		return this.currentLevel;
	}
}
