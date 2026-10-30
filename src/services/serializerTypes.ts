export type TargetLanguage = 'java' | 'graaljs' | 'graalpy' | 'clojure' | 'jruby' | 'truffleruby';

export interface SerializerOptions {
	className: string;
	packageName?: string;
	breakUpMethods: boolean;
	maxChildrenPerMethod: number;
	maxArrayChunksPerMethod: number;
	stripDefaultAttributes: boolean;
	stripTrailingZeroes: boolean;
	nativeXsltEngine: boolean;
}

export interface SerializationResult {
	language: TargetLanguage;
	code: string;
	stats: {
		nodeCount: number;
		attributeCount: number;
		methodCount: number;
		lineCount: number;
		generatedClassesCount: number;
	};
	executionTimeMs: number;
	warnings?: string[];
}

export interface Serializer {
	targetLanguage: TargetLanguage;
	languageName: string;
	fileExtension: string;
	description: string;
	serialize(doc: Document | Element, options: SerializerOptions): SerializationResult;
}
