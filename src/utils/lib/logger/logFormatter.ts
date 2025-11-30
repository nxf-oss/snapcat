import chalk from 'chalk';
import { LogEntry, LogType } from './types.js';
import { LOG_ICONS, LOG_COLORS } from './constants.js';
import { PerformanceTracker } from './performanceTracker.js';
export class LogFormatter {
	static formatEntry(entry: LogEntry): string[] {
		const lines: string[] = [];
		switch (entry.type) {
			case 'debug':
				lines.push(this.formatDebug(entry));
				break;
			case 'info':
				lines.push(this.formatInfo(entry));
				break;
			case 'success':
				lines.push(this.formatSuccess(entry));
				break;
			case 'warn':
				lines.push(this.formatWarn(entry));
				break;
			case 'error':
				lines.push(this.formatError(entry));
				break;
			case 'performance':
				lines.push(this.formatPerformance(entry));
				break;
			case 'divider':
				lines.push(this.formatDivider());
				break;
		}
		if (entry.data && entry.type !== 'divider') {
			lines.push(this.formatData(entry.data));
		}
		if (entry.error && entry.type === 'error') {
			lines.push(...this.formatErrorDetails(entry.error));
		}
		return lines;
	}
	private static formatDebug(entry: LogEntry): string {
		const timestamp = chalk[LOG_COLORS.timestamp](
			`[${PerformanceTracker.formatElapsedTime()}]`,
		);
		const icon = LOG_ICONS.debug;
		const message = chalk[LOG_COLORS.debug](entry.message);
		return `${chalk[LOG_COLORS.debug](icon)} [DEBUG] ${timestamp} ${message}`;
	}
	private static formatInfo(entry: LogEntry): string {
		const icon = LOG_ICONS.info;
		const message = chalk[LOG_COLORS.info](entry.message);
		return `${chalk[LOG_COLORS.info](icon)} ${message}`;
	}
	private static formatSuccess(entry: LogEntry): string {
		const icon = LOG_ICONS.success;
		const message = chalk[LOG_COLORS.success](entry.message);
		return `${chalk[LOG_COLORS.success](icon)} ${message}`;
	}
	private static formatWarn(entry: LogEntry): string {
		const icon = LOG_ICONS.warn;
		const message = chalk[LOG_COLORS.warn](entry.message);
		return `${chalk[LOG_COLORS.warn](icon)} ${message}`;
	}
	private static formatError(entry: LogEntry): string {
		const icon = LOG_ICONS.error;
		const message = chalk[LOG_COLORS.error](entry.message);
		return `${chalk[LOG_COLORS.error](icon)} ${message}`;
	}
	private static formatPerformance(entry: LogEntry): string {
		const timestamp = chalk[LOG_COLORS.timestamp](
			`[${PerformanceTracker.formatElapsedTime()}]`,
		);
		const icon = LOG_ICONS.performance;
		const message = chalk[LOG_COLORS.performance](entry.message);
		return `${chalk[LOG_COLORS.performance](icon)} [PERF] ${timestamp} ${message}`;
	}
	private static formatDivider(): string {
		return chalk[LOG_COLORS.divider]('─'.repeat(80));
	}
	private static formatData(data: any): string {
		const formattedData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
		return chalk.gray('   Data:') + ` ${formattedData}`;
	}
	private static formatErrorDetails(error: any): string[] {
		const lines: string[] = [];
		if (error && typeof error === 'object') {
			if (error.message && error.message !== error.toString()) {
				lines.push(chalk.red('   Error Details:') + ` ${error.message}`);
			}
			if (error.stack) {
				lines.push(chalk.red('   Stack Trace:') + ` ${error.stack}`);
			}
		} else if (error) {
			lines.push(chalk.red('   Error Details:') + ` ${error}`);
		}
		return lines;
	}
	static formatSimple(message: string, type: LogType = 'info'): string {
		const icon = LOG_ICONS[type as keyof typeof LOG_ICONS] ?? '';
		const color = LOG_COLORS[type as keyof typeof LOG_COLORS] ?? 'white';
		return `${chalk[color](icon)} ${chalk[color](message)}`;
	}
}
