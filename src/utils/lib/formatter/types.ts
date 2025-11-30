import { TreeStructure, FileMetadata } from '../../../types/index.js';

export interface FormatOptions {
	tabSize?: number;
	level?: number;
	parser?: 'json' | 'markdown';
}

export interface JSONFormatOptions extends FormatOptions {
	tabSize?: number;
}

export interface MarkdownFormatOptions extends FormatOptions {
	level?: number;
	includeContent?: boolean;
	includeMetadata?: boolean;
}

export interface PreviewFormatOptions {
	showContent?: boolean;
	showMetadata?: boolean;
}

export interface FormatResult {
	content: string;
	length: number;
	format: 'json' | 'markdown' | 'preview';
}
