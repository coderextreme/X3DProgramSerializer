import { JavaSerializer } from './javaSerializer';
import { GraalJsSerializer } from './graalJsSerializer';
import { GraalPySerializer } from './graalPySerializer';
import { ClojureSerializer } from './clojureSerializer';
import { RubySerializer } from './rubySerializer';
import { Serializer, SerializerOptions, SerializationResult, TargetLanguage } from '../serializerTypes';

export const serializers: Record<TargetLanguage, Serializer> = {
	java: new JavaSerializer(),
	graaljs: new GraalJsSerializer(),
	graalpy: new GraalPySerializer(),
	clojure: new ClojureSerializer(),
	jruby: new RubySerializer(false),
	truffleruby: new RubySerializer(true),
};

export const defaultSerializerOptions: SerializerOptions = {
	className: 'TufaniModel',
	packageName: 'net.coderextreme.data',
	breakUpMethods: true,
	maxChildrenPerMethod: 50,
	maxArrayChunksPerMethod: 50,
	stripDefaultAttributes: true,
	stripTrailingZeroes: true,
	nativeXsltEngine: true
};

export function parseX3DXml(xmlText: string): Document {
	const parser = new DOMParser();
	const doc = parser.parseFromString(xmlText, 'text/xml');
	const errorNode = doc.querySelector('parsererror');
	if (errorNode) {
		throw new Error('XML Parsing Error: ' + errorNode.textContent);
	}
	return doc;
}

export function serializeX3D(
	xmlOrDoc: string | Document,
	language: TargetLanguage,
	options: Partial<SerializerOptions> = {}
): SerializationResult {
	const doc = typeof xmlOrDoc === 'string' ? parseX3DXml(xmlOrDoc) : xmlOrDoc;
	const fullOptions = { ...defaultSerializerOptions, ...options };
	const serializer = serializers[language];
	if (!serializer) {
		throw new Error(`Unsupported target language serializer: ${language}`);
	}
	return serializer.serialize(doc, fullOptions);
}
