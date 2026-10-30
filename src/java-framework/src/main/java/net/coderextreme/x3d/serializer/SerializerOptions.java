package net.coderextreme.x3d.serializer;

/**
 * Configuration options for the X3D DOM polyglot serializers.
 */
public class SerializerOptions {
    private String className = "Model";
    private String packageName = "net.coderextreme.data";
    private boolean breakUpMethods = true;
    private int maxChildrenPerMethod = 50;
    private int maxArrayChunksPerMethod = 50;
    private boolean stripDefaultAttributes = true;
    private boolean stripTrailingZeroes = true;
    private boolean nativeXsltEngine = true;

    public SerializerOptions() {}

    public SerializerOptions(String className, String packageName) {
        this.className = className;
        this.packageName = packageName;
    }

    public String getClassName() {
        return className;
    }

    public SerializerOptions setClassName(String className) {
        this.className = className;
        return this;
    }

    public String getPackageName() {
        return packageName;
    }

    public SerializerOptions setPackageName(String packageName) {
        this.packageName = packageName;
        return this;
    }

    public boolean isBreakUpMethods() {
        return breakUpMethods;
    }

    public SerializerOptions setBreakUpMethods(boolean breakUpMethods) {
        this.breakUpMethods = breakUpMethods;
        return this;
    }

    public int getMaxChildrenPerMethod() {
        return maxChildrenPerMethod;
    }

    public SerializerOptions setMaxChildrenPerMethod(int maxChildrenPerMethod) {
        this.maxChildrenPerMethod = maxChildrenPerMethod;
        return this;
    }

    public int getMaxArrayChunksPerMethod() {
        return maxArrayChunksPerMethod;
    }

    public SerializerOptions setMaxArrayChunksPerMethod(int maxArrayChunksPerMethod) {
        this.maxArrayChunksPerMethod = maxArrayChunksPerMethod;
        return this;
    }

    public boolean isStripDefaultAttributes() {
        return stripDefaultAttributes;
    }

    public SerializerOptions setStripDefaultAttributes(boolean stripDefaultAttributes) {
        this.stripDefaultAttributes = stripDefaultAttributes;
        return this;
    }

    public boolean isStripTrailingZeroes() {
        return stripTrailingZeroes;
    }

    public SerializerOptions setStripTrailingZeroes(boolean stripTrailingZeroes) {
        this.stripTrailingZeroes = stripTrailingZeroes;
        return this;
    }

    public boolean isNativeXsltEngine() {
        return nativeXsltEngine;
    }

    public SerializerOptions setNativeXsltEngine(boolean nativeXsltEngine) {
        this.nativeXsltEngine = nativeXsltEngine;
        return this;
    }
}
