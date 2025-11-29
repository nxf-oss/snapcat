import { promises as fs } from 'fs';
import path from 'path';
import { SnapCatConfig } from '../types/index.js';

async function detectTextExtensions(rootDir: string): Promise<string[]> {
	const extensions = new Set<string>();

	async function scan(dir: string) {
		const entries = await fs.readdir(dir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				await scan(fullPath);
			} else if (entry.isFile()) {
				try {
					const buffer = await fs.readFile(fullPath);
					const textCheck = buffer.slice(0, 100).toString('utf8');
					if (/[\x00-\x08\x0E-\x1F]/.test(textCheck)) continue;
					extensions.add(path.extname(entry.name).toLowerCase() || '');
				} catch {}
			}
		}
	}

	await scan(rootDir);
	return Array.from(extensions).filter(Boolean);
}

const baseConfig: SnapCatConfig = {
	tabSize: 2,
	maxConcurrent: 20,
	ignorePatterns: [
		'node_modules',
		'.git',
		'.DS_Store',
		'Thumbs.db',
		'*.log',
		'*.tmp',
		'*.temp',
		'.npm',
		'.yarn',
		'dist',
		'build',
		'coverage',
		'.nyc_output',
		'*.d.ts',
		'*.map',
	],
	defaultOutputFormat: 'json',
	allowedExtensions: [],
	showHidden: false,
	maxFileSize: 5 * 1024 * 1024,
	logLevel: 'info',
	enableCache: true,
	timeout: 1200000,
};

export async function defaultConfig(): Promise<SnapCatConfig> {
	const autoExtensions = await detectTextExtensions(process.cwd());
	return { ...baseConfig, allowedExtensions: autoExtensions };
}
