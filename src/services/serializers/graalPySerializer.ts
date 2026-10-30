import { fieldTypes } from '../fieldTypesData';
import { mapToMethod, mapToMethod2 } from '../mapToMethodData';
import { Serializer, SerializerOptions, SerializationResult } from '../serializerTypes';

export class GraalPySerializer implements Serializer {
	targetLanguage = 'graalpy' as const;
	languageName = 'Python (GraalPy)';
	fileExtension = '.py';
	description = 'Python on GraalVM (GraalPy) importing x3dpsail bindings and calling X3DJSAIL.';

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

		let str = `import x3dpsail as x3d\n`;
		str += `from x3d_validator import validateX3DJSON\n\n`;

		const stack: number[] = [this.preno++];

		str += `x3d.ConfigurationProperties.setXsltEngine(x3d.ConfigurationProperties.XSLT_ENGINE_NATIVE_JAVA)\n`;
		str += `x3d.ConfigurationProperties.setDeleteIntermediateFiles(False)\n`;
		str += `x3d.ConfigurationProperties.setStripTrailingZeroes(${options.stripTrailingZeroes ? 'True' : 'False'})\n`;
		str += `x3d.ConfigurationProperties.setStripDefaultAttributes(${options.stripDefaultAttributes ? 'True' : 'False'})\n\n`;

		str += `${element.nodeName}${stack[0]} = x3d.${element.nodeName}()\n`;
		str += this.subSerializeToString(element, 3, stack);

		str += `\n# Serialization to files\n`;
		str += `${element.nodeName}${stack[0]}.toFileX3D("${clazz}.new.graalpy.x3d")\n`;
		str += `${element.nodeName}${stack[0]}.toFileJSON("${clazz}.new.graalpy.x3dj")\n`;
		str += `x3djson = ${element.nodeName}${stack[0]}.toStringJSON()\n`;
		str += `validateX3DJSON(False, x3djson)\n`;

