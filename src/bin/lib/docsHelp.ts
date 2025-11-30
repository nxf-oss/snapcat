import { readFileSync } from 'fs';
import { join, resolve } from 'path';
const metaDir = resolve(__dirname, '../../meta');
const loadMeta = (filename: string): string => {
	try {
		return readFileSync(join(metaDir, filename), 'utf-8');
	} catch (err) {
		console.warn(`️  Could not load file: ${filename}. Using empty string.`);
		return '';
	}
};
export const readmeText = loadMeta('readme.txt');
export const licenseText = loadMeta('LICENSE.txt');
export const contributingText = loadMeta('contributing.txt');
export const tutorialText = loadMeta('tutorial.txt');
export const docsHelp = {
	topics: {
		readme: 'readme',
		license: 'license',
		contributing: 'contributing',
		tutorial: 'tutorial',
	},
	defaultDocs: `
Available documentation topics:
• readme       - Display SnapCat README
• license      - Display license information
• contributing - Display contributing guidelines
• tutorial     - Display tutorial and usage examples
Usage: snapcat docs <topic>
  `.trim(),
	readmeText,
	licenseText,
	contributingText,
	tutorialText,
};
