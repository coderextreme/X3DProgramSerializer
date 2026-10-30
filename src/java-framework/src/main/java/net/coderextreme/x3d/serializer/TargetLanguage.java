package net.coderextreme.x3d.serializer;

/**
 * Supported target programming languages for the X3D DOM Serializer Framework.
 */
public enum TargetLanguage {
    JAVA("Java (X3DJSAIL)", ".java", "Native Java using X3DJSAIL with method chunking"),
    GRAAL_JS("JavaScript (GraalJS)", ".js", "GraalVM JavaScript with seamless Java host interop"),
    GRAAL_PY("Python (GraalPy)", ".py", "GraalVM Python with x3dpsail bindings"),
    CLOJURE("Clojure", ".clj", "JVM Clojure using doto macros and Java interop"),
    JRUBY("JRuby", ".rb", "JRuby using Java::OrgWeb3dX3dJsail"),
    TRUFFLE_RUBY("TruffleRuby", ".rb", "GraalVM TruffleRuby with Java array conversions");

    private final String displayName;
    private final String fileExtension;
    private final String description;

    TargetLanguage(String displayName, String fileExtension, String description) {
        this.displayName = displayName;
        this.fileExtension = fileExtension;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getFileExtension() {
        return fileExtension;
    }

    public String getDescription() {
        return description;
    }

    public static TargetLanguage fromString(String text) {
        if (text == null) return JAVA;
        String clean = text.trim().toUpperCase().replace("-", "_").replace(" ", "_");
        switch (clean) {
            case "JAVA":
            case "X3DJSAIL":
                return JAVA;
            case "GRAALJS":
            case "GRAAL_JS":
            case "JS":
            case "JAVASCRIPT":
                return GRAAL_JS;
            case "GRAALPY":
            case "GRAAL_PY":
            case "PY":
            case "PYTHON":
                return GRAAL_PY;
            case "CLOJURE":
            case "CLJ":
                return CLOJURE;
            case "JRUBY":
            case "RUBY":
                return JRUBY;
            case "TRUFFLERUBY":
            case "TRUFFLE_RUBY":
                return TRUFFLE_RUBY;
            default:
                return JAVA;
        }
    }
}
