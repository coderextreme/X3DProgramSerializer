package net.coderextreme.x3d.serializer;

import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;

/**
 * Command-Line Interface to serialize X3D XML DOM files to any supported language.
 *
 * <pre>
 * Usage:
 *   java -jar x3d-polyglot-serializer.jar <input.x3d> <language: java|graaljs|graalpy|clojure|jruby|truffleruby> [output_file]
 * </pre>
 */
public class DOMSerializerCli {

    public static void main(String[] args) {
        if (args.length < 2) {
            printHelp();
            System.exit(1);
        }

        String inputPath = args[0];
        String langArg = args[1];
        String outputPath = args.length > 2 ? args[2] : null;

        try {
            File inputFile = new File(inputPath);
            if (!inputFile.exists()) {
                System.err.println("Error: Input file does not exist: " + inputPath);
                System.exit(2);
            }

            TargetLanguage target = TargetLanguage.fromString(langArg);
            String fileName = inputFile.getName();
            String className = fileName.contains(".") ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
            className = className.replaceAll("[^a-zA-Z0-9_]", "_");

            SerializerOptions options = new SerializerOptions();
            options.setClassName(className);
            options.setBreakUpMethods(true);
            options.setStripDefaultAttributes(true);
            options.setStripTrailingZeroes(true);
            options.setNativeXsltEngine(true);

            System.out.println("Parsing X3D XML: " + inputPath);
            System.out.println("Serializing to target language: " + target.getDisplayName());

            String generatedCode = X3DSerializerFramework.serialize(inputFile, target, options);

            if (outputPath != null) {
                File outFile = new File(outputPath);
                if (outFile.getParentFile() != null) {
                    outFile.getParentFile().mkdirs();
                }
                try (FileWriter writer = new FileWriter(outFile)) {
                    writer.write(generatedCode);
                }
                System.out.println("Successfully generated: " + outFile.getAbsolutePath());
            } else {
                System.out.println("\n--- GENERATED SOURCE CODE ---\n");
                System.out.println(generatedCode);
            }

        } catch (Exception e) {
            System.err.println("Serialization failed: " + e.getMessage());
            e.printStackTrace();
            System.exit(3);
        }
    }

    private static void printHelp() {
        System.out.println("X3D DOM Polyglot Serializer Framework CLI");
        System.out.println("----------------------------------------");
        System.out.println("Usage:");
        System.out.println("  java -jar x3d-polyglot-serializer.jar <input.x3d> <language> [output_file]");
        System.out.println("\nSupported languages:");
        for (TargetLanguage lang : TargetLanguage.values()) {
            System.out.printf("  - %-12s : %s (extension %s)\n", lang.name().toLowerCase(), lang.getDisplayName(), lang.getFileExtension());
        }
        System.out.println("\nExample:");
        System.out.println("  java -jar x3d-polyglot-serializer.jar HelloWorld.x3d java HelloWorld.java");
        System.out.println("  java -jar x3d-polyglot-serializer.jar Avatar.x3d graaljs Avatar.js");
    }
}
