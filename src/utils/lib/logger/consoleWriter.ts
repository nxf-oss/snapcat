import { LogEntry, LogType } from './types.js';
import { LogFormatter } from './logFormatter.js';

export class ConsoleWriter {
	static write(entry: LogEntry): void {
		const lines = LogFormatter.formatEntry(entry);

		for (const line of lines) {
			switch (entry.type) {
				case 'error':
					console.error(line);
					break;
				case 'warn':
					console.warn(line);
					break;
				default:
					console.log(line);
					break;
			}
		}
	}

	static writeLines(lines: string[], type: LogType = 'info'): void {
		for (const line of lines) {
			switch (type) {
				case 'error':
					console.error(line);
					break;
				case 'warn':
					console.warn(line);
					break;
				default:
					console.log(line);
					break;
			}
		}
	}

	static writeRaw(message: string): void {
		console.log(message);
	}
}
