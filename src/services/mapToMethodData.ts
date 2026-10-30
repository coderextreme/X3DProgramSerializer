/**
 * Parent node to child node method name mapping table ported from mapToMethod.js and mapToMethod2.js
 */

export const mapToMethod2: Record<string, Record<string, string>> = {
	"Shape": {
		"MetadataString": "addMetadata",
		"ProtoInstance": "setGeometry"
	},
	"Transform": {
		"Shape": "addChild"
	},
	"HAnimJoint": {
		"Transform": "addChildren",
		"Shape": "addChild",
		"HAnimSite": "addChild",
		"Viewpoint": "addChild"
	},
	"Appearance": {
		"ProtoInstance": "addShaders",
		"ProgramShader": "addShaders",
		"ComposedShader": "addShaders",
		"Script": "addChild"
	},
	"ComposedShader": {
		"field": "addField"
	},
	"Script": {
		"field": "addField"
	},
	"MetadataSet": {
		"ProtoInstance": "setMetadata",
		"MetadataBoolean": "addValue",
		"MetadataDouble": "addValue",
		"MetadataFloat": "addValue",
		"MetadataInteger": "addValue",
		"MetadataSet": "addValue",
		"MetadataString": "addValue"
	},
	"RigidBody": {
		"CollidableShape": "addGeometry"
	},
	"HAnimHumanoid": {
		"IS": "addSkin",
		"HAnimJoint": "addJoints",
		"HAnimSegment": "addSegments",
		"HAnimSite": "addViewpoints",
		"MetadataSet": "addMetadata"
	},
	"X3DPickSensorNode": {
		"IS": "addPickedGeometry"
	},
	"VolumePickSensor": {
		"IS": "addPickedGeometry"
	},
	"PointPickSensor": {
		"IS": "addPickedGeometry"
	},
	"Collision": {
		"Transform": "setProxy",
		"Group": "setProxy"
	},
	"PrimitivePickSensor": {
		"IS": "addPickedGeometry"
	},
	"LinePickSensor": {
		"IS": "addPickedGeometry"
	},
	"GeoMetadata": {
		"IS": "addData"
	},
	"GeoLOD": {
		"IS": "addRootNode",
		"GeoOrigin": "setGeoOrigin"
	},
	"Scene": {
		"LayerSet": "addLayerSet",
		"MetadataString": "addMetadata",
		"MetadataSet": "addChildren"
	},
	"field": {
		"HAnimJoint": "addChild"
	}
};

