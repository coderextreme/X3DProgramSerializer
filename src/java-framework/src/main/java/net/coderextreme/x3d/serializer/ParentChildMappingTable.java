package net.coderextreme.x3d.serializer;

import java.util.*;

/**
 * Single Unified Table and Resolution Engine for:
 * (Parent Node, Child Node, Container Field) -> (Method Name or Enum).
 *
 * Implements the full resolution algorithm with:
 * 1. Priority Disambiguation Overrides (from mapToMethod2)
 * 2. Standard Hierarchy Methods (from mapToMethod)
 * 3. ContainerField Overrides (joints, sites, skin, viewpoints, skeleton, segments, proxy)
 * 4. X3D Specification Fallbacks (addChild / setChild)
 */
public class ParentChildMappingTable {

    private static final Map<String, Map<String, String>> MAP_TO_METHOD_2 = new HashMap<>();
    private static final Map<String, Map<String, String>> MAP_TO_METHOD = new HashMap<>();
    private static final Map<String, String> DEFAULT_CONTAINER_FIELDS = new HashMap<>();
    private static final List<ParentChildEntry> COMPLETE_TABLE = new ArrayList<>();

    static {
        initDefaultContainerFields();
        initMapToMethod2();
        initMapToMethod();
        buildCompleteTable();
    }

    private static void initDefaultContainerFields() {
        DEFAULT_CONTAINER_FIELDS.put("Material", "material");
        DEFAULT_CONTAINER_FIELDS.put("PhysicalMaterial", "material");
        DEFAULT_CONTAINER_FIELDS.put("UnlitMaterial", "material");
        DEFAULT_CONTAINER_FIELDS.put("TwoSidedMaterial", "material");
        DEFAULT_CONTAINER_FIELDS.put("ImageTexture", "texture");
        DEFAULT_CONTAINER_FIELDS.put("MovieTexture", "texture");
        DEFAULT_CONTAINER_FIELDS.put("PixelTexture", "texture");
        DEFAULT_CONTAINER_FIELDS.put("TextureTransform", "textureTransform");
        DEFAULT_CONTAINER_FIELDS.put("Appearance", "appearance");
        DEFAULT_CONTAINER_FIELDS.put("Coordinate", "coord");
        DEFAULT_CONTAINER_FIELDS.put("CoordinateDouble", "coord");
        DEFAULT_CONTAINER_FIELDS.put("Normal", "normal");
        DEFAULT_CONTAINER_FIELDS.put("Color", "color");
        DEFAULT_CONTAINER_FIELDS.put("ColorRGBA", "color");
        DEFAULT_CONTAINER_FIELDS.put("TextureCoordinate", "texCoord");
        DEFAULT_CONTAINER_FIELDS.put("FogCoordinate", "fogCoord");
        DEFAULT_CONTAINER_FIELDS.put("FontStyle", "fontStyle");
        DEFAULT_CONTAINER_FIELDS.put("ScreenFontStyle", "fontStyle");
        DEFAULT_CONTAINER_FIELDS.put("HAnimJoint", "joints");
        DEFAULT_CONTAINER_FIELDS.put("HAnimSegment", "segments");
        DEFAULT_CONTAINER_FIELDS.put("HAnimSite", "sites");
        DEFAULT_CONTAINER_FIELDS.put("HAnimDisplacer", "displacers");
        DEFAULT_CONTAINER_FIELDS.put("HAnimMotion", "motions");
        DEFAULT_CONTAINER_FIELDS.put("HAnimPose", "children");
        DEFAULT_CONTAINER_FIELDS.put("Shape", "children");
        DEFAULT_CONTAINER_FIELDS.put("Transform", "children");
        DEFAULT_CONTAINER_FIELDS.put("Group", "children");
        DEFAULT_CONTAINER_FIELDS.put("Viewpoint", "children");
        DEFAULT_CONTAINER_FIELDS.put("NavigationInfo", "children");
        DEFAULT_CONTAINER_FIELDS.put("DirectionalLight", "children");
        DEFAULT_CONTAINER_FIELDS.put("PointLight", "children");
        DEFAULT_CONTAINER_FIELDS.put("SpotLight", "children");
        DEFAULT_CONTAINER_FIELDS.put("TimeSensor", "children");
        DEFAULT_CONTAINER_FIELDS.put("MetadataString", "metadata");
        DEFAULT_CONTAINER_FIELDS.put("MetadataSet", "metadata");
        DEFAULT_CONTAINER_FIELDS.put("field", "children");
        DEFAULT_CONTAINER_FIELDS.put("fieldValue", "children");
    }

