package net.coderextreme.x3d.serializer;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.NamedNodeMap;

import java.util.ArrayList;
import java.util.List;

/**
 * JavaScript Serializer targeting GraalVM JavaScript (GraalJS).
 * Uses Java.type and Java.to for seamless interoperation with X3DJSAIL on the JVM host.
 */
public class GraalJsSerializer implements LanguageSerializer {

    private final List<String> precode = new ArrayList<>();
    private final List<String> postcode = new ArrayList<>();
    private int preno = 0;

    @Override
    public TargetLanguage getTargetLanguage() {
        return TargetLanguage.GRAAL_JS;
    }

    @Override
    public String serialize(Element element, SerializerOptions options) {
        precode.clear();
        postcode.clear();
        preno = 0;

        String clazz = options.getClassName() != null ? options.getClassName() : "Model";
        StringBuilder sb = new StringBuilder();
        sb.append("\"use strict\";\n\n");
        sb.append("// GraalJS polyglot execution with X3DJSAIL host Java interop\n");
        sb.append("load('X3Dautoclass.js');\n");
        sb.append("var ConfigurationProperties = Packages.org.web3d.x3d.jsail.ConfigurationProperties;\n");
        sb.append("ConfigurationProperties.setXsltEngine(ConfigurationProperties.XSLT_ENGINE_NATIVE_JAVA);\n");
        sb.append("ConfigurationProperties.setDeleteIntermediateFiles(false);\n");
        sb.append("ConfigurationProperties.setStripTrailingZeroes(").append(options.isStripTrailingZeroes()).append(");\n");
        sb.append("ConfigurationProperties.setStripDefaultAttributes(").append(options.isStripDefaultAttributes()).append(");\n\n");
        sb.append("function doubleToFloat(d) {\n");
        sb.append("    if (typeof Float32Array !== 'undefined') {\n");
        sb.append("        return new Float32Array(d);\n");
        sb.append("    }\n");
        sb.append("    return d;\n");
        sb.append("}\n\n");

        List<Integer> stack = new ArrayList<>();
        String body = "var " + element.getNodeName() + "0 = new " + element.getNodeName() + "()"
                + subSerializeToString(element, 3, stack);

        for (String p : precode) {
            sb.append(p);
        }
        sb.append("      ").append(body).append(";\n");

        for (String post : postcode) {
            sb.append("      ").append(post);
        }

        sb.append("\n// Export scene to files\n");
        sb.append(element.getNodeName()).append("0.toFileX3D(\"").append(clazz).append(".new.graaljs.x3d\");\n");
        sb.append(element.getNodeName()).append("0.toFileJSON(\"").append(clazz).append(".new.graaljs.x3dj\");\n");

        return sb.toString();
    }

