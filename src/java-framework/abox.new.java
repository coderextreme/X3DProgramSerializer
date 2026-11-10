package net.coderextreme.data;

import org.web3d.x3d.jsail.*;
import org.web3d.x3d.jsail.CADGeometry.*;
import org.web3d.x3d.jsail.Core.*;
import org.web3d.x3d.jsail.CubeMapTexturing.*;
import org.web3d.x3d.jsail.DIS.*;
import org.web3d.x3d.jsail.EnvironmentalEffects.*;
import org.web3d.x3d.jsail.EnvironmentalSensor.*;
import org.web3d.x3d.jsail.EventUtilities.*;
import org.web3d.x3d.jsail.Followers.*;
import org.web3d.x3d.jsail.Geometry2D.*;
import org.web3d.x3d.jsail.Geometry3D.*;
import org.web3d.x3d.jsail.Geospatial.*;
import org.web3d.x3d.jsail.Grouping.*;
import org.web3d.x3d.jsail.HAnim.*;
import org.web3d.x3d.jsail.Interpolation.OrientationInterpolator;
import org.web3d.x3d.jsail.Interpolation.*;
import org.web3d.x3d.jsail.KeyDeviceSensor.*;
import org.web3d.x3d.jsail.Layering.*;
import org.web3d.x3d.jsail.Layout.*;
import org.web3d.x3d.jsail.Lighting.*;
import org.web3d.x3d.jsail.NURBS.*;
import org.web3d.x3d.jsail.Navigation.*;
import org.web3d.x3d.jsail.Networking.*;
import org.web3d.x3d.jsail.ParticleSystems.*;
import org.web3d.x3d.jsail.Picking.*;
import org.web3d.x3d.jsail.PointingDeviceSensor.*;
import org.web3d.x3d.jsail.Rendering.*;
import org.web3d.x3d.jsail.RigidBodyPhysics.*;
import org.web3d.x3d.jsail.Scripting.*;
import org.web3d.x3d.jsail.Shaders.*;
import org.web3d.x3d.jsail.Shape.*;
import org.web3d.x3d.jsail.Sound.*;
import org.web3d.x3d.jsail.Text.*;
import org.web3d.x3d.jsail.Texturing3D.*;
import org.web3d.x3d.jsail.Texturing.*;
import org.web3d.x3d.jsail.Time.*;
import org.web3d.x3d.jsail.VolumeRendering.*;
import org.web3d.x3d.jsail.fields.*;
import java.util.ArrayList;
import java.util.List;

public class abox {
  public static void main(String[] args) {
    ConfigurationProperties.setXsltEngine(ConfigurationProperties.XSLT_ENGINE_NATIVE_JAVA);
    ConfigurationProperties.setDeleteIntermediateFiles(false);
    ConfigurationProperties.setStripTrailingZeroes(true);
    ConfigurationProperties.setStripDefaultAttributes(true);
    X3D model = new abox().initialize();
    System.out.print(model.validationReport().trim());
    model.toFileX3D("abox.new.java.x3d");
    model.toFileJSON("abox.new.java.x3dj");
  }

  private ProtoInstance ProtoInstance0 = null;
  private ProtoInstance ProtoInstance1 = null;
  public X3D initialize() {
      X3D X3D0 = new X3D().setProfile(new SFString("Immersive")).setVersion(new SFString("4.0"))
      .setHead(gethead_1())
      .setScene(getScene_7());
    ProtoInstance1
      .addFieldValue(new fieldValue().setName(new SFString("myShape")));
    return X3D0;
  }

  public meta getmeta_2() {
    return new meta().setContent(new SFString("abox.x3d")).setName(new SFString("title"));
  }

  public meta getmeta_3() {
    return new meta().setContent(new SFString("John Carlson")).setName(new SFString("creator"));
  }

  public meta getmeta_4() {
    return new meta().setContent(new SFString("manual")).setName(new SFString("generator"));
  }

  public meta getmeta_5() {
    return new meta().setContent(new SFString("https://coderextreme.net/X3DJSONLD/src/main/data/abox.x3d")).setName(new SFString("identifier"));
  }

  public meta getmeta_6() {
    return new meta().setContent(new SFString("a box")).setName(new SFString("description"));
  }

  public head gethead_1() {
    return new head()
      .addMeta(getmeta_2())
      .addMeta(getmeta_3())
      .addMeta(getmeta_4())
      .addMeta(getmeta_5())
      .addMeta(getmeta_6());
  }

  public Sphere getSphere_12() {
    return new Sphere();
  }

  public Shape getShape_11() {
    return new Shape()
      .setGeometry(getSphere_12());
  }

  public field getfield_10() {
    return new field().setType("MFNode").setAccessType(field.ACCESSTYPE_INPUTOUTPUT).setName(new SFString("myShape"))
      .addChild(getShape_11());
  }

  public ProtoInterface getProtoInterface_9() {
    return new ProtoInterface()
      .addField(getfield_10());
  }

  public connect getconnect_16() {
    return new connect().setNodeField(new SFString("children")).setProtoField(new SFString("myShape"));
  }

  public IS getIS_15() {
    return new IS()
      .addConnect(getconnect_16());
  }

  public Transform getTransform_14() {
    return new Transform()
      .setIS(getIS_15());
  }

  public ProtoBody getProtoBody_13() {
    return new ProtoBody()
      .addChild(getTransform_14());
  }

  public ProtoDeclare getProtoDeclare_8() {
    return new ProtoDeclare().setName(new SFString("anyShape"))
      .setProtoInterface(getProtoInterface_9())
      .setProtoBody(getProtoBody_13());
  }

  public Cylinder getCylinder_21() {
    return new Cylinder();
  }

  public Shape getShape_20() {
    return new Shape()
      .setGeometry(getCylinder_21());
  }

  public field getfield_19() {
    return new field().setType("MFNode").setAccessType(field.ACCESSTYPE_INPUTOUTPUT).setName(new SFString("myShape"))
      .addChild(getShape_20());
  }

  public ProtoInterface getProtoInterface_18() {
    return new ProtoInterface()
      .addField(getfield_19());
  }

  public connect getconnect_26() {
    return new connect().setNodeField(new SFString("myShape")).setProtoField(new SFString("myShape"));
  }

  public IS getIS_25() {
    return new IS()
      .addConnect(getconnect_26());
  }

  public ProtoInstance getProtoInstance_24() {
    return ProtoInstance0 = new ProtoInstance().setName(new SFString("anyShape"))
      .setIS(getIS_25());
  }

  public Transform getTransform_23() {
    return new Transform()
      .addChild(getProtoInstance_24());
  }

  public ProtoBody getProtoBody_22() {
    return new ProtoBody()
      .addChild(getTransform_23());
  }

  public ProtoDeclare getProtoDeclare_17() {
    return new ProtoDeclare().setName(new SFString("one"))
      .setProtoInterface(getProtoInterface_18())
      .setProtoBody(getProtoBody_22());
  }

  public ProtoInstance getProtoInstance_27() {
    return ProtoInstance1 = new ProtoInstance().setName(new SFString("one"));
  }

  public Scene getScene_7() {
    return new Scene()
      .addChild(getProtoDeclare_8())
      .addChild(getProtoDeclare_17())
      .addChild(getProtoInstance_27());
  }

}