    private static void initMapToMethod2() {
        addOverride("Shape", "MetadataString", "addMetadata");
        addOverride("Shape", "ProtoInstance", "setGeometry");
        addOverride("Transform", "Shape", "addChild");
        addOverride("HAnimJoint", "Transform", "addChildren");
        addOverride("HAnimJoint", "Shape", "addChild");
        addOverride("HAnimJoint", "HAnimSite", "addChild");
        addOverride("HAnimJoint", "Viewpoint", "addChild");
        addOverride("Appearance", "ProtoInstance", "addShaders");
        addOverride("Appearance", "ProgramShader", "addShaders");
        addOverride("Appearance", "ComposedShader", "addShaders");
        addOverride("Appearance", "Script", "addChild");
        addOverride("ComposedShader", "field", "addField");
        addOverride("Script", "field", "addField");
        addOverride("MetadataSet", "ProtoInstance", "setMetadata");
        addOverride("MetadataSet", "MetadataBoolean", "addValue");
        addOverride("MetadataSet", "MetadataDouble", "addValue");
        addOverride("MetadataSet", "MetadataFloat", "addValue");
        addOverride("MetadataSet", "MetadataInteger", "addValue");
        addOverride("MetadataSet", "MetadataSet", "addValue");
        addOverride("MetadataSet", "MetadataString", "addValue");
        addOverride("RigidBody", "CollidableShape", "addGeometry");
        addOverride("HAnimHumanoid", "IS", "addSkin");
        addOverride("HAnimHumanoid", "HAnimJoint", "addJoints");
        addOverride("HAnimHumanoid", "HAnimSegment", "addSegments");
        addOverride("HAnimHumanoid", "HAnimSite", "addViewpoints");
        addOverride("HAnimHumanoid", "MetadataSet", "addMetadata");
        addOverride("X3DPickSensorNode", "IS", "addPickedGeometry");
        addOverride("VolumePickSensor", "IS", "addPickedGeometry");
        addOverride("PointPickSensor", "IS", "addPickedGeometry");
        addOverride("Collision", "Transform", "setProxy");
        addOverride("Collision", "Group", "setProxy");
        addOverride("PrimitivePickSensor", "IS", "addPickedGeometry");
        addOverride("LinePickSensor", "IS", "addPickedGeometry");
        addOverride("GeoMetadata", "IS", "addData");
        addOverride("GeoLOD", "IS", "addRootNode");
        addOverride("GeoLOD", "GeoOrigin", "setGeoOrigin");
        addOverride("Scene", "LayerSet", "addLayerSet");
        addOverride("Scene", "MetadataString", "addMetadata");
        addOverride("Scene", "MetadataSet", "addChildren");
        addOverride("field", "HAnimJoint", "addChild");
    }

