import { mapToMethod, mapToMethod2 } from './mapToMethodData';

export interface ParentChildRule {
	id: string;
	parentNode: string;
	childNode: string;
	containerField: string;
	isDefaultContainerField: boolean;
	methodName: string;
	methodType: 'add' | 'set' | 'other';
	ruleSource: 'special_override' | 'container_field' | 'map_to_method' | 'default_rule';
	notes?: string;
}

/**
 * Standard containerField defaults in X3D specification
 */
export const defaultContainerFields: Record<string, string> = {
	"Material": "material",
	"PhysicalMaterial": "material",
	"UnlitMaterial": "material",
	"TwoSidedMaterial": "material",
	"ImageTexture": "texture",
	"MovieTexture": "texture",
	"PixelTexture": "texture",
	"TextureTransform": "textureTransform",
	"Appearance": "appearance",
	"Coordinate": "coord",
	"CoordinateDouble": "coord",
	"Normal": "normal",
	"Color": "color",
	"ColorRGBA": "color",
	"TextureCoordinate": "texCoord",
	"FogCoordinate": "fogCoord",
	"FontStyle": "fontStyle",
	"ScreenFontStyle": "fontStyle",
	"HAnimJoint": "joints",
	"HAnimSegment": "segments",
	"HAnimSite": "sites",
	"HAnimDisplacer": "displacers",
	"HAnimMotion": "motions",
	"HAnimPose": "children",
	"CADFace": "children",
	"CADPart": "children",
	"CADAssembly": "children",
	"Shape": "children",
	"Transform": "children",
	"Group": "children",
	"Viewpoint": "children",
	"NavigationInfo": "children",
	"DirectionalLight": "children",
	"PointLight": "children",
	"SpotLight": "children",
	"TimeSensor": "children",
	"TouchSensor": "children",
	"ProximitySensor": "children",
	"PositionInterpolator": "children",
	"OrientationInterpolator": "children",
	"ColorInterpolator": "children",
	"ScalarInterpolator": "children",
	"ROUTE": "children",
	"MetadataString": "metadata",
	"MetadataSet": "metadata",
	"MetadataInteger": "metadata",
	"MetadataFloat": "metadata",
	"MetadataDouble": "metadata",
	"MetadataBoolean": "metadata",
	"field": "children",
	"fieldValue": "children",
	"ShaderPart": "parts",
	"ShaderProgram": "programs"
};

/**
 * Resolves method name following the exact X3D DOM to language serializer engine logic.
 */
