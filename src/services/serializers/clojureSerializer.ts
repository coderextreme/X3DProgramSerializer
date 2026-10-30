import { fieldTypes } from '../fieldTypesData';
import { mapToMethod, mapToMethod2 } from '../mapToMethodData';
import { Serializer, SerializerOptions, SerializationResult } from '../serializerTypes';

export class ClojureSerializer implements Serializer {
	targetLanguage = 'clojure' as const;
	languageName = 'Clojure';
	fileExtension = '.clj';
	description = 'Clojure on JVM using doto macros, interop method calls, and X3DJSAIL.';

	private preno = 0;
	private nodeCount = 0;
	private attributeCount = 0;

	serialize(root: Document | Element, options: SerializerOptions): SerializationResult {
		const startTime = performance.now();
		this.preno = 0;
		this.nodeCount = 0;
		this.attributeCount = 0;

		const element = (root instanceof Document) ? root.documentElement : root;
		const clazz = options.className || 'Model';

		let str = `(ns ${clazz}\n`;
		str += `  (:import [org.web3d.x3d.jsail.Core *]\n`;
		str += `           [org.web3d.x3d.jsail.Grouping *]\n`;
		str += `           [org.web3d.x3d.jsail.Shape *]\n`;
		str += `           [org.web3d.x3d.jsail.Rendering *]\n`;
		str += `           [org.web3d.x3d.jsail.Geometry3D *]\n`;
		str += `           [org.web3d.x3d.jsail.Texturing *]\n`;
		str += `           [org.web3d.x3d.jsail.Time *]\n`;
		str += `           [org.web3d.x3d.jsail.HAnim *]\n`;
		str += `           [org.web3d.x3d.jsail.Interpolation *]\n`;
		str += `           [org.web3d.x3d.jsail.Lighting *]\n`;
		str += `           [org.web3d.x3d.jsail.Navigation *]\n`;
		str += `           [org.web3d.x3d.jsail.Networking *]\n`;
		str += `           [org.web3d.x3d.jsail ConfigurationProperties]))\n\n`;

		const stack: number[] = [this.preno++];

		str += `(ConfigurationProperties/setXsltEngine ConfigurationProperties/XSLT_ENGINE_NATIVE_JAVA)\n`;
		str += `(ConfigurationProperties/setDeleteIntermediateFiles false)\n`;
		str += `(ConfigurationProperties/setStripTrailingZeroes ${options.stripTrailingZeroes ? 'true' : 'false'})\n`;
		str += `(ConfigurationProperties/setStripDefaultAttributes ${options.stripDefaultAttributes ? 'true' : 'false'})\n\n`;

		str += `(def ${element.nodeName}${stack[0]} (doto (${element.nodeName}.)\n`;
		str += this.subSerializeToString(element, 1, stack);
		str += `))\n\n`;

		str += `(.toFileX3D ${element.nodeName}${stack[0]} "${clazz}.new.clojure.x3d")\n`;
		str += `(.toFileJSON ${element.nodeName}${stack[0]} "${clazz}.new.clojure.x3dj")\n`;
		str += `(defn -main []\n`;
		str += `  (println "Serialized X3D scene successfully via Clojure X3DJSAIL bindings."))\n`;

		const endTime = performance.now();
		return {
			language: 'clojure',
			code: str,
			stats: {
				nodeCount: this.nodeCount,
				attributeCount: this.attributeCount,
				methodCount: 1,
				lineCount: str.split('\n').length,
				generatedClassesCount: 0
			},
			executionTimeMs: Math.round(endTime - startTime)
		};
	}

	private printSubArray(type: string, values: string[], j: string, lead: string, trail: string): string {
		const cleanValues = values.filter(v => v !== '' && v !== null);
		const arrayType = type.toLowerCase() + '-array';
		return `(${arrayType} [${lead}${cleanValues.join(j)}${trail}])`;
	}

	private printParentChild(element: Element, node: Element, cn: number): string {
		let addpre = (cn > 0 && node.nodeName !== 'IS') ? 'add' : 'set';
		if (node.nodeName === 'field') {
			addpre = 'add';
		}

		let method = node.nodeName;
		if (mapToMethod2[element.nodeName] && mapToMethod2[element.nodeName][node.nodeName]) {
			addpre = '';
			method = mapToMethod2[element.nodeName][node.nodeName];
			return '.' + addpre + method;
		}

		if (mapToMethod[element.nodeName]) {
			if (typeof mapToMethod[element.nodeName][node.nodeName] === 'string') {
				addpre = '';
				method = mapToMethod[element.nodeName][node.nodeName];
			} else {
				method = method.charAt(0).toUpperCase() + method.slice(1);
			}
		} else {
			method = method.charAt(0).toUpperCase() + method.slice(1);
		}

		const cf = node.getAttribute('containerField');
		if (cf) {
			if (method === 'setShaders') {
				method = 'addShaders';
				addpre = '';
			} else if (cf === 'joints' || cf === 'sites' || cf === 'skin' || cf === 'viewpoints' || cf === 'skeleton' || cf === 'segments') {
				method = 'add' + cf.charAt(0).toUpperCase() + cf.slice(1);
				addpre = '';
			} else {
				method = 'set' + cf.charAt(0).toUpperCase() + cf.slice(1);
				addpre = '';
			}
		}

		if (node.nodeName === 'IS') {
			method = 'IS';
			addpre = 'set';
		}
		if (addpre + method === 'setJoints') {
			method = 'Joints';
			addpre = 'add';
		}
		if (addpre + method === 'setSegments') {
			method = 'Segments';
			addpre = 'add';
		}
		if (element.nodeName === 'Scene' && addpre + method === 'setMetadata') {
			method = 'Metadata';
			addpre = 'add';
		}
		if (node.nodeName === 'LayerSet' && addpre + method === 'addChild') {
			method = 'LayerSet';
			addpre = 'add';
		}

		return '.' + addpre + method;
	}

