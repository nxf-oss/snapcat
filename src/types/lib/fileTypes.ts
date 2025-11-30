export interface FileMetadata {
	extension: string;
	fullPath: string;
	relativePath: string;
	baseName: string;
	size: string;
	sha256: string;
	fileContent: string[];
	fileType: {
		isFile: boolean;
		isDirectory: boolean;
		isSymbolicLink: boolean;
	};
	lastModified?: string;
	permissions?: string;
}

export interface TreeStructure {
	[key: string]: FileMetadata | TreeStructure;
}

export interface FileTypeInfo {
	isFile: boolean;
	isDirectory: boolean;
	isSymbolicLink: boolean;
}

export interface FileStats {
	size: number;
	birthtime: Date;
	mtime: Date;
	atime: Date;
	mode: number;
}

export interface FileContentOptions {
	maxLines?: number;
	encoding?: BufferEncoding;
	preview?: boolean;
}
