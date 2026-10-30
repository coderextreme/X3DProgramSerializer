package net.coderextreme.x3d.serializer;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.NamedNodeMap;

import java.util.ArrayList;
import java.util.List;

/**
 * JRuby and TruffleRuby Serializer emitting Ruby scripts with Java interop.
 */
public class JRubySerializer implements LanguageSerializer {

    private final boolean isTruffle;
    private int preno = 0;

    public JRubySerializer() {
        this(false);
    }

    public JRubySerializer(boolean isTruffle) {
        this.isTruffle = isTruffle;
    }

    @Override
    public TargetLanguage getTargetLanguage() {
        return isTruffle ? TargetLanguage.TRUFFLE_RUBY : TargetLanguage.JRUBY;
    }

    @Override
    public String serialize(Element element, SerializerOptions options) {
        preno = 0;
        String clazz = options.getClassName() != null ? options.getClassName() : "Model";

        StringBuilder sb = new StringBuilder();
        if (isTruffle) {
            sb.append("# TruffleRuby Polyglot X3DJSAIL Script\n");
            sb.append("require 'truffleruby/x3drsail'\n\n");
            sb.append("ConfigurationProperties.setDeleteIntermediateFiles(false)\n");
            sb.append("ConfigurationProperties.setStripTrailingZeroes(").append(options.isStripTrailingZeroes()).append(")\n");
            sb.append("ConfigurationProperties.setStripDefaultAttributes(").append(options.isStripDefaultAttributes()).append(")\n");
            sb.append("ConfigurationProperties.setXsltEngine(ConfigurationProperties::XSLT_ENGINE_NATIVE_JAVA)\n\n");
        } else {
            sb.append("# JRuby X3DJSAIL Script\n");
            sb.append("require 'java'\n");
            sb.append("require 'jruby/x3drsail'\n\n");
            sb.append("ConfigurationProperties.setDeleteIntermediateFiles(false)\n");
            sb.append("ConfigurationProperties.setStripTrailingZeroes(").append(options.isStripTrailingZeroes()).append(")\n");
            sb.append("ConfigurationProperties.setStripDefaultAttributes(").append(options.isStripDefaultAttributes()).append(")\n");
            sb.append("ConfigurationProperties.setXsltEngine(Java::OrgWeb3dX3dJsail::ConfigurationProperties::XSLT_ENGINE_NATIVE_JAVA)\n\n");
        }

        List<Integer> stack = new ArrayList<>();
        stack.add(preno++);

        String enn = Character.toLowerCase(element.getNodeName().charAt(0)) + element.getNodeName().substring(1);
        sb.append(enn).append(stack.get(0)).append(" = ").append(element.getNodeName()).append(".new\n");
        sb.append(subSerializeToString(element, 1, stack));

        sb.append("\n# Export scene to X3D and JSON files\n");
        sb.append(enn).append(stack.get(0)).append(".toFileX3D \"").append(clazz).append(".new.")
                .append(isTruffle ? "truffleruby" : "jruby").append(".x3d\"\n");
        sb.append(enn).append(stack.get(0)).append(".toFileJSON \"").append(clazz).append(".new.")
                .append(isTruffle ? "truffleruby" : "jruby").append(".x3dj\"\n");

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
                String strval = stringValue(val, attrType);

                String method = Character.toUpperCase(name.charAt(0)) + name.substring(1);
                if (name.equals("class")) method = "CssClass";
                if (name.equals("style")) method = "CssStyle";
                if (name.equals("id")) method = "HtmlId";

                sb.append("    ".repeat(n)).append(".set").append(method).append("(").append(strval).append(")\n");
            }
        }

        NodeList nl = element.getChildNodes();
        for (int cn = 0; cn < nl.getLength(); cn++) {
            Node node = nl.item(cn);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element chElem = (Element) node;
                stack.add(0, preno++);
                String cf = chElem.hasAttribute("containerField") ? chElem.getAttribute("containerField") : null;
                ParentChildMappingTable.ResolutionResult res = ParentChildMappingTable.resolve(element.getNodeName(), chElem.getNodeName(), cf, cn);

                sb.append("    ".repeat(n)).append(".").append(res.methodName).append("(")
                        .append(chElem.getNodeName()).append(".new()\n");
                sb.append(subSerializeToString(chElem, n + 1, stack));
                sb.append("    ".repeat(n)).append(")\n");
                stack.remove(0);
            } else if (node.getNodeType() == Node.COMMENT_NODE) {
                sb.append("  ".repeat(n + 2)).append(".addComments(CommentsBlock.new(\"")
                        .append(escapeString(node.getNodeValue())).append("\"))\n");
            } else if (node.getNodeType() == Node.CDATA_SECTION_NODE) {
                sb.append("  ".repeat(n)).append(".setSourceCode(\"")
                        .append(escapeString(node.getNodeValue())).append("\")\n");
            }
        }

        return sb.toString();
    }

    private String printSubArray(String type, String val) {
        String[] parts = val.split("[ ,]+");
        String cleanJoined = String.join(", ", parts);
        if (isTruffle) {
            String rubyType = type.replace("java.lang.String", "string").replace(".", "_");
            return "to_java_" + rubyType + "_array([" + cleanJoined + "])";
        } else {
            return "[" + cleanJoined + "].to_java Java::" + type;
        }
    }

    private String stringValue(String val, String attrType) {
        if (val.equals("NULL")) return "\"\"";
        if (attrType.equals("SFString")) {
            return "\"" + escapeString(val) + "\"";
        } else if (attrType.equals("SFInt32") || attrType.equals("SFBool")) {
            return val;
        } else if (attrType.equals("SFFloat") || attrType.equals("SFDouble") || attrType.equals("SFTime")) {
            return val.contains(".") ? val : (val + ".0");
        } else if (attrType.equals("MFTime") || attrType.equals("MFDouble")) {
            return printSubArray("double", val);
        } else if (attrType.equals("MFString")) {
            String trimmed = val.trim();
            if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
                trimmed = trimmed.substring(1, trimmed.length() - 1);
            }
            String[] items = trimmed.split("\"[ ,]+\"");
            if (isTruffle) {
                return "to_java_string_array([\"" + String.join("\", \"", items) + "\"])";
            } else {
                return "[\"" + String.join("\", \"", items) + "\"].to_java Java::java.lang.String";
            }
        } else if (attrType.equals("MFInt32") || attrType.equals("MFImage") || attrType.equals("SFImage")) {
            return printSubArray("int", val);
        } else if (attrType.startsWith("MF") || attrType.startsWith("SFVec") || attrType.startsWith("SFColor") || attrType.startsWith("SFRotation")) {
            return printSubArray("float", val);
        } else {
            return "\"" + escapeString(val) + "\"";
        }
    }

    private String escapeString(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
    }
}
