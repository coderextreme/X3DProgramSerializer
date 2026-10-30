package net.coderextreme.x3d.serializer;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.NamedNodeMap;

import java.util.ArrayList;
import java.util.List;

/**
 * Clojure Serializer emitting Clojure source code for JVM interop with X3DJSAIL.
 */
public class ClojureSerializer implements LanguageSerializer {

    private int preno = 0;

    @Override
    public TargetLanguage getTargetLanguage() {
        return TargetLanguage.CLOJURE;
    }

    @Override
    public String serialize(Element element, SerializerOptions options) {
        preno = 0;
        String clazz = options.getClassName() != null ? options.getClassName() : "Model";

        StringBuilder sb = new StringBuilder();
        sb.append("(ns ").append(clazz).append("\n");
        sb.append("  (:import [org.web3d.x3d.jsail.Core *]\n");
        sb.append("           [org.web3d.x3d.jsail.Grouping *]\n");
        sb.append("           [org.web3d.x3d.jsail.Shape *]\n");
        sb.append("           [org.web3d.x3d.jsail.Rendering *]\n");
        sb.append("           [org.web3d.x3d.jsail.Geometry3D *]\n");
        sb.append("           [org.web3d.x3d.jsail.Texturing *]\n");
        sb.append("           [org.web3d.x3d.jsail.Time *]\n");
        sb.append("           [org.web3d.x3d.jsail.HAnim *]\n");
        sb.append("           [org.web3d.x3d.jsail.Interpolation *]\n");
        sb.append("           [org.web3d.x3d.jsail.Lighting *]\n");
        sb.append("           [org.web3d.x3d.jsail.Navigation *]\n");
        sb.append("           [org.web3d.x3d.jsail.Networking *]\n");
        sb.append("           [org.web3d.x3d.jsail ConfigurationProperties]))\n\n");

        List<Integer> stack = new ArrayList<>();
        stack.add(preno++);

        sb.append("(ConfigurationProperties/setXsltEngine ConfigurationProperties/XSLT_ENGINE_NATIVE_JAVA)\n");
        sb.append("(ConfigurationProperties/setDeleteIntermediateFiles false)\n");
        sb.append("(ConfigurationProperties/setStripTrailingZeroes ").append(options.isStripTrailingZeroes() ? "true" : "false").append(")\n");
        sb.append("(ConfigurationProperties/setStripDefaultAttributes ").append(options.isStripDefaultAttributes() ? "true" : "false").append(")\n\n");

        sb.append("(def ").append(element.getNodeName()).append(stack.get(0)).append(" (doto (").append(element.getNodeName()).append(".)\n");
        sb.append(subSerializeToString(element, 1, stack));
        sb.append("))\n\n");

        sb.append("(.toFileX3D ").append(element.getNodeName()).append(stack.get(0)).append(" \"").append(clazz).append(".new.clojure.x3d\")\n");
        sb.append("(.toFileJSON ").append(element.getNodeName()).append(stack.get(0)).append(" \"").append(clazz).append(".new.clojure.x3dj\")\n");
        sb.append("(defn -main []\n");
        sb.append("  (println \"Serialized X3D scene successfully via Clojure X3DJSAIL bindings.\"))\n");

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
                if (name.equals("id")) method = "HtmlId";

                sb.append("    ".repeat(n)).append("(.set").append(method).append(" ").append(strval).append(")\n");
            }
        }

        NodeList nl = element.getChildNodes();
        for (int cn = 0; cn < nl.getLength(); cn++) {
            Node node = nl.item(cn);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element chElem = (Element) node;
                stack.add(0, preno++);
                String pkg = chElem.getNodeName().equals("meta") ? "org.web3d.x3d.jsail.Core." : "";
                String cf = chElem.hasAttribute("containerField") ? chElem.getAttribute("containerField") : null;
                ParentChildMappingTable.ResolutionResult res = ParentChildMappingTable.resolve(element.getNodeName(), chElem.getNodeName(), cf, cn);

                sb.append("    ".repeat(n)).append("(.").append(res.methodName).append(" (doto (").append(pkg).append(chElem.getNodeName()).append(".)\n");
                sb.append(subSerializeToString(chElem, n + 1, stack));
                sb.append("    ".repeat(n)).append("))\n");
                stack.remove(0);
            } else if (node.getNodeType() == Node.COMMENT_NODE) {
                sb.append("    ".repeat(n)).append("(.addComments \"").append(escapeString(node.getNodeValue())).append("\")\n");
            } else if (node.getNodeType() == Node.CDATA_SECTION_NODE) {
                sb.append("    ".repeat(n)).append("(.setSourceCode \"").append(escapeString(node.getNodeValue())).append("\")\n");
            }
        }

        return sb.toString();
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
            return "(double-array [" + String.join(" ", val.split("[ ,]+")) + "])";
        } else if (attrType.equals("MFString")) {
            String trimmed = val.trim();
            if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
                trimmed = trimmed.substring(1, trimmed.length() - 1);
            }
            String[] items = trimmed.split("\"[ ,]+\"");
            return "(into-array String [\"" + String.join("\" \"", items) + "\"])";
        } else if (attrType.equals("MFInt32") || attrType.equals("MFImage") || attrType.equals("SFImage")) {
            return "(int-array [" + String.join(" ", val.split("[ ,]+")) + "])";
        } else if (attrType.startsWith("MF") || attrType.startsWith("SFVec") || attrType.startsWith("SFColor") || attrType.startsWith("SFRotation")) {
            return "(float-array [" + String.join(" ", val.split("[ ,]+")) + "])";
        } else {
            return "\"" + escapeString(val) + "\"";
        }
    }

    private String escapeString(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
    }
}