export const mapToMethod: Record<string, Record<string, string>> = {
	"X3DNode": {
		"IS": "setIS",
		"MetadataBoolean": "setMetadata",
		"MetadataDouble": "setMetadata",
		"MetadataFloat": "setMetadata",
		"MetadataInteger": "setMetadata",
		"MetadataSet": "setMetadata",
		"MetadataString": "setMetadata"
	},
	"X3DAppearanceChildNode": {
		"IS": "setIS",
		"MetadataBoolean": "setMetadata",
		"MetadataDouble": "setMetadata",
		"MetadataFloat": "setMetadata",
		"MetadataInteger": "setMetadata",
		"MetadataSet": "setMetadata",
		"MetadataString": "setMetadata"
	},
	"X3DComposedGeometryNode": {
		"FloatVertexAttribute": "addAttrib",
		"Matrix3VertexAttribute": "addAttrib",
		"Matrix4VertexAttribute": "addAttrib",
		"Color": "setColor",
		"ColorRGBA": "setColor",
		"Coordinate": "setCoord",
		"CoordinateDouble": "setCoord",
		"GeoCoordinate": "setCoord",
		"FogCoordinate": "setFogCoord",
		"IS": "setIS",
		"MetadataBoolean": "setMetadata",
		"MetadataDouble": "setMetadata",
		"MetadataFloat": "setMetadata",
		"MetadataInteger": "setMetadata",
		"MetadataSet": "setMetadata",
		"MetadataString": "setMetadata",
		"Normal": "setNormal",
		"Tangent": "setTangent",
		"TextureCoordinate": "setTexCoord",
		"TextureCoordinate3D": "setTexCoord",
		"TextureCoordinate4D": "setTexCoord",
		"TextureCoordinateGenerator": "setTexCoord",
		"MultiTextureCoordinate": "setTexCoord"
	},
	"X3DGroupingNode": {
		"X3DChildNode": "addChildren",
		"IS": "setIS",
		"MetadataBoolean": "setMetadata",
		"MetadataDouble": "setMetadata",
		"MetadataFloat": "setMetadata",
		"MetadataInteger": "setMetadata",
		"MetadataSet": "setMetadata",
		"MetadataString": "setMetadata"
	},
	"X3DShapeNode": {
		"Appearance": "setAppearance",
		"IndexedFaceSet": "setGeometry",
		"IndexedQuadSet": "setGeometry",
		"IndexedTriangleFanSet": "setGeometry",
		"IndexedTriangleSet": "setGeometry",
		"IndexedTriangleStripSet": "setGeometry",
		"QuadSet": "setGeometry",
		"TriangleFanSet": "setGeometry",
		"TriangleSet": "setGeometry",
		"TriangleStripSet": "setGeometry",
		"NurbsPatchSurface": "setGeometry",
		"NurbsTrimmedSurface": "setGeometry",
		"NurbsCurve": "setGeometry",
		"NurbsSweptSurface": "setGeometry",
		"NurbsSwungSurface": "setGeometry",
		"Arc2D": "setGeometry",
		"ArcClose2D": "setGeometry",
		"Box": "setGeometry",
		"Circle2D": "setGeometry",
		"Cone": "setGeometry",
		"Cylinder": "setGeometry",
		"Disk2D": "setGeometry",
		"ElevationGrid": "setGeometry",
		"Extrusion": "setGeometry",
		"GeoElevationGrid": "setGeometry",
		"IndexedLineSet": "setGeometry",
		"InlineGeometry": "setGeometry",
		"LineSet": "setGeometry",
		"PointSet": "setGeometry",
		"Polyline2D": "setGeometry",
		"Polypoint2D": "setGeometry",
		"Rectangle2D": "setGeometry",
		"Sphere": "setGeometry",
		"Text": "setGeometry",
		"TriangleSet2D": "setGeometry",
		"IS": "setIS",
		"MetadataBoolean": "setMetadata",
		"MetadataDouble": "setMetadata",
		"MetadataFloat": "setMetadata",
		"MetadataInteger": "setMetadata",
		"MetadataSet": "setMetadata",
		"MetadataString": "setMetadata"
	},
	"Appearance": {
		"AcousticProperties": "setAcousticProperties",
		"Material": "setMaterial",
		"PhysicalMaterial": "setMaterial",
		"UnlitMaterial": "setMaterial",
		"TwoSidedMaterial": "setMaterial",
		"FillProperties": "setFillProperties",
		"LineProperties": "setLineProperties",
		"PointProperties": "setPointProperties",
		"ComposedShader": "addShaders",
		"PackagedShader": "addShaders",
		"ProgramShader": "addShaders",
		"ImageTexture": "setTexture",
		"MovieTexture": "setTexture",
		"PixelTexture": "setTexture",
		"RenderedTexture": "setTexture",
		"ComposedCubeMapTexture": "setTexture",
		"GeneratedCubeMapTexture": "setTexture",
		"ImageCubeMapTexture": "setTexture",
		"ComposedTexture3D": "setTexture",
		"ImageTexture3D": "setTexture",
		"PixelTexture3D": "setTexture",
		"MultiTexture": "setTexture",
		"TextureTransform": "setTextureTransform",
		"TextureTransform3D": "setTextureTransform",
		"TextureTransformMatrix3D": "setTextureTransform",
		"MultiTextureTransform": "setTextureTransform",
		"IS": "setIS",
		"MetadataBoolean": "setMetadata",
		"MetadataDouble": "setMetadata",
		"MetadataFloat": "setMetadata",
		"MetadataInteger": "setMetadata",
		"MetadataSet": "setMetadata",
		"MetadataString": "setMetadata"
	},
	"Material": {
		"ImageTexture": "setDiffuseTexture",
		"IS": "setIS",
		"MetadataBoolean": "setMetadata"
	},
	"Transform": {
		"Shape": "addChild",
		"Group": "addChildren",
		"Transform": "addChildren",
		"IS": "setIS"
	},
	"Shape": {
		"Appearance": "setAppearance",
		"Box": "setGeometry",
		"Sphere": "setGeometry",
		"Cone": "setGeometry",
		"Cylinder": "setGeometry",
		"IndexedFaceSet": "setGeometry",
		"IndexedLineSet": "setGeometry",
		"Text": "setGeometry",
		"Extrusion": "setGeometry",
		"ElevationGrid": "setGeometry",
		"MetadataString": "addMetadata",
		"ProtoInstance": "setGeometry",
		"IS": "setIS"
	},
	"HAnimHumanoid": {
		"HAnimJoint": "addJoints",
		"HAnimSegment": "addSegments",
		"HAnimSite": "addViewpoints",
		"HAnimMotion": "addMotions",
		"HAnimPose": "addChildren",
		"HAnimDisplacer": "addDisplacers",
		"Coordinate": "setSkinCoord",
		"CoordinateDouble": "setSkinCoord",
		"Normal": "setSkinNormal",
		"Group": "addSkin",
		"Transform": "addSkin",
		"Shape": "addSkin",
		"IndexedFaceSet": "addSkin",
		"MetadataSet": "addMetadata",
		"IS": "setIS"
	},
	"HAnimJoint": {
		"HAnimJoint": "addChildren",
		"HAnimSegment": "addChildren",
		"HAnimDisplacer": "addDisplacers",
		"Transform": "addChildren",
		"Shape": "addChild",
		"HAnimSite": "addChild",
		"Viewpoint": "addChild",
		"IS": "setIS"
	},
	"HAnimSegment": {
		"Coordinate": "setCoord",
		"CoordinateDouble": "setCoord",
		"HAnimDisplacer": "addDisplacers",
		"Shape": "addChildren",
		"Transform": "addChildren",
		"IS": "setIS"
	},
	"HAnimSite": {
		"HAnimDisplacer": "addChildren",
		"Transform": "addChildren",
		"Viewpoint": "addChildren",
		"IS": "setIS"
	},
	"Scene": {
		"LayerSet": "addLayerSet",
		"MetadataString": "addMetadata",
		"MetadataSet": "addChildren",
		"WorldInfo": "addChildren",
		"Viewpoint": "addChildren",
		"NavigationInfo": "addChildren",
		"Background": "addChildren",
		"DirectionalLight": "addChildren",
		"PointLight": "addChildren",
		"SpotLight": "addChildren",
		"Transform": "addChildren",
		"Group": "addChildren",
		"Shape": "addChildren",
		"TimeSensor": "addChildren",
		"ROUTE": "addChildren",
		"HAnimHumanoid": "addChildren",
		"Anchor": "addChildren",
		"Billboard": "addChildren",
		"Collision": "addChildren",
		"Inline": "addChildren",
		"LOD": "addChildren",
		"Switch": "addChildren",
		"Sound": "addChildren",
		"SpatialSound": "addChildren",
		"ProtoDeclare": "addChildren",
		"ExternProtoDeclare": "addChildren",
		"ProtoInstance": "addChildren"
	},
	"head": {
		"component": "addComponent",
		"meta": "addMeta",
		"unit": "addUnit"
	},
	"X3D": {
		"head": "setHead",
		"Scene": "setScene"
	},
	"ProtoInstance": {
		"fieldValue": "addFieldValue",
		"IS": "setIS",
		"MetadataSet": "setMetadata"
	},
	"ComposedShader": {
		"field": "addField",
		"ShaderPart": "addParts",
		"IS": "setIS"
	},
	"Script": {
		"field": "addField",
		"IS": "setIS"
	},
	"ProtoDeclare": {
		"ProtoBody": "setProtoBody",
		"ProtoInterface": "setProtoInterface"
	},
	"ProtoInterface": {
		"field": "addField"
	},
	"ProtoBody": {
		"Transform": "addChildren",
		"Group": "addChildren",
		"Shape": "addChildren"
	},
	"IS": {
		"connect": "addConnect"
	},
	"Collision": {
		"Transform": "setProxy",
		"Group": "setProxy"
	},
	"Sound": {
		"AudioClip": "setSource",
		"MovieTexture": "setSource",
		"IS": "setIS"
	},
	"SpatialSound": {
		"AudioClip": "addChildren",
		"Gain": "addChildren",
		"IS": "setIS"
	},
	"Text": {
		"FontStyle": "setFontStyle",
		"ScreenFontStyle": "setFontStyle",
		"IS": "setIS"
	},
	"IndexedTriangleSet": {
		"Coordinate": "setCoord",
		"Normal": "setNormal",
		"Color": "setColor",
		"TextureCoordinate": "setTexCoord"
	},
	"IndexedTriangleFanSet": {
		"Coordinate": "setCoord",
		"Normal": "setNormal",
		"Color": "setColor",
		"TextureCoordinate": "setTexCoord"
	},
	"IndexedTriangleStripSet": {
		"Coordinate": "setCoord",
		"Normal": "setNormal",
		"Color": "setColor",
		"TextureCoordinate": "setTexCoord"
	},
	"GeoElevationGrid": {
		"GeoOrigin": "setGeoOrigin",
		"Color": "setColor",
		"Normal": "setNormal"
	},
	"GeoLocation": {
		"GeoOrigin": "setGeoOrigin",
		"Transform": "addChildren"
	},
	"GeoLOD": {
		"GeoOrigin": "setGeoOrigin"
	},
	"GeoViewpoint": {
		"GeoOrigin": "setGeoOrigin"
	},
	"GeoPositionInterpolator": {
		"GeoOrigin": "setGeoOrigin"
	},
	"GeoProximitySensor": {
		"GeoOrigin": "setGeoOrigin"
	},
	"GeoTouchSensor": {
		"GeoOrigin": "setGeoOrigin"
	},
	"CADAssembly": {
		"CADPart": "addChildren",
		"CADFace": "addChildren"
	},
	"CADPart": {
		"CADFace": "addChildren"
	},
	"CADFace": {
		"Shape": "setShape",
		"LOD": "setShape",
		"Transform": "setShape"
	},
	"ParticleSystem": {
		"Appearance": "setAppearance",
		"PointEmitter": "setEmitter",
		"ConeEmitter": "setEmitter",
		"ExplosionEmitter": "setEmitter",
		"PolylineEmitter": "setEmitter",
		"SurfaceEmitter": "setEmitter",
		"VolumeEmitter": "setEmitter",
		"BoundedPhysicsModel": "addPhysics",
		"ForcePhysicsModel": "addPhysics",
		"WindPhysicsModel": "addPhysics",
		"Color": "setColor",
		"Coordinate": "setTexCoord"
	}
};