    private String subSerializeToString(Element element, int n, List<Integer> stack) {
        StringBuilder sb = new StringBuilder();
        NamedNodeMap attrs = element.getAttributes();
        String fieldAttrType = element.hasAttribute("type") ? element.getAttribute("type") : "";

        if (attrs != null) {
            for (int i = 0; i < attrs.getLength(); i++) {
                Node attr = attrs.item(i);
                String name = attr.getNodeName();
                String val = attr.getNodeValue();

                if (name.equals("xmlns:xsd") || name.equals("xsd:noNamespaceSchemaLocation")
                        || name.equals("containerField") || name.equals("id")) {
                    continue;
                }
                if (name.equals("type")) {
                    String strval;
                    if (val.equals("ALLPASS")) {
                        strval = "BiquadFilter.TYPE_ALLPASS";
                    } else if (!val.equals("VERTEX") && !val.equals("FRAGMENT")) {
                        strval = "field.TYPE_" + val.toUpperCase();
                    } else {
                        strval = "\"" + escapeString(val) + "\"";
                    }
                    sb.append(".setType(").append(strval).append(")");
                    continue;
                }

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
                } else if (attrType.equals("SFString")) {
                    if (name.equals("accessType")) {
                        strval = "field.ACCESSTYPE_" + val.toUpperCase();
                    } else {
                        strval = "\"" + escapeString(val) + "\"";
                    }
                } else if (attrType.equals("SFInt32") || attrType.equals("SFBool")
                        || attrType.equals("SFFloat") || attrType.equals("SFDouble") || attrType.equals("SFTime")) {
                    strval = val;
                } else if (attrType.equals("MFTime") || attrType.equals("MFDouble")) {
                    strval = printSubArray("double", val.split("[ ,]+"));
                } else if (attrType.equals("MFString")) {
                    String trimmed = val.trim();
                    if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
                        trimmed = trimmed.substring(1, trimmed.length() - 1);
                    }
                    strval = printSubArray("java.lang.String", trimmed.split("\"[ ,]+\""));
                } else if (attrType.equals("MFInt32") || attrType.equals("MFImage") || attrType.equals("SFImage")) {
                    strval = printSubArray("int", val.split("[ ,]+"));
                } else if (attrType.startsWith("MFVec") || attrType.startsWith("SFVec")
                        || attrType.startsWith("MFColor") || attrType.startsWith("SFColor")
                        || attrType.startsWith("MFRotation") || attrType.startsWith("SFRotation")
                        || attrType.startsWith("MFFloat")) {
                    strval = printSubArray("float", val.split("[ ,]+"));
                } else if (attrType.equals("MFBool")) {
                    strval = printSubArray("boolean", val.split("[ ,]+"));
                } else {
                    strval = "\"" + escapeString(val) + "\"";
                }

                if (name.equals("class")) method = "setCssClass";
                if (name.equals("style") && !element.getNodeName().equals("FontStyle")) method = "setCssStyle";

                sb.append(".").append(method).append("(").append(strval).append(")");
            }
        }

        NodeList nl = element.getChildNodes();
        for (int cn = 0; cn < nl.getLength(); cn++) {
            Node node = nl.item(cn);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element chElem = (Element) node;
                if (chElem.getNodeName().equals("ProtoInstance")) {
                    stack.add(0, preno++);
                    precode.add("var " + chElem.getNodeName() + stack.get(0) + " = null;\n");
                }
                String cf = chElem.hasAttribute("containerField") ? chElem.getAttribute("containerField") : null;
                ParentChildMappingTable.ResolutionResult res = ParentChildMappingTable.resolve(element.getNodeName(), chElem.getNodeName(), cf, cn);

                String ch = "\n" + "  ".repeat(n) + "." + res.methodName + "(";
                if (chElem.getNodeName().equals("ProtoInstance")) {
                    ch += chElem.getNodeName() + stack.get(0) + " = ";
                }
                String DEFpar = "";
                if (chElem.getNodeName().startsWith("HAnim") && !chElem.hasAttribute("USE") && chElem.hasAttribute("DEF")) {
                    DEFpar = "\"" + chElem.getAttribute("DEF") + "\"";
                }
                ch += "new " + chElem.getNodeName() + "(" + DEFpar + ")";
                ch += subSerializeToString(chElem, n + 1, stack);
                ch += ")";

                if (element.getNodeName().equals("ProtoInstance") && chElem.getNodeName().equals("fieldValue")) {
                    postcode.add(element.getNodeName() + stack.get(0) + ch + ";\n");
                } else {
                    sb.append(ch);
                }
                if (chElem.getNodeName().equals("ProtoInstance")) {
                    stack.remove(0);
                }
            } else if (node.getNodeType() == Node.COMMENT_NODE) {
                sb.append("\n").append("  ".repeat(n)).append(".addComments(new CommentsBlock(\"").append(escapeString(node.getNodeValue())).append("\"))");
            } else if (node.getNodeType() == Node.CDATA_SECTION_NODE) {
                sb.append("\n").append("  ".repeat(n)).append(".setSourceCode(`").append(escapeString(node.getNodeValue())).append("`)");
            }
        }

        return sb.toString();
    }

    private String printSubArray(String type, String[] values) {
        StringBuilder acc = new StringBuilder();
        if (type.equals("float")) {
            acc.append("Java.to(doubleToFloat([");
        } else {
            acc.append("Java.to([");
        }
        for (int i = 0; i < values.length; i++) {
            if (type.equals("java.lang.String")) {
                acc.append("\"").append(escapeString(values[i])).append("\"");
            } else {
                acc.append(values[i]);
            }
            if (i < values.length - 1) acc.append(",");
        }
        acc.append("], Java.type(\"").append(type).append("[]\"))");
        return acc.toString();
    }

    private String escapeString(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
    }
}
