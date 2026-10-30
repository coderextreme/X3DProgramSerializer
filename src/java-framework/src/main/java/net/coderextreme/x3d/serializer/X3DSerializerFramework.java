package net.coderextreme.x3d.serializer;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.File;
import java.io.InputStream;
import java.io.StringReader;
import java.lang.reflect.Method;
import java.util.*;

/**
 * Single Unified Framework in Java to serialize X3D XML DOM to polyglot source code apps.
 *
 * <p>Just like JSON and XML can be serialized from Java objects using reflection or code generation
 * patterns, this framework provides:
 * <ul>
 *   <li>DOM-to-Source code serialization for Java (X3DJSAIL), GraalJS, GraalPy, Clojure, JRuby, TruffleRuby</li>
 *   <li>The central Parent-Child-ContainerField resolution table ({@link ParentChildMappingTable})</li>
 *   <li>Field type validation & introspection ({@link FieldTypeRegistry})</li>
 *   <li>Modular bytecode chunking to prevent 64KB method limits on large scenes</li>
 *   <li>Java reflection utility to inspect and invoke X3DJSAIL binding methods dynamically</li>
 * </ul>
 */
public class X3DSerializerFramework {

    private static final Map<TargetLanguage, LanguageSerializer> REGISTRY = new EnumMap<>(TargetLanguage.class);

    static {
        register(new JavaSerializer());
        register(new GraalJsSerializer());
        register(new GraalPySerializer());
        register(new ClojureSerializer());
        register(new JRubySerializer(false));
        register(new TruffleRubySerializer());
    }

    public static void register(LanguageSerializer serializer) {
        REGISTRY.put(serializer.getTargetLanguage(), serializer);
    }

    public static LanguageSerializer getSerializer(TargetLanguage language) {
        LanguageSerializer serializer = REGISTRY.get(language);
        if (serializer == null) {
            throw new IllegalArgumentException("No serializer registered for language: " + language);
        }
        return serializer;
    }

    public static Set<TargetLanguage> getSupportedLanguages() {
        return Collections.unmodifiableSet(REGISTRY.keySet());
    }

    /**
     * Serializes an XML string to the desired programming language.
     */
    public static String serialize(String xmlString, TargetLanguage targetLanguage, SerializerOptions options) throws Exception {
        Document doc = parseXml(xmlString);
        return getSerializer(targetLanguage).serialize(doc, options);
    }

    /**
     * Serializes an XML file to the desired programming language.
     */
    public static String serialize(File xmlFile, TargetLanguage targetLanguage, SerializerOptions options) throws Exception {
        Document doc = parseXml(xmlFile);
        return getSerializer(targetLanguage).serialize(doc, options);
    }

    /**
     * Serializes an XML DOM Document directly.
     */
    public static String serialize(Document doc, TargetLanguage targetLanguage, SerializerOptions options) {
        return getSerializer(targetLanguage).serialize(doc, options);
    }

    /**
     * Serializes an XML DOM Element directly.
     */
    public static String serialize(Element element, TargetLanguage targetLanguage, SerializerOptions options) {
        return getSerializer(targetLanguage).serialize(element, options);
    }

    /**
     * Parses an XML string into a standard W3C DOM Document.
     */
    public static Document parseXml(String xml) throws Exception {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        dbf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        DocumentBuilder db = dbf.newDocumentBuilder();
        return db.parse(new InputSource(new StringReader(xml)));
    }

    /**
     * Parses an XML file into a standard W3C DOM Document.
     */
    public static Document parseXml(File file) throws Exception {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        dbf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        DocumentBuilder db = dbf.newDocumentBuilder();
        return db.parse(file);
    }

    /**
     * Parses an InputStream into a standard W3C DOM Document.
     */
    public static Document parseXml(InputStream is) throws Exception {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        dbf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        DocumentBuilder db = dbf.newDocumentBuilder();
        return db.parse(is);
    }

    /**
     * Reflection helper: checks whether an X3DJSAIL class has a matching setter/adder method
     * for a child object or field.
     */
    public static boolean hasMethod(Class<?> parentClass, String methodName, Class<?> paramType) {
        try {
            Method m = parentClass.getMethod(methodName, paramType);
            return m != null;
        } catch (NoSuchMethodException e) {
            return false;
        }
    }

    /**
     * Reflection helper: invokes a method on a parent object with a child parameter.
     */
    public static Object invokeMethod(Object parent, String methodName, Object child) throws Exception {
        for (Method m : parent.getClass().getMethods()) {
            if (m.getName().equals(methodName) && m.getParameterCount() == 1) {
                if (m.getParameterTypes()[0].isInstance(child)) {
                    return m.invoke(parent, child);
                }
            }
        }
        throw new NoSuchMethodException("No matching method " + methodName + " for " + child.getClass().getName());
    }

    /**
     * Look up parent-child method resolution table.
     */
    public static List<ParentChildEntry> getMappingTable() {
        return ParentChildMappingTable.getCompleteTable();
    }
}
