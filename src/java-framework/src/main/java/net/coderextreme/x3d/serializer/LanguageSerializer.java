package net.coderextreme.x3d.serializer;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 * Common SPI contract implemented by all polyglot serializers in the framework.
 */
public interface LanguageSerializer {

    /**
     * Identifies the language emitted by this serializer.
     */
    TargetLanguage getTargetLanguage();

    /**
     * Serializes an XML DOM Document or Element into source code in the target language.
     *
     * @param root the DOM Document or root Element
     * @param options code generation configuration
     * @return generated source code string
     */
    String serialize(Element root, SerializerOptions options);

    /**
     * Default convenience overload accepting a Document.
     */
    default String serialize(Document doc, SerializerOptions options) {
        return serialize(doc.getDocumentElement(), options);
    }
}
