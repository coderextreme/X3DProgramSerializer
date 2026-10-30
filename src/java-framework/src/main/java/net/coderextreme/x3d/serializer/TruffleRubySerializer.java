package net.coderextreme.x3d.serializer;

/**
 * TruffleRuby Serializer extending JRubySerializer with GraalVM Truffle array interop.
 */
public class TruffleRubySerializer extends JRubySerializer {
    public TruffleRubySerializer() {
        super(true);
    }
}
