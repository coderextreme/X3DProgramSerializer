package net.coderextreme.x3d.serializer;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.NamedNodeMap;

import java.util.ArrayList;
import java.util.List;

/**
 * Python Serializer targeting GraalVM Python (GraalPy).
 * Generates Python code using the x3dpsail bindings conforming to X3DJSAIL.
 */
public class GraalPySerializer implements LanguageSerializer {

    private int preno = 0;

    @Override
    public TargetLanguage getTargetLanguage() {
        return TargetLanguage.GRAAL_PY;
    }

    @Override
    public String serialize(Element element, SerializerOptions options) {
        preno = 0;
        String clazz = options.getClassName() != null ? options.getClassName() : "Model";

        StringBuilder sb = new StringBuilder();
        sb.append("import x3dpsail as x3d\n");
        sb.append("from x3d_validator import validateX3DJSON\n\n");

        List<Integer> stack = new ArrayList<>();
        stack.add(preno++);

        sb.append("x3d.ConfigurationProperties.setXsltEngine(x3d.ConfigurationProperties.XSLT_ENGINE_NATIVE_JAVA)\n");
        sb.append("x3d.ConfigurationProperties.setDeleteIntermediateFiles(False)\n");
        sb.append("x3d.ConfigurationProperties.setStripTrailingZeroes(").append(options.isStripTrailingZeroes() ? "True" : "False").append(")\n");
        sb.append("x3d.ConfigurationProperties.setStripDefaultAttributes(").append(options.isStripDefaultAttributes() ? "True" : "False").append(")\n\n");

        sb.append(element.getNodeName()).append(stack.get(0)).append(" = x3d.").append(element.getNodeName()).append("()\n");
        sb.append(subSerializeToString(element, 3, stack));

        sb.append("\n# Serialization to files\n");
        sb.append(element.getNodeName()).append(stack.get(0)).append(".toFileX3D(\"").append(clazz).append(".new.graalpy.x3d\")\n");
        sb.append(element.getNodeName()).append(stack.get(0)).append(".toFileJSON(\"").append(clazz).append(".new.graalpy.x3dj\")\n");
        sb.append("x3djson = ").append(element.getNodeName()).append(stack.get(0)).append(".toStringJSON()\n");
        sb.append("validateX3DJSON(False, x3djson)\n");

        return sb.toString();
    }

    private String subSerializeToString(Element element, int n, List<Integer> stack) {
        StringBuilder sb = new StringBuilder();
        NamedNodeMap attrs = element.getAttributes();

        if (attrs != null) {
            for (int i = 0; i < attrs.getLength(); i++) {
                Node attr = attrs.item(i);
                String name = attr.getNodeName();
                String val = attr.getNodeValue();

                if (name.equals("xmlns:xsd") || name.equals("xsd:noNamespaceSchemaLocation")
                        || name.equals("containerField") || name.equals("id")) {
                    continue;
                }

                String attrType = FieldTypeRegistry.getFieldType(element.getNodeName(), name);
                String strval = stringValue(name, val, attrType);

                String method = Character.toUpperCase(name.charAt(0)) + name.substring(1);
                if (name.equals("class")) method = "CssClass";
                if (name.equals("id")) method = "HtmlId";
                if (name.equals("style") && !element.getNodeName().equals("FontStyle")) method = "CssStyle";

                sb.append(element.getNodeName()).append(stack.get(0)).append(".set").append(method).append("(").append(strval).append(")\n");
            }
        }

        NodeList nl = element.getChildNodes();
        for (int cn = 0; cn < nl.getLength(); cn++) {
            Node node = nl.item(cn);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element chElem = (Element) node;
                stack.add(0, preno++);
                sb.append(chElem.getNodeName()).append(stack.get(0)).append(" = x3d.").append(chElem.getNodeName()).append("()\n");
                sb.append(subSerializeToString(chElem, n + 1, stack));

                String cf = chElem.hasAttribute("containerField") ? chElem.getAttribute("containerField") : null;
                ParentChildMappingTable.ResolutionResult res = ParentChildMappingTable.resolve(element.getNodeName(), chElem.getNodeName(), cf, cn);

                sb.append(element.getNodeName()).append(stack.get(1)).append(".").append(res.methodName)
                        .append("(").append(chElem.getNodeName()).append(stack.get(0)).append(")\n");
                stack.remove(0);
            } else if (node.getNodeType() == Node.COMMENT_NODE) {
                sb.append(element.getNodeName()).append(stack.get(0)).append(".addComments(x3d.CommentsBlock(\"\"\"")
                        .append(escapeString(node.getNodeValue())).append("\"\"\"))\n");
            } else if (node.getNodeType() == Node.CDATA_SECTION_NODE) {
                sb.append(element.getNodeName()).append(stack.get(0)).append(".setSourceCode('''")
                        .append(escapeString(node.getNodeValue())).append("''')\n");
            }
        }

        return sb.toString();
    }

    private String stringValue(String attrName, String val, String attrType) {
        if (val.equals("NULL")) return "\"\"";
        if (attrType.equals("SFString")) {
            return "\"" + escapeString(val) + "\"";
        } else if (attrType.equals("SFInt32") || attrType.equals("SFFloat")
                || attrType.equals("SFDouble") || attrType.equals("SFTime")) {
            return val;
        } else if (attrType.equals("SFBool")) {
            return val.equalsIgnoreCase("true") ? "True" : val.equalsIgnoreCase("false") ? "False" : val;
        } else if (attrType.equals("MFTime") || attrType.equals("MFDouble")) {
            return "x3d.doubleToDouble([" + String.join(",", val.split("[ ,]+")) + "])";
        } else if (attrType.equals("MFString")) {
            String trimmed = val.trim();
            if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
                trimmed = trimmed.substring(1, trimmed.length() - 1);
            }
            String[] items = trimmed.split("\"[ ,]+\"");
            return "[\"" + String.join("\",\"", items) + "\"]";
        } else if (attrType.equals("MFInt32") || attrType.equals("MFImage") || attrType.equals("SFImage")) {
            return "[" + String.join(",", val.split("[ ,]+")) + "]";
        } else if (attrType.startsWith("MF") || attrType.startsWith("SFVec") || attrType.startsWith("SFColor") || attrType.startsWith("SFRotation")) {
            return "x3d.doubleToFloat([" + String.join(",", val.split("[ ,]+")) + "])";
        } else {
            return "\"" + escapeString(val) + "\"";
        }
    }

    private String escapeString(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
    }
}
