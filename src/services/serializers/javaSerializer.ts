import { fieldTypes } from '../fieldTypesData';
import { mapToMethod, mapToMethod2 } from '../mapToMethodData';
import { Serializer, SerializerOptions, SerializationResult } from '../serializerTypes';

const DOUBLE_SUFFIX = 'd';
const FLOAT_SUFFIX = 'f ';

export class JavaSerializer implements Serializer {
	targetLanguage = 'java' as const;
	languageName = 'Java (X3DJSAIL)';
	fileExtension = '.java';
	description = 'Native Java using X3D Java Scene Authoring Interface Library (X3DJSAIL) with method chunking to prevent 64KB bytecode overflow.';

	private code: string[] = [];
	private codeno = 0;
	private precode: string[] = [];
	private preno = 0;
	private postcode: string[] = [];
	private methods: string[] = [];
	private methodno = 0;
	private nodeCount = 0;
	private attributeCount = 0;

	serialize(root: Document | Element, options: SerializerOptions): SerializationResult {
		const startTime = performance.now();
		this.code = [];
		this.codeno = 0;
		this.precode = [];
		this.preno = 0;
		this.postcode = [];
		this.methods = [];
		this.methodno = 0;
		this.nodeCount = 0;
		this.attributeCount = 0;

		const element = (root instanceof Document) ? root.documentElement : root;
		const clazz = options.className || 'Model';
		const packageName = options.packageName || 'net.coderextreme.data';

		let str = `package ${packageName};\n\n`;
		str += `import org.web3d.x3d.jsail.*;\n`;
		str += `import org.web3d.x3d.jsail.CADGeometry.*;\n`;
		str += `import org.web3d.x3d.jsail.Core.*;\n`;
		str += `import org.web3d.x3d.jsail.CubeMapTexturing.*;\n`;
		str += `import org.web3d.x3d.jsail.DIS.*;\n`;
		str += `import org.web3d.x3d.jsail.EnvironmentalEffects.*;\n`;
		str += `import org.web3d.x3d.jsail.EnvironmentalSensor.*;\n`;
		str += `import org.web3d.x3d.jsail.EventUtilities.*;\n`;
		str += `import org.web3d.x3d.jsail.Followers.*;\n`;
		str += `import org.web3d.x3d.jsail.Geometry2D.*;\n`;
		str += `import org.web3d.x3d.jsail.Geometry3D.*;\n`;
		str += `import org.web3d.x3d.jsail.Geospatial.*;\n`;
		str += `import org.web3d.x3d.jsail.Grouping.*;\n`;
		str += `import org.web3d.x3d.jsail.HAnim.*;\n`;
		str += `import org.web3d.x3d.jsail.Interpolation.OrientationInterpolator;\n`;
		str += `import org.web3d.x3d.jsail.Interpolation.*;\n`;
		str += `import org.web3d.x3d.jsail.KeyDeviceSensor.*;\n`;
		str += `import org.web3d.x3d.jsail.Layering.*;\n`;
		str += `import org.web3d.x3d.jsail.Layout.*;\n`;
		str += `import org.web3d.x3d.jsail.Lighting.*;\n`;
		str += `import org.web3d.x3d.jsail.NURBS.*;\n`;
		str += `import org.web3d.x3d.jsail.Navigation.*;\n`;
		str += `import org.web3d.x3d.jsail.Networking.*;\n`;
		str += `import org.web3d.x3d.jsail.ParticleSystems.*;\n`;
		str += `import org.web3d.x3d.jsail.Picking.*;\n`;
		str += `import org.web3d.x3d.jsail.PointingDeviceSensor.*;\n`;
		str += `import org.web3d.x3d.jsail.Rendering.*;\n`;
		str += `import org.web3d.x3d.jsail.RigidBodyPhysics.*;\n`;
		str += `import org.web3d.x3d.jsail.Scripting.*;\n`;
		str += `import org.web3d.x3d.jsail.Shaders.*;\n`;
		str += `import org.web3d.x3d.jsail.Shape.*;\n`;
		str += `import org.web3d.x3d.jsail.Sound.*;\n`;
		str += `import org.web3d.x3d.jsail.Text.*;\n`;
		str += `import org.web3d.x3d.jsail.Texturing3D.*;\n`;
		str += `import org.web3d.x3d.jsail.Texturing.*;\n`;
		str += `import org.web3d.x3d.jsail.Time.*;\n`;
		str += `import org.web3d.x3d.jsail.VolumeRendering.*;\n`;
		str += `import org.web3d.x3d.jsail.fields.*;\n`;
		str += `import java.util.ArrayList;\n`;
		str += `import java.util.List;\n\n`;
		str += `public class ${clazz} {\n`;
		str += `  public static void main(String[] args) {\n`;
		if (options.nativeXsltEngine) {
			str += `    ConfigurationProperties.setXsltEngine(ConfigurationProperties.XSLT_ENGINE_NATIVE_JAVA);\n`;
		}
		str += `    ConfigurationProperties.setDeleteIntermediateFiles(false);\n`;
		str += `    ConfigurationProperties.setStripTrailingZeroes(${options.stripTrailingZeroes});\n`;
		str += `    ConfigurationProperties.setStripDefaultAttributes(${options.stripDefaultAttributes});\n`;
		str += `    ${element.nodeName} model = new ${clazz}().initialize();\n`;
		str += `    System.out.print(model.validationReport().trim());\n`;
		str += `    model.toFileX3D("${clazz}.new.java.x3d");\n`;
		str += `    model.toFileJSON("${clazz}.new.java.x3dj");\n`;
		str += `  }\n\n`;

		// Serialize root body
		const body = `      ${element.nodeName} ${element.nodeName}0 = new ${element.nodeName}()` +
			this.subSerializeToString(element, options, 3, []);

		// Precode declarations
		if (options.breakUpMethods) {
			for (const po of this.precode) {
				if (po) str += `  private ${po}`;
			}
		}

		str += `  public ${element.nodeName} initialize() {\n`;
		if (!options.breakUpMethods) {
			for (const po of this.precode) {
				if (po) str += `    ${po}`;
			}
		}
		str += body + ';\n';
		for (const post of this.postcode) {
			if (post) str += `    ${post}`;
		}
		str += `    return ${element.nodeName}0;\n`;
		str += `  }\n\n`;

		// Print chunked helper methods
		if (this.methods.length > 0) {
			for (const m of this.methods) {
				str += m + '\n';
			}
		}

		// Print array chunk classes
		for (const c of this.code) {
			str += c + '\n';
		}

		str += `}\n`;

		const endTime = performance.now();
		return {
			language: 'java',
			code: str,
			stats: {
				nodeCount: this.nodeCount,
				attributeCount: this.attributeCount,
				methodCount: this.methods.length + 2,
				lineCount: str.split('\n').length,
				generatedClassesCount: this.code.length
			},
			executionTimeMs: Math.round(endTime - startTime)
		};
	}

