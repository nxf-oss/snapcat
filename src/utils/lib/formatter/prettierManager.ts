import prettier from 'prettier';
import { FormatterLogger } from './logger.js';
export class PrettierManager {
	static async formatJSON(content: string): Promise<string> {
		try {
			return await prettier.format(content, {
				parser: 'json',
				semi: true,
				singleQuote: true,
				trailingComma: 'all',
			});
		} catch (error) {
			FormatterLogger.warn('Prettier JSON formatting failed, using fallback', error);
			return content;
		}
	}
	static async formatMarkdown(content: string): Promise<string> {
		try {
			return await prettier.format(content, {
				parser: 'markdown',
				proseWrap: 'always',
				singleQuote: true,
				trailingComma: 'all',
			});
		} catch (error) {
			FormatterLogger.warn('Prettier Markdown formatting failed, using fallback', error);
			return content;
		}
	}
	static async formatCode(content: string, language: string): Promise<string> {
		try {
			const parser = this.getParserForLanguage(language);
			return await prettier.format(content, { parser });
		} catch (error) {
			FormatterLogger.warn(`Prettier ${language} formatting failed, using fallback`, error);
			return content;
		}
	}
	private static getParserForLanguage(language: string): string {
		const parserMap: { [key: string]: string } = {
			javascript: 'babel',
			typescript: 'typescript',
			js: 'babel',
			ts: 'typescript',
			css: 'css',
			scss: 'scss',
			html: 'html',
			json: 'json',
			yaml: 'yaml',
			md: 'markdown',
			markdown: 'markdown',
		};
		return parserMap[language.toLowerCase()] || 'babel';
	}
}