export function resolveParentChildMethod(
	parentNode: string,
	childNode: string,
	containerFieldVal?: string | null,
	childIndex: number = 0
): { methodName: string; ruleSource: ParentChildRule['ruleSource']; notes?: string } {
	let addpre = (childIndex > 0 && childNode !== 'IS') ? 'add' : 'set';
	if (childNode === 'field' || childNode === 'fieldValue') {
		addpre = 'add';
	}

	let method = childNode;
	let source: ParentChildRule['ruleSource'] = 'default_rule';
	let notes = '';

	// 1. Check priority override mapToMethod2
	if (mapToMethod2[parentNode] && mapToMethod2[parentNode][childNode]) {
		method = mapToMethod2[parentNode][childNode];
		addpre = '';
		source = 'special_override';
		notes = `Direct override rule from mapToMethod2 for ${parentNode} -> ${childNode}`;
		return { methodName: addpre + method, ruleSource: source, notes };
	}

	// 2. Check mapToMethod
	if (mapToMethod[parentNode]) {
		if (typeof mapToMethod[parentNode][childNode] === 'string') {
			addpre = '';
			method = mapToMethod[parentNode][childNode];
			source = 'map_to_method';
			notes = `Rule from mapToMethod for ${parentNode} -> ${childNode}`;
		} else {
			method = method.charAt(0).toUpperCase() + method.slice(1);
		}
	} else {
		method = method.charAt(0).toUpperCase() + method.slice(1);
	}

	// 3. ContainerField resolution & overrides
	if (containerFieldVal) {
		const cf = containerFieldVal.trim();
		source = 'container_field';
		if (method === 'setShaders') {
			method = 'addShaders';
			addpre = '';
			notes = `containerField override on setShaders -> addShaders`;
		} else if (
			cf === 'joints' ||
			cf === 'sites' ||
			cf === 'skin' ||
			cf === 'viewpoints' ||
			cf === 'skeleton' ||
			cf === 'segments'
		) {
			method = 'add' + cf.charAt(0).toUpperCase() + cf.slice(1);
			addpre = '';
			notes = `HAnim collection containerField "${cf}" mapped to ${method}`;
		} else if (method === 'addValue') {
			// keep addValue
			notes = `Preserving addValue method`;
		} else {
			method = 'set' + cf.charAt(0).toUpperCase() + cf.slice(1);
			addpre = '';
			notes = `containerField "${cf}" mapped to ${method}`;
		}
	}

	// 4. Special cases and adjustments
	if (childNode === 'IS') {
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
	if (parentNode === 'Scene' && (addpre + method === 'setMetadata' || method === 'Metadata')) {
		method = 'Metadata';
		addpre = 'add';
		notes = 'Scene metadata child is added via addMetadata';
	}
	if (childNode === 'LayerSet' && (addpre + method === 'addChild' || addpre + method === 'setChild')) {
		method = 'LayerSet';
		addpre = 'add';
		notes = 'LayerSet in Scene mapped to addLayerSet';
	}
	if (parentNode === 'Transform' && addpre + method === 'addSkin') {
		method = 'Child';
		addpre = 'add';
	}
	if (parentNode === 'field' && addpre + method === 'addJoints') {
		method = 'Child';
		addpre = 'add';
	}

	return {
		methodName: addpre + method,
		ruleSource: source,
		notes
	};
}

/**
 * Builds the comprehensive table of parent node, child node, containerField to method.
 */
export function generateParentChildTable(): ParentChildRule[] {
	const rules: ParentChildRule[] = [];
	const seen = new Set<string>();

	// Add rules from mapToMethod2 first
	for (const parent of Object.keys(mapToMethod2)) {
		for (const child of Object.keys(mapToMethod2[parent])) {
			const mName = mapToMethod2[parent][child];
			const cf = defaultContainerFields[child] || child.toLowerCase();
			const key = `${parent}::${child}::${cf}::${mName}`;
			if (!seen.has(key)) {
				seen.add(key);
				rules.push({
					id: key,
					parentNode: parent,
					childNode: child,
					containerField: cf,
					isDefaultContainerField: true,
					methodName: mName,
					methodType: mName.startsWith('add') ? 'add' : mName.startsWith('set') ? 'set' : 'other',
					ruleSource: 'special_override',
					notes: 'High-priority disambiguation rule from mapToMethod2'
				});
			}
		}
	}

	// Add rules from mapToMethod
	for (const parent of Object.keys(mapToMethod)) {
		for (const child of Object.keys(mapToMethod[parent])) {
			const mName = mapToMethod[parent][child];
			const cf = defaultContainerFields[child] || child.toLowerCase();
			const key = `${parent}::${child}::${cf}::${mName}`;
			if (!seen.has(key)) {
				seen.add(key);
				rules.push({
					id: key,
					parentNode: parent,
					childNode: child,
					containerField: cf,
					isDefaultContainerField: true,
					methodName: mName,
					methodType: mName.startsWith('add') ? 'add' : mName.startsWith('set') ? 'set' : 'other',
					ruleSource: 'map_to_method',
					notes: `Standard X3D hierarchy mapping for ${parent} -> ${child}`
				});
			}
		}
	}

	// Add containerField override rules
	const specialContainerFields = ['joints', 'sites', 'skin', 'viewpoints', 'skeleton', 'segments', 'proxy', 'shaders', 'geometry', 'appearance', 'material', 'coord', 'normal', 'color', 'texCoord'];
	const specialParents = ['HAnimHumanoid', 'HAnimJoint', 'Appearance', 'Shape', 'Collision', 'ParticleSystem', 'IndexedFaceSet'];

	for (const parent of specialParents) {
		for (const cf of specialContainerFields) {
			const child = cf === 'joints' ? 'HAnimJoint'
				: cf === 'segments' ? 'HAnimSegment'
				: cf === 'sites' ? 'HAnimSite'
				: cf === 'viewpoints' ? 'Viewpoint'
				: cf === 'skeleton' ? 'HAnimJoint'
				: cf === 'skin' ? 'Shape'
				: cf === 'proxy' ? 'Transform'
				: cf === 'shaders' ? 'ComposedShader'
				: cf === 'geometry' ? 'Box'
				: cf === 'appearance' ? 'Appearance'
				: cf === 'material' ? 'Material'
				: cf === 'coord' ? 'Coordinate'
				: cf === 'normal' ? 'Normal'
				: cf === 'color' ? 'Color'
				: cf === 'texCoord' ? 'TextureCoordinate'
				: 'X3DNode';

			const res = resolveParentChildMethod(parent, child, cf, 0);
			const key = `${parent}::${child}::${cf}::${res.methodName}`;
			if (!seen.has(key)) {
				seen.add(key);
				rules.push({
					id: key,
					parentNode: parent,
					childNode: child,
					containerField: cf,
					isDefaultContainerField: defaultContainerFields[child] === cf,
					methodName: res.methodName,
					methodType: res.methodName.startsWith('add') ? 'add' : res.methodName.startsWith('set') ? 'set' : 'other',
					ruleSource: 'container_field',
					notes: res.notes || `Explicit containerField="${cf}" resolution`
				});
			}
		}
	}

	return rules;
}