    private static void initMapToMethod() {
        addMethod("Appearance", "Material", "setMaterial");
        addMethod("Appearance", "PhysicalMaterial", "setMaterial");
        addMethod("Appearance", "UnlitMaterial", "setMaterial");
        addMethod("Appearance", "TwoSidedMaterial", "setMaterial");
        addMethod("Appearance", "ImageTexture", "setTexture");
        addMethod("Appearance", "MovieTexture", "setTexture");
        addMethod("Appearance", "PixelTexture", "setTexture");
        addMethod("Appearance", "TextureTransform", "setTextureTransform");
        addMethod("Appearance", "TextureTransform3D", "setTextureTransform");
        addMethod("Appearance", "FillProperties", "setFillProperties");
        addMethod("Appearance", "LineProperties", "setLineProperties");
        addMethod("Appearance", "PointProperties", "setPointProperties");
        addMethod("Appearance", "AcousticProperties", "setAcousticProperties");

        addMethod("Shape", "Appearance", "setAppearance");
        addMethod("Shape", "Box", "setGeometry");
        addMethod("Shape", "Sphere", "setGeometry");
        addMethod("Shape", "Cone", "setGeometry");
        addMethod("Shape", "Cylinder", "setGeometry");
        addMethod("Shape", "IndexedFaceSet", "setGeometry");
        addMethod("Shape", "IndexedLineSet", "setGeometry");
        addMethod("Shape", "Text", "setGeometry");
        addMethod("Shape", "Extrusion", "setGeometry");
        addMethod("Shape", "ElevationGrid", "setGeometry");

        addMethod("IndexedFaceSet", "Coordinate", "setCoord");
        addMethod("IndexedFaceSet", "CoordinateDouble", "setCoord");
        addMethod("IndexedFaceSet", "GeoCoordinate", "setCoord");
        addMethod("IndexedFaceSet", "Normal", "setNormal");
        addMethod("IndexedFaceSet", "Color", "setColor");
        addMethod("IndexedFaceSet", "ColorRGBA", "setColor");
        addMethod("IndexedFaceSet", "TextureCoordinate", "setTexCoord");

        addMethod("HAnimHumanoid", "HAnimJoint", "addJoints");
        addMethod("HAnimHumanoid", "HAnimSegment", "addSegments");
        addMethod("HAnimHumanoid", "HAnimSite", "addViewpoints");
        addMethod("HAnimHumanoid", "HAnimMotion", "addMotions");
        addMethod("HAnimHumanoid", "HAnimPose", "addChildren");
        addMethod("HAnimHumanoid", "Coordinate", "setSkinCoord");
        addMethod("HAnimHumanoid", "Normal", "setSkinNormal");
        addMethod("HAnimHumanoid", "Shape", "addSkin");
        addMethod("HAnimHumanoid", "Transform", "addSkin");

        addMethod("HAnimJoint", "HAnimJoint", "addChildren");
        addMethod("HAnimJoint", "HAnimSegment", "addChildren");
        addMethod("HAnimJoint", "HAnimDisplacer", "addDisplacers");

        addMethod("HAnimSegment", "Coordinate", "setCoord");
        addMethod("HAnimSegment", "HAnimDisplacer", "addDisplacers");

        addMethod("Scene", "Transform", "addChildren");
        addMethod("Scene", "Group", "addChildren");
        addMethod("Scene", "Shape", "addChildren");
        addMethod("Scene", "Viewpoint", "addChildren");
        addMethod("Scene", "NavigationInfo", "addChildren");
        addMethod("Scene", "Background", "addChildren");
        addMethod("Scene", "DirectionalLight", "addChildren");
        addMethod("Scene", "PointLight", "addChildren");
        addMethod("Scene", "SpotLight", "addChildren");
        addMethod("Scene", "TimeSensor", "addChildren");
        addMethod("Scene", "ROUTE", "addChildren");
        addMethod("Scene", "HAnimHumanoid", "addChildren");
        addMethod("Scene", "WorldInfo", "addChildren");

        addMethod("X3D", "head", "setHead");
        addMethod("X3D", "Scene", "setScene");
        addMethod("head", "component", "addComponent");
        addMethod("head", "meta", "addMeta");
        addMethod("head", "unit", "addUnit");
        addMethod("IS", "connect", "addConnect");
        addMethod("ProtoInstance", "fieldValue", "addFieldValue");
        addMethod("ProtoDeclare", "ProtoBody", "setProtoBody");
        addMethod("ProtoDeclare", "ProtoInterface", "setProtoInterface");
        addMethod("SpatialSound", "AudioClip", "addChildren");
        addMethod("SpatialSound", "Gain", "addChildren");
        addMethod("Sound", "AudioClip", "setSource");
    }

    private static void addOverride(String parent, String child, String method) {
        MAP_TO_METHOD_2.computeIfAbsent(parent, k -> new HashMap<>()).put(child, method);
    }

