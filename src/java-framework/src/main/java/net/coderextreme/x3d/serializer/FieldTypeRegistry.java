package net.coderextreme.x3d.serializer;

import java.util.*;

/**
 * Registry containing field types for all standard X3D nodes.
 * Ported from fieldTypes.js.
 */
public class FieldTypeRegistry {
    private static final Map<String, Map<String, String>> NODE_FIELD_TYPES = new HashMap<>();

    static {
        // Common base interface attributes
        Map<String, String> commonNode = Map.of(
            "DEF", "SFString",
            "USE", "SFString",
            "class", "SFString",
            "id", "SFString",
            "style", "SFString",
            "IS", "SFNode",
            "metadata", "SFNode"
        );
        NODE_FIELD_TYPES.put("X3DNode", new HashMap<>(commonNode));
        NODE_FIELD_TYPES.put("X3DChildNode", new HashMap<>(commonNode));
        NODE_FIELD_TYPES.put("X3DAppearanceChildNode", new HashMap<>(commonNode));

        // Appearance
        register("Appearance", Map.ofEntries(
            Map.entry("acousticProperties", "SFNode"),
            Map.entry("alphaCutoff", "SFFloat"),
            Map.entry("alphaMode", "SFString"),
            Map.entry("backMaterial", "SFNode"),
            Map.entry("fillProperties", "SFNode"),
            Map.entry("lineProperties", "SFNode"),
            Map.entry("material", "SFNode"),
            Map.entry("pointProperties", "SFNode"),
            Map.entry("shaders", "MFNode"),
            Map.entry("texture", "SFNode"),
            Map.entry("textureTransform", "SFNode"),
            Map.entry("IS", "SFNode"),
            Map.entry("metadata", "SFNode"),
            Map.entry("DEF", "SFString"),
            Map.entry("USE", "SFString"),
            Map.entry("class", "SFString")
        ));

        // Material
        register("Material", Map.ofEntries(
            Map.entry("ambientIntensity", "SFFloat"),
            Map.entry("diffuseColor", "SFColor"),
            Map.entry("emissiveColor", "SFColor"),
            Map.entry("shininess", "SFFloat"),
            Map.entry("specularColor", "SFColor"),
            Map.entry("transparency", "SFFloat"),
            Map.entry("diffuseTexture", "SFNode"),
            Map.entry("emissiveTexture", "SFNode"),
            Map.entry("normalTexture", "SFNode"),
            Map.entry("occlusionTexture", "SFNode"),
            Map.entry("DEF", "SFString"),
            Map.entry("USE", "SFString"),
            Map.entry("class", "SFString"),
            Map.entry("IS", "SFNode"),
            Map.entry("metadata", "SFNode")
        ));

        // PhysicalMaterial
        register("PhysicalMaterial", Map.ofEntries(
            Map.entry("baseColor", "SFColor"),
            Map.entry("emissiveColor", "SFColor"),
            Map.entry("metallic", "SFFloat"),
            Map.entry("roughness", "SFFloat"),
            Map.entry("transparency", "SFFloat"),
            Map.entry("baseTexture", "SFNode"),
            Map.entry("metallicRoughnessTexture", "SFNode"),
            Map.entry("normalTexture", "SFNode"),
            Map.entry("occlusionTexture", "SFNode"),
            Map.entry("DEF", "SFString"),
            Map.entry("USE", "SFString")
        ));

        // Transform
        register("Transform", Map.ofEntries(
            Map.entry("translation", "SFVec3f"),
            Map.entry("rotation", "SFRotation"),
            Map.entry("scale", "SFVec3f"),
            Map.entry("scaleOrientation", "SFRotation"),
            Map.entry("center", "SFVec3f"),
            Map.entry("bboxCenter", "SFVec3f"),
            Map.entry("bboxSize", "SFVec3f"),
            Map.entry("visible", "SFBool"),
            Map.entry("children", "MFNode"),
            Map.entry("addChildren", "MFNode"),
            Map.entry("removeChildren", "MFNode"),
            Map.entry("DEF", "SFString"),
            Map.entry("USE", "SFString"),
            Map.entry("IS", "SFNode")
        ));

        // Shape
        register("Shape", Map.ofEntries(
            Map.entry("appearance", "SFNode"),
            Map.entry("geometry", "SFNode"),
            Map.entry("bboxCenter", "SFVec3f"),
            Map.entry("bboxSize", "SFVec3f"),
            Map.entry("castShadow", "SFBool"),
            Map.entry("visible", "SFBool"),
            Map.entry("DEF", "SFString"),
            Map.entry("USE", "SFString"),
            Map.entry("IS", "SFNode")
        ));

        // Box
        register("Box", Map.of(
            "size", "SFVec3f",
            "solid", "SFBool",
            "DEF", "SFString",
            "USE", "SFString",
            "IS", "SFNode"
        ));

        // Sphere
        register("Sphere", Map.of(
            "radius", "SFFloat",
            "solid", "SFBool",
            "DEF", "SFString",
            "USE", "SFString",
            "IS", "SFNode"
        ));

        // Cone
        register("Cone", Map.of(
            "bottomRadius", "SFFloat",
            "height", "SFFloat",
            "bottom", "SFBool",
            "side", "SFBool",
            "solid", "SFBool",
            "DEF", "SFString",
            "USE", "SFString"
        ));

        // Cylinder
        register("Cylinder", Map.of(
            "radius", "SFFloat",
            "height", "SFFloat",
            "bottom", "SFBool",
            "side", "SFBool",
            "top", "SFBool",
            "solid", "SFBool",
            "DEF", "SFString",
            "USE", "SFString"
        ));

        // Coordinate
        register("Coordinate", Map.of(
            "point", "MFVec3f",
            "DEF", "SFString",
            "USE", "SFString",
            "IS", "SFNode"
        ));

        // CoordinateDouble
        register("CoordinateDouble", Map.of(
            "point", "MFVec3d",
            "DEF", "SFString",
            "USE", "SFString",
            "IS", "SFNode"
        ));

        // Normal
        register("Normal", Map.of(
            "vector", "MFVec3f",
            "DEF", "SFString",
            "USE", "SFString",
            "IS", "SFNode"
        ));

        // Color
        register("Color", Map.of(
            "color", "MFColor",
            "DEF", "SFString",
            "USE", "SFString",
            "IS", "SFNode"
        ));

        // ColorRGBA
        register("ColorRGBA", Map.of(
            "color", "MFColorRGBA",
            "DEF", "SFString",
            "USE", "SFString",
            "IS", "SFNode"
        ));

        // TextureCoordinate
        register("TextureCoordinate", Map.of(
            "point", "MFVec2f",
            "mapping", "SFString",
            "DEF", "SFString",
            "USE", "SFString"
        ));

        // IndexedFaceSet
        register("IndexedFaceSet", Map.ofEntries(
            Map.entry("coordIndex", "MFInt32"),
            Map.entry("normalIndex", "MFInt32"),
            Map.entry("colorIndex", "MFInt32"),
            Map.entry("texCoordIndex", "MFInt32"),
            Map.entry("ccw", "SFBool"),
            Map.entry("solid", "SFBool"),
            Map.entry("convex", "SFBool"),
            Map.entry("creaseAngle", "SFFloat"),
            Map.entry("colorPerVertex", "SFBool"),
            Map.entry("normalPerVertex", "SFBool"),
            Map.entry("coord", "SFNode"),
            Map.entry("normal", "SFNode"),
            Map.entry("color", "SFNode"),
            Map.entry("texCoord", "SFNode"),
            Map.entry("fogCoord", "SFNode"),
            Map.entry("attrib", "MFNode"),
            Map.entry("DEF", "SFString"),
            Map.entry("USE", "SFString")
        ));

        // TimeSensor
        register("TimeSensor", Map.ofEntries(
            Map.entry("cycleInterval", "SFTime"),
            Map.entry("cycleTime", "SFTime"),
            Map.entry("enabled", "SFBool"),
            Map.entry("loop", "SFBool"),
            Map.entry("startTime", "SFTime"),
            Map.entry("stopTime", "SFTime"),
            Map.entry("pauseTime", "SFTime"),
            Map.entry("resumeTime", "SFTime"),
            Map.entry("fraction_changed", "SFFloat"),
            Map.entry("time", "SFTime"),
            Map.entry("isActive", "SFBool"),
            Map.entry("isPaused", "SFBool"),
            Map.entry("description", "SFString"),
            Map.entry("DEF", "SFString"),
            Map.entry("USE", "SFString")
        ));

        // PositionInterpolator
        register("PositionInterpolator", Map.of(
            "key", "MFFloat",
            "keyValue", "MFVec3f",
            "set_fraction", "SFFloat",
            "value_changed", "SFVec3f",
            "DEF", "SFString",
            "USE", "SFString"
        ));

        // OrientationInterpolator
        register("OrientationInterpolator", Map.of(
            "key", "MFFloat",
            "keyValue", "MFRotation",
            "set_fraction", "SFFloat",
            "value_changed", "SFRotation",
            "DEF", "SFString",
            "USE", "SFString"
        ));

        // HAnimHumanoid
        register("HAnimHumanoid", Map.ofEntries(
            Map.entry("name", "SFString"),
            Map.entry("version", "SFString"),
            Map.entry("loa", "SFInt32"),
            Map.entry("skeletalConfiguration", "SFString"),
            Map.entry("center", "SFVec3f"),
            Map.entry("translation", "SFVec3f"),
            Map.entry("rotation", "SFRotation"),
            Map.entry("scale", "SFVec3f"),
            Map.entry("scaleOrientation", "SFRotation"),
            Map.entry("info", "MFString"),
            Map.entry("joints", "MFNode"),
            Map.entry("segments", "MFNode"),
            Map.entry("sites", "MFNode"),
            Map.entry("skeleton", "MFNode"),
            Map.entry("skin", "MFNode"),
            Map.entry("skinCoord", "SFNode"),
            Map.entry("skinNormal", "SFNode"),
            Map.entry("viewpoints", "MFNode"),
            Map.entry("motions", "MFNode"),
            Map.entry("DEF", "SFString"),
            Map.entry("USE", "SFString")
        ));

        // HAnimJoint
        register("HAnimJoint", Map.ofEntries(
            Map.entry("name", "SFString"),
            Map.entry("center", "SFVec3f"),
            Map.entry("translation", "SFVec3f"),
            Map.entry("rotation", "SFRotation"),
            Map.entry("scale", "SFVec3f"),
            Map.entry("scaleOrientation", "SFRotation"),
            Map.entry("stiffness", "MFFloat"),
            Map.entry("ulimit", "MFFloat"),
            Map.entry("llimit", "MFFloat"),
            Map.entry("skinCoordIndex", "MFInt32"),
            Map.entry("skinCoordWeight", "MFFloat"),
            Map.entry("displacers", "MFNode"),
            Map.entry("children", "MFNode"),
            Map.entry("DEF", "SFString"),
            Map.entry("USE", "SFString")
        ));

        // HAnimSegment
        register("HAnimSegment", Map.of(
            "name", "SFString",
            "mass", "SFFloat",
            "centerOfMass", "SFVec3f",
            "momentsOfInertia", "MFFloat",
            "coord", "SFNode",
            "displacers", "MFNode",
            "children", "MFNode",
            "DEF", "SFString",
            "USE", "SFString"
        ));

        // HAnimSite
        register("HAnimSite", Map.of(
            "name", "SFString",
            "center", "SFVec3f",
            "translation", "SFVec3f",
            "rotation", "SFRotation",
            "scale", "SFVec3f",
            "children", "MFNode",
            "DEF", "SFString",
            "USE", "SFString"
        ));

        // SpatialSound
        register("SpatialSound", Map.ofEntries(
            Map.entry("location", "SFVec3f"),
            Map.entry("direction", "SFVec3f"),
            Map.entry("intensity", "SFFloat"),
            Map.entry("gain", "SFFloat"),
            Map.entry("spatialize", "SFBool"),
            Map.entry("enableHRTF", "SFBool"),
            Map.entry("dopplerEnabled", "SFBool"),
            Map.entry("distanceModel", "SFString"),
            Map.entry("maxDistance", "SFFloat"),
            Map.entry("referenceDistance", "SFFloat"),
            Map.entry("rolloffFactor", "SFFloat"),
            Map.entry("children", "MFNode"),
            Map.entry("DEF", "SFString"),
            Map.entry("USE", "SFString")
        ));

        // Viewpoint
        register("Viewpoint", Map.ofEntries(
            Map.entry("position", "SFVec3f"),
            Map.entry("orientation", "SFRotation"),
            Map.entry("centerOfRotation", "SFVec3f"),
            Map.entry("fieldOfView", "SFFloat"),
            Map.entry("description", "SFString"),
            Map.entry("jump", "SFBool"),
            Map.entry("retainUserOffsets", "SFBool"),
            Map.entry("viewAll", "SFBool"),
            Map.entry("DEF", "SFString"),
            Map.entry("USE", "SFString")
        ));

        // WorldInfo
        register("WorldInfo", Map.of(
            "title", "SFString",
            "info", "MFString",
            "DEF", "SFString",
            "USE", "SFString"
        ));

        // ROUTE
        register("ROUTE", Map.of(
            "fromNode", "SFString",
            "fromField", "SFString",
            "toNode", "SFString",
            "toField", "SFString"
        ));

        // field
        register("field", Map.of(
            "name", "SFString",
            "type", "SFString",
            "accessType", "SFString",
            "value", "SFString",
            "appinfo", "SFString",
            "documentation", "SFString"
        ));

        // fieldValue
        register("fieldValue", Map.of(
            "name", "SFString",
            "value", "SFString"
        ));
    }

    private static void register(String nodeName, Map<String, String> fields) {
        Map<String, String> existing = NODE_FIELD_TYPES.computeIfAbsent(nodeName, k -> new HashMap<>());
        existing.putAll(fields);
    }

    /**
     * Look up the X3D field type for a given node and attribute name.
     * Defaults to SFString if unspecified.
     */
    public static String getFieldType(String nodeName, String attributeName) {
        if (nodeName == null || attributeName == null) return "SFString";
        Map<String, String> nodeMap = NODE_FIELD_TYPES.get(nodeName);
        if (nodeMap != null) {
            String type = nodeMap.get(attributeName);
            if (type != null) return type;
        }
        // Fallback to general X3DNode attributes
        Map<String, String> baseMap = NODE_FIELD_TYPES.get("X3DNode");
        if (baseMap != null && baseMap.containsKey(attributeName)) {
            return baseMap.get(attributeName);
        }
        return "SFString";
    }

    public static Map<String, Map<String, String>> getAllFieldTypes() {
        return Collections.unmodifiableMap(NODE_FIELD_TYPES);
    }
}
