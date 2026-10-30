package net.coderextreme.x3d.serializer;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.NamedNodeMap;

import java.util.ArrayList;
import java.util.List;

/**
 * Java Serializer emitting X3DJSAIL-compliant Java source code.
 * Ported from JavaSerializer.js with automatic method chunking to prevent
 * JVM 64KB method bytecode overflow ("error: code too large").
 */
public class JavaSerializer implements LanguageSerializer {

    private static final String DOUBLE_SUFFIX = "d";
    private static final String FLOAT_SUFFIX = "f ";

    private final List<String> arrayClasses = new ArrayList<>();
    private final List<String> helperMethods = new ArrayList<>();
    private final List<String> precode = new ArrayList<>();
    private final List<String> postcode = new ArrayList<>();
    private int codeno = 0;
    private int methodno = 0;
    private int preno = 0;

    @Override
    public TargetLanguage getTargetLanguage() {
        return TargetLanguage.JAVA;
    }

    @Override
    public String serialize(Element element, SerializerOptions options) {
        arrayClasses.clear();
        helperMethods.clear();
        precode.clear();
        postcode.clear();
        codeno = 0;
        methodno = 0;
        preno = 0;

        String clazz = options.getClassName() != null ? options.getClassName() : "Model";
        String pkg = options.getPackageName() != null ? options.getPackageName() : "net.coderextreme.data";

        StringBuilder sb = new StringBuilder();
        sb.append("package ").append(pkg).append(";\n\n");
        sb.append("import org.web3d.x3d.jsail.*;\n");
        sb.append("import org.web3d.x3d.jsail.CADGeometry.*;\n");
        sb.append("import org.web3d.x3d.jsail.Core.*;\n");
        sb.append("import org.web3d.x3d.jsail.CubeMapTexturing.*;\n");
        sb.append("import org.web3d.x3d.jsail.DIS.*;\n");
        sb.append("import org.web3d.x3d.jsail.EnvironmentalEffects.*;\n");
        sb.append("import org.web3d.x3d.jsail.EnvironmentalSensor.*;\n");
        sb.append("import org.web3d.x3d.jsail.EventUtilities.*;\n");
        sb.append("import org.web3d.x3d.jsail.Followers.*;\n");
        sb.append("import org.web3d.x3d.jsail.Geometry2D.*;\n");
        sb.append("import org.web3d.x3d.jsail.Geometry3D.*;\n");
        sb.append("import org.web3d.x3d.jsail.Geospatial.*;\n");
        sb.append("import org.web3d.x3d.jsail.Grouping.*;\n");
        sb.append("import org.web3d.x3d.jsail.HAnim.*;\n");
        sb.append("import org.web3d.x3d.jsail.Interpolation.OrientationInterpolator;\n");
        sb.append("import org.web3d.x3d.jsail.Interpolation.*;\n");
        sb.append("import org.web3d.x3d.jsail.KeyDeviceSensor.*;\n");
        sb.append("import org.web3d.x3d.jsail.Layering.*;\n");
        sb.append("import org.web3d.x3d.jsail.Layout.*;\n");
        sb.append("import org.web3d.x3d.jsail.Lighting.*;\n");
        sb.append("import org.web3d.x3d.jsail.NURBS.*;\n");
        sb.append("import org.web3d.x3d.jsail.Navigation.*;\n");
        sb.append("import org.web3d.x3d.jsail.Networking.*;\n");
        sb.append("import org.web3d.x3d.jsail.ParticleSystems.*;\n");
        sb.append("import org.web3d.x3d.jsail.Picking.*;\n");
        sb.append("import org.web3d.x3d.jsail.PointingDeviceSensor.*;\n");
        sb.append("import org.web3d.x3d.jsail.Rendering.*;\n");
        sb.append("import org.web3d.x3d.jsail.RigidBodyPhysics.*;\n");
        sb.append("import org.web3d.x3d.jsail.Scripting.*;\n");
        sb.append("import org.web3d.x3d.jsail.Shaders.*;\n");
        sb.append("import org.web3d.x3d.jsail.Shape.*;\n");
        sb.append("import org.web3d.x3d.jsail.Sound.*;\n");
        sb.append("import org.web3d.x3d.jsail.Text.*;\n");
        sb.append("import org.web3d.x3d.jsail.Texturing3D.*;\n");
        sb.append("import org.web3d.x3d.jsail.Texturing.*;\n");
        sb.append("import org.web3d.x3d.jsail.Time.*;\n");
        sb.append("import org.web3d.x3d.jsail.VolumeRendering.*;\n");
        sb.append("import org.web3d.x3d.jsail.fields.*;\n");
        sb.append("import java.util.ArrayList;\n");
        sb.append("import java.util.List;\n\n");
        sb.append("public class ").append(clazz).append(" {\n");
        sb.append("  public static void main(String[] args) {\n");
        if (options.isNativeXsltEngine()) {
            sb.append("    ConfigurationProperties.setXsltEngine(ConfigurationProperties.XSLT_ENGINE_NATIVE_JAVA);\n");
        }
        sb.append("    ConfigurationProperties.setDeleteIntermediateFiles(false);\n");
        sb.append("    ConfigurationProperties.setStripTrailingZeroes(").append(options.isStripTrailingZeroes()).append(");\n");
        sb.append("    ConfigurationProperties.setStripDefaultAttributes(").append(options.isStripDefaultAttributes()).append(");\n");
        sb.append("    ").append(element.getNodeName()).append(" model = new ").append(clazz).append("().initialize();\n");
        sb.append("    System.out.print(model.validationReport().trim());\n");
        sb.append("    model.toFileX3D(\"").append(clazz).append(".new.java.x3d\");\n");
        sb.append("    model.toFileJSON(\"").append(clazz).append(".new.java.x3dj\");\n");
        sb.append("  }\n\n");

        List<Integer> stack = new ArrayList<>();
        String body = "      " + element.getNodeName() + " " + element.getNodeName() + "0 = new " + element.getNodeName() + "()"
                + subSerializeToString(element, options, 3, stack);

        if (options.isBreakUpMethods()) {
            for (String p : precode) {
                sb.append("  private ").append(p);
            }
        }

        sb.append("  public ").append(element.getNodeName()).append(" initialize() {\n");
        if (!options.isBreakUpMethods()) {
            for (String p : precode) {
                sb.append("    ").append(p);
            }
        }
        sb.append(body).append(";\n");
        for (String post : postcode) {
            sb.append("    ").append(post);
        }
        sb.append("    return ").append(element.getNodeName()).append("0;\n");
        sb.append("  }\n\n");

        for (String m : helperMethods) {
            sb.append(m).append("\n");
        }

        for (String ac : arrayClasses) {
            sb.append(ac).append("\n");
        }

        sb.append("}\n");
        return sb.toString();
    }