    private static void addMethod(String parent, String child, String method) {
        MAP_TO_METHOD.computeIfAbsent(parent, k -> new HashMap<>()).put(child, method);
    }

    private static void buildCompleteTable() {
        Set<String> keys = new HashSet<>();

        // Priority 1: mapToMethod2
        for (Map.Entry<String, Map<String, String>> pEntry : MAP_TO_METHOD_2.entrySet()) {
            String p = pEntry.getKey();
            for (Map.Entry<String, String> cEntry : pEntry.getValue().entrySet()) {
                String c = cEntry.getKey();
                String m = cEntry.getValue();
                String cf = DEFAULT_CONTAINER_FIELDS.getOrDefault(c, c.toLowerCase());
                String k = p + "::" + c + "::" + cf + "::" + m;
                if (keys.add(k)) {
                    COMPLETE_TABLE.add(new ParentChildEntry(
                        p, c, cf, true, m,
                        m.startsWith("add") ? ParentChildEntry.MethodType.ADD : ParentChildEntry.MethodType.SET,
                        ParentChildEntry.RuleSource.SPECIAL_OVERRIDE,
                        "Priority override rule from mapToMethod2"
                    ));
                }
            }
        }

        // Priority 2: mapToMethod
        for (Map.Entry<String, Map<String, String>> pEntry : MAP_TO_METHOD.entrySet()) {
            String p = pEntry.getKey();
            for (Map.Entry<String, String> cEntry : pEntry.getValue().entrySet()) {
                String c = cEntry.getKey();
                String m = cEntry.getValue();
                String cf = DEFAULT_CONTAINER_FIELDS.getOrDefault(c, c.toLowerCase());
                String k = p + "::" + c + "::" + cf + "::" + m;
                if (keys.add(k)) {
                    COMPLETE_TABLE.add(new ParentChildEntry(
                        p, c, cf, true, m,
                        m.startsWith("add") ? ParentChildEntry.MethodType.ADD : ParentChildEntry.MethodType.SET,
                        ParentChildEntry.RuleSource.MAP_TO_METHOD,
                        "Standard X3D hierarchy mapping from mapToMethod"
                    ));
                }
            }
        }

        // Priority 3: ContainerField overrides
        String[] specialCF = {"joints", "sites", "skin", "viewpoints", "skeleton", "segments", "proxy", "shaders"};
        String[] parents = {"HAnimHumanoid", "HAnimJoint", "Appearance", "Shape", "Collision"};
        for (String p : parents) {
            for (String cf : specialCF) {
                String c = cf.equals("joints") ? "HAnimJoint"
                        : cf.equals("segments") ? "HAnimSegment"
                        : cf.equals("sites") ? "HAnimSite"
                        : cf.equals("viewpoints") ? "Viewpoint"
                        : cf.equals("skeleton") ? "HAnimJoint"
                        : cf.equals("skin") ? "Shape"
                        : cf.equals("proxy") ? "Transform"
                        : "ComposedShader";
                ResolutionResult res = resolve(p, c, cf, 0);
                String k = p + "::" + c + "::" + cf + "::" + res.methodName;
                if (keys.add(k)) {
                    COMPLETE_TABLE.add(new ParentChildEntry(
                        p, c, cf, Objects.equals(DEFAULT_CONTAINER_FIELDS.get(c), cf), res.methodName,
                        res.methodName.startsWith("add") ? ParentChildEntry.MethodType.ADD : ParentChildEntry.MethodType.SET,
                        ParentChildEntry.RuleSource.CONTAINER_FIELD,
                        res.notes
                    ));
                }
            }
        }
    }

    public static class ResolutionResult {
        public final String methodName;
        public final ParentChildEntry.RuleSource ruleSource;
        public final String notes;

        public ResolutionResult(String methodName, ParentChildEntry.RuleSource ruleSource, String notes) {
            this.methodName = methodName;
            this.ruleSource = ruleSource;
            this.notes = notes;
        }
    }