		const endTime = performance.now();
		return {
			language: 'graalpy',
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
		if (type === 'int') {
			for (let v = 0; v < values.length; v++) {
				const num = parseInt(values[v], 10);
				if (num > 0x7fffffff) {
					values[v] = (num - 4294967296).toString();
				}
			}
		}
		if (type === 'boolean') {
			for (let v = 0; v < values.length; v++) {
				if (values[v] === 'true') values[v] = 'True';
				else if (values[v] === 'false') values[v] = 'False';
			}
		}

		if (type === 'float') {
			return `x3d.doubleToFloat([${lead}${values.join(j)}${trail}])`;
		} else if (type === 'double') {
			return `x3d.doubleToDouble([${lead}${values.join(j)}${trail}])`;
		} else {
			return `[${lead}${values.join(j)}${trail}]`;
		}
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
			} else if (cf === 'joints' || cf === 'sites' || cf === 'skin' || cf === 'skeleton' || cf === 'segments') {
				method = 'add' + cf.charAt(0).toUpperCase() + cf.slice(1);
				addpre = '';
			} else {
				method = 'set' + cf.charAt(0).toUpperCase() + cf.slice(1);
				addpre = '';
			}
		}

		if (addpre + method === 'setSegments') {
			method = 'Segments';
			addpre = 'add';
		}
		if (method === 'addChildren') {
			method = 'addChild';
			addpre = '';
		}
		if (node.nodeName === 'IS') {
			method = 'IS';
			addpre = 'set';
		}
		if (addpre + method === 'setPoses') {
			method = 'Child';
			addpre = 'add';
		}
		if (addpre + method === 'setJoints') {
			method = 'Joints';
			addpre = 'add';
		}
		if (addpre + method === 'setViewpoints') {
			method = 'Viewpoints';
			addpre = 'add';
		}
		if (addpre + method === 'setSkeleton') {
			method = 'Skeleton';
			addpre = 'add';
		}
		if (addpre + method === 'setSkin') {
			method = 'Skin';
			addpre = 'add';
		}
		if (element.nodeName === 'Transform' && addpre + method === 'addSkin') {
			method = 'Child';
			addpre = 'add';
		}
		if (addpre + method === 'setValue') {
			method = 'Value';
			addpre = 'add';
		}
		if (addpre + method === 'setBack') {
			method = 'BackTexture';
			addpre = 'set';
		}
		if (addpre + method === 'setFront') {
			method = 'FrontTexture';
			addpre = 'set';
		}
		if (addpre + method === 'setLeft') {
			method = 'LeftTexture';
			addpre = 'set';
		}
		if (addpre + method === 'setRight') {
			method = 'RightTexture';
			addpre = 'set';
		}
		if (addpre + method === 'setTop') {
			method = 'TopTexture';
			addpre = 'set';
		}
		if (addpre + method === 'setBottom') {
			method = 'BottomTexture';
			addpre = 'set';
		}
		if (element.nodeName === 'Scene' && addpre + method === 'setMetadata') {
			method = 'Metadata';
			addpre = 'add';
		}
		if (node.nodeName.startsWith('Metadata') && !element.nodeName.startsWith('Metadata') && addpre + method === 'addChild') {
			method = 'Metadata';
			addpre = 'add';
		}
		if (node.nodeName === 'LayerSet' && addpre + method === 'addChild') {
			method = 'LayerSet';
			addpre = 'add';
		}

		return '.' + addpre + method;
	}

	private stringValue(attrName: string, attrVal: string, attrType: string): string {
		if (attrVal === 'NULL') return '""';
		if (attrType === 'SFString') {
			return `"${attrVal.replace(/\\n/g, '\\\\n').replace(/"/g, '\\"')}"`;
		} else if (attrType === 'SFInt32') {
			return attrVal;
		} else if (attrType === 'SFFloat' || attrType === 'SFDouble' || attrType === 'SFTime') {
			return attrVal;
		} else if (attrType === 'SFBool') {
			return attrVal === 'true' ? 'True' : attrVal === 'false' ? 'False' : attrVal;
		} else if (attrType === 'MFTime') {
			return this.printSubArray('double', attrVal.split(/[ ,\t\r\n]+/), ',', '', '');
		} else if (attrType === 'MFString') {
			const trimmed = attrVal.replace(/^ *(.*) *$/, '$1');
			const items = trimmed.substring(1, trimmed.length - 1).split(/"[ ,\t\r\n]+"/).map(x =>
				x.replace(/(\\+)/g, '$1$1').replace(/\\\\"/g, '\\"').replace(/\\n/g, '\\n')
			);
			return this.printSubArray('string', items, '","', '"', '"');
		} else if (attrType === 'MFInt32' || attrType === 'MFImage' || attrType === 'SFImage') {
			return this.printSubArray('int', attrVal.split(/[ ,\t\r\n]+/), ',', '', '');
		} else if (
			attrType === 'SFColor' || attrType === 'MFColor' || attrType === 'SFColorRGBA' || attrType === 'MFColorRGBA' ||
			attrType === 'SFVec2f' || attrType === 'SFVec3f' || attrType === 'SFVec4f' || attrType === 'MFVec2f' ||
			attrType === 'MFVec3f' || attrType === 'MFVec4f' || attrType === 'SFMatrix3f' || attrType === 'SFMatrix4f' ||
			attrType === 'MFMatrix3f' || attrType === 'MFMatrix4f' || attrType === 'SFRotation' || attrType === 'MFRotation' ||
			attrType === 'MFFloat'
		) {
			return this.printSubArray('float', attrVal.split(/[ ,\t\r\n]+/), ',', '', '');
		} else if (
			attrType === 'SFVec2d' || attrType === 'SFVec3d' || attrType === 'SFVec4d' || attrType === 'MFVec2d' ||
			attrType === 'MFVec3d' || attrType === 'MFVec4d' || attrType === 'SFMatrix3d' || attrType === 'SFMatrix4d' ||
			attrType === 'MFMatrix3d' || attrType === 'MFMatrix4d' || attrType === 'MFDouble'
		) {
			return this.printSubArray('double', attrVal.split(/[ ,\t\r\n]+/), ',', '', '');
		} else if (attrType === 'MFBool') {
			return this.printSubArray('boolean', attrVal.split(/[ ,\t\r\n]+/), ',', '', '');
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
			const strval = this.stringValue(name, val, attrType);

			let method = name.charAt(0).toUpperCase() + name.slice(1);
			if (name === 'class') method = 'CssClass';
			if (name === 'id') method = 'HtmlId';
			if (name === 'style' && element.nodeName !== 'FontStyle') method = 'CssStyle';

			str += `${element.nodeName}${stack[0]}.set${method}(${strval})\n`;
		}

		for (let cn = 0; cn < element.childNodes.length; cn++) {
			const node = element.childNodes[cn];
			if (node.nodeType === 1) {
				const chElem = node as Element;
				stack.unshift(this.preno++);
				let ch = `${chElem.nodeName}${stack[0]} = x3d.${chElem.nodeName}()\n`;
				ch += this.subSerializeToString(chElem, n + 1, stack);
				const method = this.printParentChild(element, chElem, cn);
				ch += `${element.nodeName}${stack[1]}${method}(${chElem.nodeName}${stack[0]})\n`;
				str += ch;
				stack.shift();
			} else if (node.nodeType === 8) {
				const y = (node.nodeValue || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
				str += `${element.nodeName}${stack[0]}.addComments(x3d.CommentsBlock("""${y}"""))\n`;
			} else if (node.nodeType === 4) {
				const y = (node.nodeValue || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
				str += `${element.nodeName}${stack[0]}.setSourceCode('''${y}''')\n`;
			}
		}

		return str;
	}
}