    private String subSerializeToString(Element element, SerializerOptions options, int n, List<Integer> stack) {
        AttrResult attrRes = getAttributesString(element, options);
        StringBuilder sb = new StringBuilder(attrRes.str);

        NodeList children = element.getChildNodes();
        if (options.isBreakUpMethods()) {
            for (int cn = 0; cn < children.getLength(); cn++) {
                Node node = children.item(cn);
                if (node.getNodeType() == Node.ELEMENT_NODE) {
                    Element chElem = (Element) node;
                    String chCall = printParentChild(element, chElem, cn, n);
                    String methodName = createNodeMethod(element, chElem, cn, attrRes.DEF, attrRes.USE, stack, options);
                    sb.append(chCall).append("(").append(methodName).append("())");
                } else if (node.getNodeType() == Node.COMMENT_NODE) {
                    String y = escapeString(node.getNodeValue());
                    sb.append("\n").append("  ".repeat(n)).append(".addComments(new CommentsBlock(\"").append(y).append("\"))");
                } else if (node.getNodeType() == Node.CDATA_SECTION_NODE) {
                    String y = escapeString(node.getNodeValue());
                    sb.append("\n").append("  ".repeat(n)).append(".setSourceCode(\"").append(y).append("\")");
                }
            }
            return sb.toString();
        }

        // Monolithic mode
        for (int cn = 0; cn < children.getLength(); cn++) {
            Node node = children.item(cn);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element chElem = (Element) node;
                if (chElem.getNodeName().equals("ProtoInstance")) {
                    stack.add(0, preno++);
                    precode.add(chElem.getNodeName() + " " + chElem.getNodeName() + stack.get(0) + " = null;\n");
                }
                String ch = printParentChild(element, chElem, cn, n) + "(";
                if (chElem.getNodeName().equals("ProtoInstance")) {
                    ch += chElem.getNodeName() + stack.get(0) + " = ";
                }
                String DEFpar = "";
                if (chElem.getNodeName().startsWith("HAnim") && attrRes.USE == null && attrRes.DEF != null) {
                    DEFpar = "\"" + attrRes.DEF + "\"";
                }
                ch += "new " + chElem.getNodeName() + "(" + DEFpar + ")";
                ch += subSerializeToString(chElem, options, n + 1, stack);
                ch += ")";

                if (element.getNodeName().equals("ProtoInstance") && chElem.getNodeName().equals("fieldValue")) {
                    postcode.add(ch + ";\n");
                } else {
                    sb.append(ch);
                }
                if (chElem.getNodeName().equals("ProtoInstance")) {
                    stack.remove(0);
                }
            } else if (node.getNodeType() == Node.COMMENT_NODE) {
                String y = escapeString(node.getNodeValue());
                sb.append("\n").append("  ".repeat(n)).append(".addComments(new CommentsBlock(\"").append(y).append("\"))");
            } else if (node.getNodeType() == Node.CDATA_SECTION_NODE) {
                String y = escapeString(node.getNodeValue());
                sb.append("\n").append("  ".repeat(n)).append(".setSourceCode(\"").append(y).append("\")");
            }
        }