    /**
     * Resolves the method name on a parent node to add or set a child node,
     * considering explicit or defaulted containerField and sibling position.
     *
     * @param parentNode parent X3D element name (e.g. "Appearance", "Transform", "HAnimHumanoid")
     * @param childNode child X3D element name (e.g. "Material", "Shape", "HAnimJoint")
     * @param containerField containerField attribute value (or null if absent)
     * @param childIndex 0 for first child of this type, >0 for subsequent siblings
     * @return resolution result with method name, rule source, and notes
     */
    public static ResolutionResult resolve(String parentNode, String childNode, String containerField, int childIndex) {
        String addpre = (childIndex > 0 && !childNode.equals("IS")) ? "add" : "set";
        if (childNode.equals("field") || childNode.equals("fieldValue")) {
            addpre = "add";
        }

        String method = childNode;
        ParentChildEntry.RuleSource source = ParentChildEntry.RuleSource.DEFAULT_FALLBACK;
        String notes = "";

        // 1. Direct override in mapToMethod2
        Map<String, String> p2 = MAP_TO_METHOD_2.get(parentNode);
        if (p2 != null && p2.containsKey(childNode)) {
            method = p2.get(childNode);
            addpre = "";
            source = ParentChildEntry.RuleSource.SPECIAL_OVERRIDE;
            notes = "Direct override from mapToMethod2";
            return new ResolutionResult(addpre + method, source, notes);
        }

        // 2. Base mapping in mapToMethod
        Map<String, String> p1 = MAP_TO_METHOD.get(parentNode);
        if (p1 != null && p1.containsKey(childNode)) {
            addpre = "";
            method = p1.get(childNode);
            source = ParentChildEntry.RuleSource.MAP_TO_METHOD;
            notes = "Standard lookup in mapToMethod";
        } else {
            method = Character.toUpperCase(method.charAt(0)) + method.substring(1);
        }

        // 3. ContainerField resolution & override
        if (containerField != null && !containerField.trim().isEmpty()) {
            String cf = containerField.trim();
            source = ParentChildEntry.RuleSource.CONTAINER_FIELD;
            if (method.equals("setShaders")) {
                method = "addShaders";
                addpre = "";
                notes = "containerField override for setShaders -> addShaders";
            } else if (cf.equals("joints") || cf.equals("sites") || cf.equals("skin") ||
                    cf.equals("viewpoints") || cf.equals("skeleton") || cf.equals("segments")) {
                method = "add" + Character.toUpperCase(cf.charAt(0)) + cf.substring(1);
                addpre = "";
                notes = "HAnim containerField collection override for " + cf;
            } else if (method.equals("addValue")) {
                notes = "Preserving addValue method";
            } else {
                method = "set" + Character.toUpperCase(cf.charAt(0)) + cf.substring(1);
                addpre = "";
                notes = "containerField " + cf + " mapped to " + method;
            }
        }

        // 4. Special cases and adjustments
        if (childNode.equals("IS")) {
            method = "IS";
            addpre = "set";
        }
        if ((addpre + method).equals("setJoints")) {
            method = "Joints";
            addpre = "add";
        }
        if ((addpre + method).equals("setSegments")) {
            method = "Segments";
            addpre = "add";
        }
        if (parentNode.equals("Scene") && (addpre + method).equals("setMetadata")) {
            method = "Metadata";
            addpre = "add";
        }
        if (childNode.equals("LayerSet") && (addpre + method).equals("addChild")) {
            method = "LayerSet";
            addpre = "add";
        }
        if (parentNode.equals("Transform") && (addpre + method).equals("addSkin")) {
            method = "Child";
            addpre = "add";
        }
        if (parentNode.equals("field") && (addpre + method).equals("addJoints")) {
            method = "Child";
            addpre = "add";
        }

        return new ResolutionResult(addpre + method, source, notes);
    }

    public static List<ParentChildEntry> getCompleteTable() {
        return Collections.unmodifiableList(COMPLETE_TABLE);
    }

    public static String getDefaultContainerField(String childNode) {
        return DEFAULT_CONTAINER_FIELDS.getOrDefault(childNode, "children");
    }
}
