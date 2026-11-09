"use strict";

// GraalJS polyglot execution with X3DJSAIL host Java interop
load('X3Dautoclass.js');
var ConfigurationProperties = Packages.org.web3d.x3d.jsail.ConfigurationProperties;
ConfigurationProperties.setXsltEngine(ConfigurationProperties.XSLT_ENGINE_NATIVE_JAVA);
ConfigurationProperties.setDeleteIntermediateFiles(false);
ConfigurationProperties.setStripTrailingZeroes(true);
ConfigurationProperties.setStripDefaultAttributes(true);

function doubleToFloat(d) {
    if (typeof Float32Array !== 'undefined') {
        return new Float32Array(d);
    }
    return d;
}

var ProtoInstance0 = null;
var ProtoInstance1 = null;
      var X3D0 = new X3D().setProfile("Immersive").setVersion("4.0")
      .setHead(new head()
        .addMeta(new meta().setContent("abox.x3d").setName("title"))
        .addMeta(new meta().setContent("John Carlson").setName("creator"))
        .addMeta(new meta().setContent("manual").setName("generator"))
        .addMeta(new meta().setContent("https://coderextreme.net/X3DJSONLD/src/main/data/abox.x3d").setName("identifier"))
        .addMeta(new meta().setContent("a box").setName("description")))
      .setScene(new Scene()
        .addChild(new ProtoDeclare().setName("anyShape")
          .setProtoInterface(new ProtoInterface()
            .addField(new field().setAccessType(field.ACCESSTYPE_INPUTOUTPUT).setName("myShape").setType(field.TYPE_MFNODE)
              .addChild(new Shape()
                .setGeometry(new Sphere()))))
          .setProtoBody(new ProtoBody()
            .addChild(new Transform()
              .setIS(new IS()
                .addConnect(new connect().setNodeField("children").setProtoField("myShape"))))))
        .addChild(new ProtoDeclare().setName("one")
          .setProtoInterface(new ProtoInterface()
            .addField(new field().setAccessType(field.ACCESSTYPE_INPUTOUTPUT).setName("myShape").setType(field.TYPE_MFNODE)
              .addChild(new Shape()
                .setGeometry(new Cylinder()))))
          .setProtoBody(new ProtoBody()
            .addChild(new Transform()
              .addChild(ProtoInstance0 = new ProtoInstance().setName("anyShape")
                .setIS(new IS()
                  .addConnect(new connect().setNodeField("myShape").setProtoField("myShape")))))))
        .addChild(ProtoInstance1 = new ProtoInstance().setName("one")));
      ProtoInstance1
          .addFieldValue(new fieldValue().setName("myShape")
            .addChild(new Shape()
              .setGeometry(new Box().setSize(Java.to([140,140,140], Java.type("double[]"))))));

// Export scene to files
X3D0.toFileX3D("abox.new.graaljs.x3d");
X3D0.toFileJSON("abox.new.graaljs.x3dj");
