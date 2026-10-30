import { fieldTypes } from '../fieldTypesData';
import { mapToMethod, mapToMethod2 } from '../mapToMethodData';
import { Serializer, SerializerOptions, SerializationResult } from '../serializerTypes';

export class GraalJsSerializer implements Serializer {
	targetLanguage = 'graaljs' as const;
	languageName = 'JavaScript (GraalJS / Polyglot)';
	fileExtension = '.js';
	description = 'GraalVM JavaScript (GraalJS) with seamless Java host interop using Java.type, Java.to, and X3DJSAIL bindings.';

	private precode: string[] = [];
	private preno = 0;
	private postcode: string[] = [];
	private codeno = 0;
	private nodeCount = 0;
	private attributeCount = 0;

	serialize(root: Document | Element, options: SerializerOptions): SerializationResult {
		const startTime = performance.now();
		this.precode = [];
		this.preno = 0;
		this.postcode = [];
		this.codeno = 0;
		this.nodeCount = 0;
		this.attributeCount = 0;

		const element = (root instanceof Document) ? root.documentElement : root;
		const clazz = options.className || 'Model';

		let str = `"use strict";\n\n`;
		str += `// GraalJS Polyglot X3DJSAIL Binding\n`;
		str += `load('X3Dautoclass.js');\n`;
		str += `var ConfigurationProperties = Packages.org.web3d.x3d.jsail.ConfigurationProperties;\n`;
		str += `ConfigurationProperties.setXsltEngine(ConfigurationProperties.XSLT_ENGINE_NATIVE_JAVA);\n`;
		str += `ConfigurationProperties.setDeleteIntermediateFiles(false);\n`;
		str += `ConfigurationProperties.setStripTrailingZeroes(${options.stripTrailingZeroes});\n`;
		str += `ConfigurationProperties.setStripDefaultAttributes(${options.stripDefaultAttributes});\n\n`;
		str += `function doubleToFloat(d) {\n`;
		str += `    if (typeof Float32Array !== 'undefined') {\n`;
		str += `        return new Float32Array(d);\n`;
		str += `    }\n`;
		str += `    return d;\n`;
		str += `}\n\n`;

		const body = `var ${element.nodeName}0 = new ${element.nodeName}()` +
			this.subSerializeToString(element, 3, []);

		for (const po of this.precode) {
			if (po) str += po;
		}

		str += `      ${body};\n`;

		for (const post of this.postcode) {
			if (post) str += `      ${post}\n`;
		}

		str += `\n// Serialize to XML and JSON via X3DJSAIL\n`;
		str += `${element.nodeName}0.toFileX3D("${clazz}.new.graaljs.x3d");\n`;
		str += `${element.nodeName}0.toFileJSON("${clazz}.new.graaljs.x3dj");\n`;

		const endTime = performance.now();
		return {
			language: 'graaljs',
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
				if (num > 4200000000) {
					values[v] = '0x' + num.toString(16).toUpperCase() + '| 0';
				}
			}
		}
		if (type === 'float') {
			return `Java.to(doubleToFloat([${lead}${values.join(j)}${trail}]), Java.type("${type}[]"))`;
		} else {
			return `Java.to([${lead}${values.join(j)}${trail}], Java.type("${type}[]"))`;
		}
	}

	private printParentChild(element: Element, node: Element, cn: number, n: number): string {
		const prepre = `\n${'  '.repeat(n)}.`;
		let addpre = (cn > 0 && node.nodeName !== 'IS') ? 'add' : 'set';
		if (node.nodeName === 'field') {
			addpre = 'add';
		}

		let method = node.nodeName;
		if (mapToMethod2[element.nodeName] && mapToMethod2[element.nodeName][node.nodeName]) {
			addpre = '';
			method = mapToMethod2[element.nodeName][node.nodeName];
			return prepre + addpre + method;
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

		if (method === 'setProxy') {
			method = 'addChild';
			addpre = '';
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

		if (method === 'addChildren') {
			method = 'addChild';
			addpre = '';
		}
		if (node.nodeName === 'IS') {
			method = 'setIS';
			addpre = '';
		}
		if (addpre + method === 'setPoses') {
			method = 'Child';
			addpre = 'add';
		}
		if (addpre + method === 'setJoints') {
			method = 'Joints';
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
		if (element.nodeName === 'field' && addpre + method === 'addJoints') {
			method = 'Child';
			addpre = 'add';
		}

		return prepre + addpre + method;
	}

	private subSerializeToString(element: Element, n: number, stack: number[]): string {
		this.nodeCount++;
		let str = '';
		let fieldAttrType = '';
		const attrs = Array.from(element.attributes);

		for (const attr of attrs) {
			this.attributeCount++;
			if (attr.name === 'type') {
				fieldAttrType = attr.value;
				let strval = '';
				if (element.nodeName === 'NavigationInfo') {
					const items = attr.value.substring(1, attr.value.length - 1).split(/"[ ,]+"/);
					strval = this.printSubArray('java.lang.String', items, '","', '"', '"');
				} else if (attr.value !== 'VERTEX' && attr.value !== 'FRAGMENT') {
					strval = attr.value === 'ALLPASS' ? 'BiquadFilter.TYPE_ALLPASS' : `field.TYPE_${attr.value.toUpperCase()}`;
				} else {
					strval = `"${attr.value.replace(/\\n/g, '\\\\n').replace(/"/g, '\\"')}"`;
				}
				const method = 'set' + attr.name.charAt(0).toUpperCase() + attr.name.slice(1);
				str += `.${method}(${strval})`;
			}
		}

		let DEF: string | undefined;
		let USE: string | undefined;

		for (const attr of attrs) {
			const name = attr.name;
			const val = attr.value;
			if (name === 'xmlns:xsd' || name === 'xsd:noNamespaceSchemaLocation' || name === 'containerField' || name === 'type') {
				continue;
			}
			if (name === 'DEF') DEF = val;
			if (name === 'USE') USE = val;

			let method = name;
			const attrType = (fieldTypes[element.nodeName] && fieldTypes[element.nodeName][name]) || 'SFString';

			if (val === 'NULL' && (fieldAttrType === 'SFNode' || fieldAttrType === 'MFNode')) {
				method = 'clearChildren';
			} else {
				method = 'set' + method.charAt(0).toUpperCase() + method.slice(1);
			}

			let strval = '';
			if (val === 'NULL') {
				strval = '';
			} else if (attrType === 'SFString') {
				if (name === 'accessType') {
					strval = `field.ACCESSTYPE_${val.toUpperCase()}`;
				} else {
					strval = `"${val.replace(/(\\+)([^&\\"]|$)/g, '$1$1$2').replace(/\n/g, '\\n').replace(/"/g, '\\"')}"`;
				}
			} else if (attrType === 'SFInt32') {
				strval = val;
			} else if (attrType === 'SFFloat' || attrType === 'SFDouble' || attrType === 'SFTime') {
				strval = val;
			} else if (attrType === 'SFBool') {
				strval = val;
			} else if (attrType === 'MFTime') {
				strval = this.printSubArray('double', val.split(/[ ,]+/), ',', '', '');
			} else if (attrType === 'MFString') {
				const trimmed = val.replace(/^ *(.*) *$/, '$1');
				const items = trimmed.substring(1, trimmed.length - 1).split(/"[ ,]+"/).map(x =>
					x.replace(/(\\+)([^&\\"]|$)/g, '$1$1$2').replace(/""/g, '\\"\\"').replace(/\\n/g, '\\n')
				);
				strval = this.printSubArray('java.lang.String', items, '","', '"', '"');
			} else if (attrType === 'MFInt32' || attrType === 'MFImage' || attrType === 'SFImage') {
				strval = this.printSubArray('int', val.split(/[ ,]+/), ',', '', '');
			} else if (
				attrType === 'SFColor' || attrType === 'MFColor' || attrType === 'SFColorRGBA' || attrType === 'MFColorRGBA' ||
				attrType === 'SFVec2f' || attrType === 'SFVec3f' || attrType === 'SFVec4f' || attrType === 'MFVec2f' ||
				attrType === 'MFVec3f' || attrType === 'MFVec4f' || attrType === 'SFMatrix3f' || attrType === 'SFMatrix4f' ||
				attrType === 'MFMatrix3f' || attrType === 'MFMatrix4f' || attrType === 'SFRotation' || attrType === 'MFRotation' ||
				attrType === 'MFFloat'
			) {
				strval = this.printSubArray('float', val.split(/[ ,]+/), ',', '', '');
			} else if (
				attrType === 'SFVec2d' || attrType === 'SFVec3d' || attrType === 'SFVec4d' || attrType === 'MFVec2d' ||
				attrType === 'MFVec3d' || attrType === 'MFVec4d' || attrType === 'SFMatrix3d' || attrType === 'SFMatrix4d' ||
				attrType === 'MFMatrix3d' || attrType === 'MFMatrix4d' || attrType === 'MFDouble'
			) {
				strval = this.printSubArray('double', val.split(/[ ,]+/), ',', '', '');
			} else if (attrType === 'MFBool') {
				strval = this.printSubArray('boolean', val.split(/[ ,]+/), ',', '', '');
			} else {
				if (name === 'id') continue;
				strval = `"${val.replace(/\n/g, '\\\\n').replace(/"/g, '\\"')}"`;
			}

			if (name === 'class') method = 'setCssClass';
			if (name === 'id') method = 'setHtmlId';
			if (name === 'style' && element.nodeName !== 'FontStyle') method = 'setCssStyle';

			str += `.${method}(${strval})`;
		}

		for (let cn = 0; cn < element.childNodes.length; cn++) {
			const node = element.childNodes[cn];
			if (node.nodeType === 1) {
				const chElem = node as Element;
				if (chElem.nodeName === 'ProtoInstance') {
					stack.unshift(this.preno);
					this.preno++;
					this.precode[stack[0]] = `var ${chElem.nodeName}${stack[0]} = null;\n`;
				}
				if (element.nodeName === 'ProtoInstance' && chElem.nodeName === 'fieldValue') {
					if (!this.postcode[stack[0]]) this.postcode[stack[0]] = '';
					this.postcode[stack[0]] += `${element.nodeName}${stack[0]}`;
				}

				let ch = this.printParentChild(element, chElem, cn, n);
				ch += '(';
				if (chElem.nodeName === 'ProtoInstance') {
					ch += `${chElem.nodeName}${stack[0]} = `;
				}

				let DEFpar = '';
				if (chElem.nodeName.startsWith('HAnim') && !USE && DEF) {
					DEFpar = `"${DEF}"`;
				}

				ch += `new ${chElem.nodeName}(${DEFpar})`;
				ch += this.subSerializeToString(chElem, n + 1, stack);
				ch += ')';

				if (element.nodeName === 'ProtoInstance' && chElem.nodeName === 'fieldValue') {
					this.postcode[stack[0]] += ch + ';\n';
				} else {
					str += ch;
				}
				if (chElem.nodeName === 'ProtoInstance') {
					stack.shift();
				}
			} else if (node.nodeType === 8) {
				const y = (node.nodeValue || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
				str += `\n${'  '.repeat(n)}.addComments(new CommentsBlock("${y.split('\n').join('\\n"+\n"')}))`;
			} else if (node.nodeType === 4) {
				str += `\n${'  '.repeat(n)}.setSourceCode(\`${(node.nodeValue || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}\`)`;
			}
		}

		return str;
	}
}