        return sb.toString();
    }

    private String createNodeMethod(Element parent, Element node, int cn, String parentDEF, String parentUSE,
                                    List<Integer> stack, SerializerOptions options) {
        methodno++;
        int methodId = methodno;
        String methodName = "get" + node.getNodeName() + "_" + methodId;

        String DEFpar = "";
        if (node.getNodeName().startsWith("HAnim") && parentUSE == null && parentDEF != null) {
            DEFpar = "\"" + parentDEF + "\"";
        }

        AttrResult attrRes = getAttributesString(node, options);

        List<Element> childElements = new ArrayList<>();
        NodeList nl = node.getChildNodes();
        for (int i = 0; i < nl.getLength(); i++) {
            if (nl.item(i).getNodeType() == Node.ELEMENT_NODE) {
                childElements.add((Element) nl.item(i));
            }
        }

        int maxChildren = options.getMaxChildrenPerMethod();
        String assign = node.getNodeName().equals("ProtoInstance") ? (node.getNodeName() + stack.get(0) + " = ") : "";

        if (childElements.size() > maxChildren) {
            List<String> chunkAdders = new ArrayList<>();
            for (int cStart = 0; cStart < childElements.size(); cStart += maxChildren) {
                int cEnd = Math.min(cStart + maxChildren, childElements.size());
                methodno++;
                String adderName = "add" + node.getNodeName() + "Children_" + methodno;
                StringBuilder adderCode = new StringBuilder("  private void " + adderName + "(" + node.getNodeName() + " parent) {\n    parent");

                for (int i = cStart; i < cEnd; i++) {
                    Element chNode = childElements.get(i);
                    if (chNode.getNodeName().equals("ProtoInstance")) {
                        stack.add(0, preno++);
                        precode.add(chNode.getNodeName() + " " + chNode.getNodeName() + stack.get(0) + " = null;\n");
                    }
                    String chCall = printParentChild(node, chNode, i, 3);
                    String chMethod = createNodeMethod(node, chNode, i, attrRes.DEF, attrRes.USE, stack, options);
                    adderCode.append(chCall).append("(").append(chMethod).append("())");
                    if (chNode.getNodeName().equals("ProtoInstance")) {
                        stack.remove(0);
                    }
                }
                adderCode.append(";\n  }\n");
                helperMethods.add(adderCode.toString());
                chunkAdders.add(adderName);
            }

            StringBuilder methodDef = new StringBuilder();
            methodDef.append("  public ").append(node.getNodeName()).append(" ").append(methodName).append("() {\n");
            methodDef.append("    ").append(node.getNodeName()).append(" node = ").append(assign)
                    .append("new ").append(node.getNodeName()).append("(").append(DEFpar).append(")").append(attrRes.str).append(";\n");
            for (String a : chunkAdders) {
                methodDef.append("    ").append(a).append("(node);\n");
            }
            methodDef.append("    return node;\n  }\n");
            helperMethods.add(methodDef.toString());
        } else {
            StringBuilder methodDef = new StringBuilder();
            methodDef.append("  public ").append(node.getNodeName()).append(" ").append(methodName).append("() {\n");
            methodDef.append("    return ").append(assign).append("new ").append(node.getNodeName())
                    .append("(").append(DEFpar).append(")").append(attrRes.str);

            for (int i = 0; i < childElements.size(); i++) {
                Element chNode = childElements.get(i);
                if (chNode.getNodeName().equals("ProtoInstance")) {
                    stack.add(0, preno++);
                    precode.add(chNode.getNodeName() + " " + chNode.getNodeName() + stack.get(0) + " = null;\n");
                }
                String chCall = printParentChild(node, chNode, i, 3);
                if (node.getNodeName().equals("ProtoInstance") && chNode.getNodeName().equals("fieldValue")) {
                    AttrResult fvRes = getAttributesString(chNode, options);
                    String fvVal = "(new " + chNode.getNodeName() + "()" + fvRes.str + ")";
                    postcode.add(node.getNodeName() + stack.get(0) + chCall + fvVal + ";\n");
                } else {
                    String chMethod = createNodeMethod(node, chNode, i, attrRes.DEF, attrRes.USE, stack, options);
                    chCall += "(" + chMethod + "())";
                    methodDef.append(chCall);
                }
                if (chNode.getNodeName().equals("ProtoInstance")) {
                    stack.remove(0);
                }
            }

            for (int k = 0; k < nl.getLength(); k++) {
                Node chNode = nl.item(k);
                if (chNode.getNodeType() == Node.COMMENT_NODE) {
                    methodDef.append("\n      .addComments(new CommentsBlock(\"").append(escapeString(chNode.getNodeValue())).append("\"))");
                } else if (chNode.getNodeType() == Node.CDATA_SECTION_NODE) {
                    methodDef.append("\n      .setSourceCode(\"").append(escapeString(chNode.getNodeValue())).append("\")");
                }
            }

            methodDef.append(";\n  }\n");
            helperMethods.add(methodDef.toString());
        }

        return methodName;
    }

    private String printParentChild(Element parent, Element child, int cn, int n) {
        String cf = child.hasAttribute("containerField") ? child.getAttribute("containerField") : null;
        ParentChildMappingTable.ResolutionResult res = ParentChildMappingTable.resolve(parent.getNodeName(), child.getNodeName(), cf, cn);
        return "\n" + "  ".repeat(n) + "." + res.methodName;
    }

    private static class AttrResult {
        final String str;
        final String DEF;
        final String USE;
        AttrResult(String str, String DEF, String USE) {
            this.str = str;
            this.DEF = DEF;
            this.USE = USE;
        }
    }

    private AttrResult getAttributesString(Element element, SerializerOptions options) {
        StringBuilder sb = new StringBuilder();
        String DEF = null;
        String USE = null;
        String fieldAttrType = element.hasAttribute("type") ? element.getAttribute("type") : "";

        NamedNodeMap attrs = element.getAttributes();
        if (attrs == null) return new AttrResult("", null, null);

        if (!fieldAttrType.isEmpty()) {
            String val = fieldAttrType;
            String strval = val.equals("VERTEX") || val.equals("FRAGMENT") ? ("\"" + val + "\"") : ("\"" + val + "\"");
            sb.append(".setType(").append(strval).append(")");
        }

        for (int i = 0; i < attrs.getLength(); i++) {
            Node attr = attrs.item(i);
            String name = attr.getNodeName();
            String val = attr.getNodeValue();

            if (name.equals("xmlns:xsd") || name.equals("xsd:noNamespaceSchemaLocation")
                    || name.equals("containerField") || name.equals("type") || name.equals("id")) {
                continue;
            }
            if (element.getNodeName().equals("Sphere") && name.equals("subdivision")) continue;
            if (name.equals("DEF")) DEF = val;
            if (name.equals("USE")) USE = val;

            String attrType = FieldTypeRegistry.getFieldType(element.getNodeName(), name);
            String method;
            if (val.equals("NULL") && (fieldAttrType.equals("SFNode") || fieldAttrType.equals("MFNode"))) {
                method = "clearChildren";
            } else {
                method = "set" + Character.toUpperCase(name.charAt(0)) + name.substring(1);
            }

            String strval;
            if (val.equals("NULL")) {
                strval = "";
            } else if (name.equals("readInterval")) {
                strval = "new SFTime(" + val + DOUBLE_SUFFIX + ")";
            } else if (attrType.equals("SFString")) {
                if (name.equals("accessType")) {
                    strval = "field.ACCESSTYPE_" + val.toUpperCase();
                } else {
                    strval = "new SFString(\"" + escapeString(val) + "\")";
                }
            } else if (attrType.equals("SFInt32") || attrType.equals("SFBool")) {
                strval = val;
            } else if (attrType.equals("SFFloat")) {
                strval = val + FLOAT_SUFFIX;
            } else if (attrType.equals("SFDouble") || attrType.equals("SFTime")) {
                strval = val + DOUBLE_SUFFIX;
            } else if (attrType.equals("MFTime")) {
                strval = printSubArray(attrType, "double", val.split("[ ,]+"), DOUBLE_SUFFIX + ",", "", DOUBLE_SUFFIX, options);
            } else if (attrType.equals("MFString")) {
                String trimmed = val.trim();
                if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
                    trimmed = trimmed.substring(1, trimmed.length() - 1);
                }
                String[] items = trimmed.split("\"[ ,]+\"");
                strval = printSubArray(attrType, "java.lang.String", items, "\",\"", "\"", "\"", options);
            } else if (attrType.equals("MFInt32") || attrType.equals("MFImage") || attrType.equals("SFImage")) {
                strval = printSubArray(attrType, "int", val.split("[ ,]+"), ",", "", "", options);
            } else if (attrType.startsWith("MFVec") || attrType.startsWith("SFVec")
                    || attrType.startsWith("MFColor") || attrType.startsWith("SFColor")
                    || attrType.startsWith("MFRotation") || attrType.startsWith("SFRotation")
                    || attrType.startsWith("MFFloat")) {
                String suffix = attrType.contains("d") ? (DOUBLE_SUFFIX + ",") : (FLOAT_SUFFIX + ",");
                String primitive = attrType.contains("d") ? "double" : "float";
                strval = printSubArray(attrType, primitive, val.split("[ ,]+"), suffix, "", suffix.replace(",", ""), options);
            } else if (attrType.equals("MFBool")) {
                strval = printSubArray(attrType, "boolean", val.split("[ ,]+"), ",", "", "", options);
            } else {
                strval = "\"" + escapeString(val) + "\"";
            }

            if (name.equals("class")) method = "setCssClass";
            if (name.equals("style") && !element.getNodeName().equals("FontStyle")) method = "setCssStyle";

            sb.append(".").append(method).append("(").append(strval).append(")");
        }

        return new AttrResult(sb.toString(), DEF, USE);
    }

    private String printSubArray(String attrType, String type, String[] values, String j, String lead, String trail, SerializerOptions options) {
        if (attrType.startsWith("MF")) {
            List<String> chunkRefs = new ArrayList<>();
            for (int i = 0; i < values.length; i += 840) {
                int max = Math.min(i + 840, values.length);
                int curId = codeno++;
                String chunkClassName = attrType + curId;
                StringBuilder chunkCode = new StringBuilder();
                chunkCode.append("  private class ").append(chunkClassName).append(" {\n");
                chunkCode.append("    private org.web3d.x3d.jsail.fields.").append(attrType).append(" getArray() {\n");
                chunkCode.append("      return new org.web3d.x3d.jsail.fields.").append(attrType)
                        .append("(new ").append(type).append("[] {").append(lead);
                for (int k = i; k < max; k++) {
                    chunkCode.append(values[k]);
                    if (k < max - 1) chunkCode.append(j);
                }
                chunkCode.append(trail).append("});\n    }\n  }\n");
                arrayClasses.add(chunkCode.toString());
                chunkRefs.add("new " + chunkClassName + "().getArray()");
            }

            int maxChunks = options.getMaxArrayChunksPerMethod();
            if (chunkRefs.size() <= maxChunks || !options.isBreakUpMethods()) {
                StringBuilder acc = new StringBuilder();
                for (int k = 0; k < chunkRefs.size(); k++) {
                    if (k == 0) acc.append(chunkRefs.get(k));
                    else acc.append(".append(").append(chunkRefs.get(k)).append(")");
                }
                return acc.toString();
            } else {
                List<String> groupRefs = new ArrayList<>();
                for (int g = 0; g < chunkRefs.size(); g += maxChunks) {
                    int gEnd = Math.min(g + maxChunks, chunkRefs.size());
                    int groupId = codeno++;
                    String groupName = attrType + "Group" + groupId;
                    StringBuilder groupCode = new StringBuilder();
                    groupCode.append("  private class ").append(groupName).append(" {\n");
                    groupCode.append("    private org.web3d.x3d.jsail.fields.").append(attrType).append(" getArray() {\n");
                    groupCode.append("      return ").append(chunkRefs.get(g));
                    for (int k = g + 1; k < gEnd; k++) {
                        groupCode.append("\n        .append(").append(chunkRefs.get(k)).append(")");
                    }
                    groupCode.append(";\n    }\n  }\n");
                    arrayClasses.add(groupCode.toString());
                    groupRefs.add("new " + groupName + "().getArray()");
                }
                StringBuilder acc = new StringBuilder();
                for (int k = 0; k < groupRefs.size(); k++) {
                    if (k == 0) acc.append(groupRefs.get(k));
                    else acc.append(".append(").append(groupRefs.get(k)).append(")");
                }
                return acc.toString();
            }
        } else {
            StringBuilder acc = new StringBuilder("new " + type + "[] {" + lead);
            for (int k = 0; k < values.length; k++) {
                acc.append(values[k]);
                if (k < values.length - 1) acc.append(j);
            }
            acc.append(trail).append("}");
            return acc.toString();
        }
    }

    private String escapeString(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
    }
}
