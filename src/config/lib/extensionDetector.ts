import { promises as fs } from 'fs';
import path from 'path';
import { ExtensionDetector } from './configTypes.js';

export class DefaultExtensionDetector implements ExtensionDetector {
	async detectTextExtensions(rootDir: string): Promise<string[]> {
		const extensions = new Set<string>();

		async function scan(this: any, dir: string) {
			try {
				const entries = await fs.readdir(dir, { withFileTypes: true });

				for (const entry of entries) {
					const fullPath = path.join(dir, entry.name);

					if (entry.isDirectory()) {
						// Skip common directories that don't contain text files
						if (this.shouldSkipDirectory(entry.name)) continue;
						await scan(fullPath);
					} else if (entry.isFile()) {
						await this.analyzeFile(entry.name, fullPath, extensions);
					}
				}
			} catch (error) {
				// Silently skip directories we can't access
			}
		}

		await scan.call(this, rootDir);
		return Array.from(extensions).filter(Boolean);
	}

	private shouldSkipDirectory(dirName: string): boolean {
		const skipDirs = [
			'node_modules',
			'.git',
			'dist',
			'build',
			'coverage',
			'.nyc_output',
			'.npm',
			'.yarn',
			'.cache',
		];
		return skipDirs.includes(dirName);
	}

	private async analyzeFile(
		fileName: string,
		fullPath: string,
		extensions: Set<string>,
	): Promise<void> {
		try {
			const buffer = await fs.readFile(fullPath);
			const textCheck = buffer.slice(0, 100).toString('utf8');

			// Skip binary files by checking for non-printable characters
			if (/[\x00-\x08\x0E-\x1F]/.test(textCheck)) return;

			const extension = path.extname(fileName).toLowerCase();
			if (extension) {
				extensions.add(extension);
			}
		} catch {
			// Skip files we can't read
		}
	}
}