	private stringValue(attrVal: string, attrType: string): string {
		if (attrVal === 'NULL') return '""';
		if (attrType === 'SFString') {
			return `"${attrVal.replace(/\\n/g, '\\\\n').replace(/"/g, '\\"')}"`;
		} else if (attrType === 'SFInt32') {
			return attrVal;
		} else if (attrType === 'SFFloat') {
			return attrVal.indexOf('.') < 0 ? attrVal + '.0' : attrVal;
		} else if (attrType === 'SFDouble' || attrType === 'SFTime') {
			return attrVal.indexOf('.') < 0 ? attrVal + '.0' : attrVal;
		} else if (attrType === 'SFBool') {
			return attrVal;
		} else if (attrType === 'MFTime') {
			return this.printSubArray('double', attrVal.split(/[ ,\t\r\n]+/), ' ', '', '');
		} else if (attrType === 'MFString') {
			const trimmed = attrVal.replace(/^ *(.*) *$/, '$1');
			const items = trimmed.substring(1, trimmed.length - 1).split(/"[ ,\t\r\n]+"/).map(x =>
				x.replace(/(\\+)/g, '$1$1').replace(/\\\\"/g, '\\"').replace(/\\n/g, '\\n')
			);
			return `(into-array String ["${items.join('" "')}"])`;
		} else if (attrType === 'MFInt32' || attrType === 'MFImage' || attrType === 'SFImage') {
			return this.printSubArray('int', attrVal.split(/[ ,\t\r\n]+/), ' ', '', '');
		} else if (
			attrType === 'SFColor' || attrType === 'MFColor' || attrType === 'SFColorRGBA' || attrType === 'MFColorRGBA' ||
			attrType === 'SFVec2f' || attrType === 'SFVec3f' || attrType === 'SFVec4f' || attrType === 'MFVec2f' ||
			attrType === 'MFVec3f' || attrType === 'MFVec4f' || attrType === 'SFMatrix3f' || attrType === 'SFMatrix4f' ||
			attrType === 'MFMatrix3f' || attrType === 'MFMatrix4f' || attrType === 'SFRotation' || attrType === 'MFRotation' ||
			attrType === 'MFFloat'
		) {
			return this.printSubArray('float', attrVal.split(/[ ,\t\r\n]+/), ' ', '', '');
		} else if (
			attrType === 'SFVec2d' || attrType === 'SFVec3d' || attrType === 'SFVec4d' || attrType === 'MFVec2d' ||
			attrType === 'MFVec3d' || attrType === 'MFVec4d' || attrType === 'SFMatrix3d' || attrType === 'SFMatrix4d' ||
			attrType === 'MFMatrix3d' || attrType === 'MFMatrix4d' || attrType === 'MFDouble'
		) {
			return this.printSubArray('double', attrVal.split(/[ ,\t\r\n]+/), ' ', '', '');
		} else if (attrType === 'MFBool') {
			return this.printSubArray('boolean', attrVal.split(/[ ,\t\r\n]+/), ' ', '', '');
		} else {
			return `"${attrVal.replace(/\n/g, '\\\\n').replace(/"/g, '\\"')}"`;
		}
	}

	private subSerializeToString(element: Element, n: number, stack: number[]): string {
		this.nodeCount++;
		let str = '';
		const attrs = Array.from(element.attributes);

		for (const attr of attrs) {
			this.attributeCount++;
			const name = attr.name;
			const val = attr.value;
			if (name === 'xmlns:xsd' || name === 'xsd:noNamespaceSchemaLocation' || name === 'containerField' || name === 'id') {
				continue;
			}
			const attrType = (fieldTypes[element.nodeName] && fieldTypes[element.nodeName][name]) || 'SFString';
			const strval = this.stringValue(val, attrType);

			let method = name.charAt(0).toUpperCase() + name.slice(1);
			if (name === 'class') method = 'CssClass';
			if (name === 'id') method = 'HtmlId';

			str += '    '.repeat(n) + `(.set${method} ${strval})\n`;
		}

		for (let cn = 0; cn < element.childNodes.length; cn++) {
			const node = element.childNodes[cn];
			if (node.nodeType === 1) {
				const chElem = node as Element;
				stack.unshift(this.preno++);
				let pkg = '';
				if (chElem.nodeName === 'meta') {
					pkg = 'org.web3d.x3d.jsail.Core.';
				}
				const method = this.printParentChild(element, chElem, cn);
				str += '    '.repeat(n) + `(${method} (doto (${pkg}${chElem.nodeName}.)\n`;
				str += this.subSerializeToString(chElem, n + 1, stack);
				str += '    '.repeat(n) + `))\n`;
				stack.shift();
			} else if (node.nodeType === 8) {
				const y = (node.nodeValue || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
				str += '    '.repeat(n) + `(.addComments "${y}")\n`;
			} else if (node.nodeType === 4) {
				const y = (node.nodeValue || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
				str += '    '.repeat(n) + `(.setSourceCode "${y}")\n`;
			}
		}

		return str;
	}
}
