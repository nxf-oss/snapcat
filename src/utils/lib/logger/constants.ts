export const LOG_LEVELS = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
} as const;

export const LOG_ICONS = {
	debug: '',
	info: '',
	success: '',
	warn: '',
	error: '',
	performance: '️',
} as const;

export const LOG_COLORS = {
	debug: 'gray',
	info: 'blue',
	success: 'green',
	warn: 'yellow',
	error: 'red',
	performance: 'magenta',
	timestamp: 'gray',
	divider: 'gray',
} as const;
