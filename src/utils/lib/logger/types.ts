export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogType = 'debug' | 'info' | 'success' | 'warn' | 'error' | 'performance' | 'divider';

export interface LogEntry {
	type: LogType;
	message: string;
	data?: any;
	error?: any;
	timestamp: number;
	elapsed: number;
}

export interface LoggerOptions {
	level?: LogLevel;
	debugMode?: boolean;
	enableColors?: boolean;
	showTimestamp?: boolean;
	showIcons?: boolean;
}

export interface PerformanceMarker {
	name: string;
	timestamp: number;
	elapsed: number;
}