	private printSubArray(attrType: string, type: string, values: string[], j: string, lead: string, trail: string, options: SerializerOptions): string {
		if (attrType.startsWith('MF')) {
			const chunkRefs: string[] = [];
			for (let i = 0; i < values.length; i += 840) {
				const max = Math.min(i + 840, values.length);
				const curId = this.codeno++;
				const chunkClassName = attrType + curId;
				let chunkCode = `  private class ${chunkClassName} {\n`;
				chunkCode += `    private org.web3d.x3d.jsail.fields.${attrType} getArray() {\n`;
				chunkCode += `      return new org.web3d.x3d.jsail.fields.${attrType}(new ${type}[] {${lead}${values.slice(i, max).join(j)}${trail}});\n`;
				chunkCode += `    }\n`;
				chunkCode += `  }\n`;
				this.code.push(chunkCode);
				chunkRefs.push(`new ${chunkClassName}().getArray()`);
			}

			const maxChunks = options.maxArrayChunksPerMethod || 50;
			if (chunkRefs.length <= maxChunks || !options.breakUpMethods) {
				return chunkRefs.reduce((acc, ref, idx) => idx === 0 ? ref : `${acc}.append(${ref})`, '');
			} else {
				const groupRefs: string[] = [];
				for (let g = 0; g < chunkRefs.length; g += maxChunks) {
					const gEnd = Math.min(g + maxChunks, chunkRefs.length);
					const groupId = this.codeno++;
					const groupName = `${attrType}Group${groupId}`;
					let groupCode = `  private class ${groupName} {\n`;
					groupCode += `    private org.web3d.x3d.jsail.fields.${attrType} getArray() {\n`;
					groupCode += `      return ${chunkRefs[g]}`;
					for (let k = g + 1; k < gEnd; k++) {
						groupCode += `\n        .append(${chunkRefs[k]})`;
					}
					groupCode += `;\n    }\n  }\n`;
					this.code.push(groupCode);
					groupRefs.push(`new ${groupName}().getArray()`);
				}
				return groupRefs.reduce((acc, ref, idx) => idx === 0 ? ref : `${acc}.append(${ref})`, '');
			}
		} else {
			if (type === 'int') {
				for (let v = 0; v < values.length; v++) {
					const num = parseInt(values[v], 10);
					if (num > 4200000000) {
						values[v] = '0x' + num.toString(16).toUpperCase();
					}
				}
			}
			return `new ${type}[] {${lead}${values.join(j)}${trail}}`;
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
			} else if (cf === 'joints' || cf === 'sites' || cf === 'segments') {
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
			method = 'IS';
			addpre = 'set';
		}
		if (addpre + method === 'setPoses' || addpre + method === 'setChildren' || addpre + method === 'addPoses') {
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

		return prepre + addpre + method;
	}

	private getAttributesString(element: Element, options: SerializerOptions): { str: string; DEF?: string; USE?: string } {
		let str = '';
		let fieldAttrType = '';
		let DEF: string | undefined;
		let USE: string | undefined;

		const attrs = Array.from(element.attributes);
		for (const attr of attrs) {
			this.attributeCount++;
			if (attr.name === 'type') {
				fieldAttrType = attr.value;
				let strval = '';
				if (element.nodeName === 'NavigationInfo') {
					strval = `"${attr.value.replace(/"/g, '\\"')}"`;
				} else if (attr.value !== 'VERTEX' && attr.value !== 'FRAGMENT') {
					strval = `"${attr.value}"`;
				} else {
					strval = `"${attr.value.replace(/\\n/g, '\\\\n').replace(/"/g, '\\"')}"`;
				}
				const method = 'set' + attr.name.charAt(0).toUpperCase() + attr.name.slice(1);
				str += `.${method}(${strval})`;
			}
		}

		for (const attr of attrs) {
			const name = attr.name;
			const val = attr.value;
			if (name === 'xmlns:xsd' || name === 'xsd:noNamespaceSchemaLocation' || name === 'containerField' || name === 'type') {
				continue;
			}
			if (name === 'DEF') DEF = val;
			if (name === 'USE') USE = val;

			let method = name;
			let attrType = (fieldTypes[element.nodeName] && fieldTypes[element.nodeName][name]) || 'SFString';

			if (val === 'NULL' && (fieldAttrType === 'SFNode' || fieldAttrType === 'MFNode')) {
				method = 'clearChildren';
			} else {
				method = 'set' + method.charAt(0).toUpperCase() + method.slice(1);
			}

			let strval = '';
			if (val === 'NULL') {
				strval = '';
			} else if (name === 'readInterval') {
				strval = `new SFTime(${val}${DOUBLE_SUFFIX})`;
			} else if (attrType === 'SFString') {
				if (name === 'accessType') {
					strval = `field.ACCESSTYPE_${val.toUpperCase()}`;
				} else {
					const escaped = val
						.replace(/(\\+)([^&\\"]|$)/g, '$1$1$2')
						.replace(/\r?\\n/g, ' ')
						.replace(/\r/g, ' ')
						.replace(/"/g, '\\"');
					strval = `new SFString("${escaped}")`;
				}
			} else if (attrType === 'SFInt32') {
				strval = val;
			} else if (attrType === 'SFFloat') {
				strval = val + FLOAT_SUFFIX;
			} else if (attrType === 'SFDouble') {
				strval = val + DOUBLE_SUFFIX;
			} else if (attrType === 'SFBool') {
				strval = val;
			} else if (attrType === 'SFTime') {
				strval = val + DOUBLE_SUFFIX;
			} else if (attrType === 'MFTime') {
				strval = this.printSubArray(attrType, 'double', val.split(/[ ,]+/), DOUBLE_SUFFIX + ',', '', DOUBLE_SUFFIX, options);
			} else if (attrType === 'MFString') {
				const trimmed = val.replace(/^ *(.*) *$/, '$1');
				const items = trimmed.substring(1, trimmed.length - 1).split(/"[ ,]+"/).map(x =>
					x.replace(/(\\+)([^&\\"]|$)/g, '$1$1$2').replace(/""/g, '\\"\\"').replace(/\\n/g, '\\n')
				);
				strval = this.printSubArray(attrType, 'java.lang.String', items, '","', '"', '"', options);
			} else if (attrType === 'MFInt32' || attrType === 'MFImage' || attrType === 'SFImage') {
				strval = this.printSubArray(attrType, 'int', val.split(/[ ,]+/), ',', '', '', options);
			} else if (
				attrType === 'SFColor' || attrType === 'MFColor' || attrType === 'SFColorRGBA' || attrType === 'MFColorRGBA' ||
				attrType === 'SFVec2f' || attrType === 'SFVec3f' || attrType === 'SFVec4f' || attrType === 'MFVec2f' ||
				attrType === 'MFVec3f' || attrType === 'MFVec4f' || attrType === 'SFMatrix3f' || attrType === 'SFMatrix4f' ||
				attrType === 'MFMatrix3f' || attrType === 'MFMatrix4f' || attrType === 'SFRotation' || attrType === 'MFRotation' ||
				attrType === 'MFFloat'
			) {
				strval = this.printSubArray(attrType, 'float', val.split(/[ ,]+/), FLOAT_SUFFIX + ',', '', FLOAT_SUFFIX, options);
			} else if (
				attrType === 'SFVec2d' || attrType === 'SFVec3d' || attrType === 'SFVec4d' || attrType === 'MFVec2d' ||
				attrType === 'MFVec3d' || attrType === 'MFVec4d' || attrType === 'SFMatrix3d' || attrType === 'SFMatrix4d' ||
				attrType === 'MFMatrix3d' || attrType === 'MFMatrix4d' || attrType === 'MFDouble'
			) {
				strval = this.printSubArray(attrType, 'double', val.split(/[ ,]+/), DOUBLE_SUFFIX + ',', '', DOUBLE_SUFFIX, options);
			} else if (attrType === 'MFBool') {
				strval = this.printSubArray(attrType, 'boolean', val.split(/[ ,]+/), ',', '', '', options);
			} else {
				if (name === 'id' || (element.nodeName === 'Sphere' && name === 'subdivision')) continue;
				strval = `"${val.replace(/\n/g, '\\\\n').replace(/"/g, '\\"')}"`;
			}

			if (name === 'class') method = 'setCssClass';
			if (name === 'id') method = 'setHtmlId';
			if (name === 'style' && element.nodeName !== 'FontStyle') method = 'setCssStyle';

			str += `.${method}(${strval})`;
		}

		return { str, DEF, USE };
	}

	private createNodeMethod(
		element: Element,
		node: Element,
		cn: number,
		parentDEF?: string,
		parentUSE?: string,
		stack: number[] = [],
		options?: SerializerOptions
	): string {
		this.methodno++;
		const methodId = this.methodno;
		const methodName = `get${node.nodeName}_${methodId}`;
		const opts = options || { breakUpMethods: true, maxChildrenPerMethod: 50, maxArrayChunksPerMethod: 50 } as SerializerOptions;

		let DEFpar = '';
		if (node.nodeName.startsWith('HAnim')) {
			if (!parentUSE && parentDEF) {
				DEFpar = `"${parentDEF}"`;
			}
		}

		const attrRes = this.getAttributesString(node, opts);
		const nodeDEF = attrRes.DEF;
		const nodeUSE = attrRes.USE;
		const attrStr = attrRes.str;

		const childElements: { node: Element; cn: number }[] = [];
		for (let i = 0; i < node.childNodes.length; i++) {
			const ch = node.childNodes[i];
			if (ch.nodeType === 1) {
				childElements.push({ node: ch as Element, cn: i });
			}
		}

		const maxChildren = opts.maxChildrenPerMethod || 50;
		let assign = '';
		if (node.nodeName === 'ProtoInstance') {
			assign = `${node.nodeName}${stack[0]} = `;
		}

		if (childElements.length > maxChildren) {
			const chunkAdders: string[] = [];
			for (let cStart = 0; cStart < childElements.length; cStart += maxChildren) {
				const cEnd = Math.min(cStart + maxChildren, childElements.length);
				this.methodno++;
				const adderName = `add${node.nodeName}Children_${this.methodno}`;
				let adderCode = `  private void ${adderName}(${node.nodeName} parent) {\n    parent`;

				for (let i = cStart; i < cEnd; i++) {
					const chNode = childElements[i].node;
					const chCn = childElements[i].cn;

					if (chNode.nodeName === 'ProtoInstance') {
						stack.unshift(this.preno);
						this.preno++;
						this.precode[stack[0]] = `${chNode.nodeName} ${chNode.nodeName}${stack[0]} = null;\n`;
					}

					let chCall = this.printParentChild(node, chNode, chCn, 3);
					const chMethodName = this.createNodeMethod(node, chNode, chCn, nodeDEF, nodeUSE, stack, opts);
					chCall += `(${chMethodName}())`;
					adderCode += chCall;

					if (chNode.nodeName === 'ProtoInstance') {
						stack.shift();
					}
				}
				adderCode += ';\n  }\n';
				this.methods.push(adderCode);
				chunkAdders.push(adderName);
			}

			let methodDef = `  public ${node.nodeName} ${methodName}() {\n`;
			methodDef += `    ${node.nodeName} node = ${assign}new ${node.nodeName}(${DEFpar})${attrStr};\n`;
			for (const aName of chunkAdders) {
				methodDef += `    ${aName}(node);\n`;
			}
			methodDef += `    return node;\n  }\n`;
			this.methods.push(methodDef);
		} else {
			let methodDef = `  public ${node.nodeName} ${methodName}() {\n`;
			methodDef += `    return ${assign}new ${node.nodeName}(${DEFpar})${attrStr}`;

			for (let i = 0; i < childElements.length; i++) {
				const chNode = childElements[i].node;
				const chCn = childElements[i].cn;

				if (chNode.nodeName === 'ProtoInstance') {
					stack.unshift(this.preno);
					this.preno++;
					this.precode[stack[0]] = `${chNode.nodeName} ${chNode.nodeName}${stack[0]} = null;\n`;
				}

				let chCall = this.printParentChild(node, chNode, chCn, 3);
				if (node.nodeName === 'ProtoInstance' && chNode.nodeName === 'fieldValue') {
					const fvRes = this.getAttributesString(chNode, opts);
					const fvVal = `(new ${chNode.nodeName}()${fvRes.str})`;
					if (!this.postcode[stack[0]]) this.postcode[stack[0]] = '';
					this.postcode[stack[0]] += `${node.nodeName}${stack[0]}${chCall}${fvVal};\n`;
				} else {
					const chMethodName = this.createNodeMethod(node, chNode, chCn, nodeDEF, nodeUSE, stack, opts);
					chCall += `(${chMethodName}())`;
					methodDef += chCall;
				}

				if (chNode.nodeName === 'ProtoInstance') {
					stack.shift();
				}
			}

			for (let k = 0; k < node.childNodes.length; k++) {
				const chNode = node.childNodes[k];
				if (chNode.nodeType === 8) {
					const y = (chNode.nodeValue || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
					methodDef += `\n      .addComments(new CommentsBlock("${y.split('\n').join('\\n"+\n"')}))`;
				} else if (chNode.nodeType === 4) {
					methodDef += `\n      .setSourceCode("${(chNode.nodeValue || '').split(/[\r\n]+/).map(x => x.replace(/\\/g, '\\\\').replace(/"/g, '\\"')).join('\\n"+\n"')}")`;
				}
			}

			methodDef += ';\n  }\n';
			this.methods.push(methodDef);
		}

		return methodName;
	}

	private subSerializeToString(element: Element, options: SerializerOptions, n: number, stack: number[]): string {
		this.nodeCount++;
		const attrRes = this.getAttributesString(element, options);
		let str = attrRes.str;
		const DEF = attrRes.DEF;
		const USE = attrRes.USE;

		if (options.breakUpMethods) {
			for (let cn = 0; cn < element.childNodes.length; cn++) {
				const node = element.childNodes[cn];
				if (node.nodeType === 1) {
					const chElem = node as Element;
					const ch = this.printParentChild(element, chElem, cn, n);
					const methodName = this.createNodeMethod(element, chElem, cn, DEF, USE, stack, options);
					str += `${ch}(${methodName}())`;
				} else if (node.nodeType === 8) {
					const y = (node.nodeValue || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
					str += `\n${'  '.repeat(n)}.addComments(new CommentsBlock("${y.split('\n').join('\\n"+\n"')}"))`;
				} else if (node.nodeType === 4) {
					str += `\n${'  '.repeat(n)}.setSourceCode("${(node.nodeValue || '').split(/[\r\n]+/).map(x => x.replace(/\\/g, '\\\\').replace(/"/g, '\\"')).join('\\n"+\n"')}")`;
				}
			}
			return str;
		}

		// Monolithic mode
		for (let cn = 0; cn < element.childNodes.length; cn++) {
			const node = element.childNodes[cn];
			if (node.nodeType === 1) {
				const chElem = node as Element;
				if (chElem.nodeName === 'ProtoInstance') {
					stack.unshift(this.preno);
					this.preno++;
					this.precode[stack[0]] = `${chElem.nodeName} ${chElem.nodeName}${stack[0]} = null;\n`;
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
				ch += this.subSerializeToString(chElem, options, n + 1, stack);
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
				str += `\n${'  '.repeat(n)}.addComments(new CommentsBlock("${y.split('\n').join('\\n"+\n"')}"))`;
			} else if (node.nodeType === 4) {
				str += `\n${'  '.repeat(n)}.setSourceCode("${(node.nodeValue || '').split(/[\r\n]+/).map(x => x.replace(/\\/g, '\\\\').replace(/"/g, '\\"')).join('\\n"+\n"')}")`;
			}
		}

		return str;
	}
}
