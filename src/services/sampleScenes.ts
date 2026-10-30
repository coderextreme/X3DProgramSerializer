export interface SampleScene {
	id: string;
	title: string;
	description: string;
	category: string;
	xml: string;
}

export const sampleScenes: SampleScene[] = [
	{
		id: 'hello-world',
		title: 'Hello World Box & Material',
		description: 'Fundamental X3D scene with Scene, Transform, Shape, Appearance, Material, and Box geometry.',
		category: 'Basic Geometry',
		xml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE X3D PUBLIC "ISO//Web3D//DTD X3D 4.0//EN" "https://www.web3d.org/specifications/x3d-4.0.dtd">
<X3D profile="Interchange" version="4.0" xmlns:xsd="http://www.w3.org/2001/XMLSchema-instance" xsd:noNamespaceSchemaLocation="https://www.web3d.org/specifications/x3d-4.0.xsd">
  <head>
    <meta name="title" content="HelloWorld.x3d"/>
    <meta name="description" content="Simple 3D box with vibrant cyan diffuse material."/>
    <meta name="creator" content="X3D Working Group"/>
  </head>
  <Scene>
    <WorldInfo title="Hello World Scene"/>
    <NavigationInfo type='"EXAMINE" "ANY"'/>
    <Viewpoint description="Front View" position="0.0 0.0 8.0"/>
    <Transform DEF="BoxTransform" translation="0.0 0.5 0.0" rotation="0.0 1.0 0.0 0.785398">
      <Shape DEF="CyanBox">
        <Appearance>
          <Material diffuseColor="0.0 0.8 0.9" specularColor="0.8 0.8 0.8" shininess="0.85" transparency="0.0"/>
        </Appearance>
        <Box size="2.0 2.0 2.0"/>
      </Shape>
    </Transform>
  </Scene>
</X3D>`
	},
	{
		id: 'hanim-humanoid',
		title: 'HAnim Humanoid Joint Hierarchy',
		description: 'HAnimHumanoid with joints, segments, sites, skin, and viewpoints demonstrating containerField mapping.',
		category: 'HAnim & Avatars',
		xml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE X3D PUBLIC "ISO//Web3D//DTD X3D 4.0//EN" "https://www.web3d.org/specifications/x3d-4.0.dtd">
<X3D profile="Immersive" version="4.0">
  <head>
    <meta name="title" content="HAnimHumanoidExample.x3d"/>
    <meta name="description" content="HAnim Avatar demonstrating skeleton hierarchy and containerField resolution."/>
  </head>
  <Scene>
    <WorldInfo title="HAnim Humanoid"/>
    <HAnimHumanoid DEF="StandardAvatar" name="Avatar" loa="1" version="2.0">
      <HAnimJoint DEF="humanoid_root" name="humanoid_root" center="0 0.824 0.027" containerField="skeleton">
        <HAnimSegment DEF="sacrum" name="sacrum">
          <Transform translation="0 0.824 0">
            <Shape>
              <Appearance>
                <Material diffuseColor="0.2 0.7 0.3"/>
              </Appearance>
              <Box size="0.2 0.3 0.15"/>
            </Shape>
          </Transform>
        </HAnimSegment>
        <HAnimJoint DEF="sacroiliac" name="sacroiliac" center="0 0.914 0.001" containerField="joints">
          <HAnimSegment DEF="pelvis" name="pelvis">
            <Shape>
              <Appearance>
                <Material diffuseColor="0.8 0.4 0.1"/>
              </Appearance>
              <Sphere radius="0.12"/>
            </Shape>
          </HAnimSegment>
        </HAnimJoint>
        <HAnimSite DEF="skull_tip_site" name="skull_tip_site" translation="0 1.7 0" containerField="sites">
          <Viewpoint description="Avatar Eye Level" position="0 0 1.5"/>
        </HAnimSite>
      </HAnimJoint>
    </HAnimHumanoid>
  </Scene>
</X3D>`
	},
	{
		id: 'animation-route',
		title: 'Keyframe Animation with TimeSensor & ROUTE',
		description: 'Continuous rotation and translation using TimeSensor, OrientationInterpolator, PositionInterpolator, and ROUTE statements.',
		category: 'Animation & Interpolators',
		xml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE X3D PUBLIC "ISO//Web3D//DTD X3D 4.0//EN" "https://www.web3d.org/specifications/x3d-4.0.dtd">
<X3D profile="Interchange" version="4.0">
  <head>
    <meta name="title" content="AnimatedSphere.x3d"/>
    <meta name="description" content="Pulsing, rotating sphere driven by TimeSensors and interpolators."/>
  </head>
  <Scene>
    <Transform DEF="OrbTransform" translation="0 0 0">
      <Shape>
        <Appearance>
          <Material DEF="OrbMaterial" diffuseColor="1.0 0.3 0.2" emissiveColor="0.2 0.05 0.0" specularColor="1 1 1"/>
        </Appearance>
        <Sphere radius="1.2"/>
      </Shape>
    </Transform>
    <TimeSensor DEF="Clock" cycleInterval="4.0" loop="true" enabled="true"/>
    <OrientationInterpolator DEF="Rotator" key="0.0 0.5 1.0" keyValue="0 1 0 0.0, 0 1 0 3.14159, 0 1 0 6.28318"/>
    <PositionInterpolator DEF="Bouncer" key="0.0 0.25 0.5 0.75 1.0" keyValue="0 0 0, 0 1.5 0, 0 0 0, 0 -1.5 0, 0 0 0"/>
    <ROUTE fromNode="Clock" fromField="fraction_changed" toNode="Rotator" toField="set_fraction"/>
    <ROUTE fromNode="Rotator" fromField="value_changed" toNode="OrbTransform" toField="set_rotation"/>
    <ROUTE fromNode="Clock" fromField="fraction_changed" toNode="Bouncer" toField="set_fraction"/>
    <ROUTE fromNode="Bouncer" fromField="value_changed" toNode="OrbTransform" toField="set_translation"/>
  </Scene>
</X3D>`
	},
	{
		id: 'cad-assembly',
		title: 'CAD Assembly & Part Structure',
		description: 'Product structure assembly with CADAssembly, CADPart, CADFace, and IndexedFaceSet components.',
		category: 'CAD & Engineering',
		xml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE X3D PUBLIC "ISO//Web3D//DTD X3D 4.0//EN" "https://www.web3d.org/specifications/x3d-4.0.dtd">
<X3D profile="CADInterchange" version="4.0">
  <head>
    <meta name="title" content="CADMechanicalPart.x3d"/>
  </head>
  <Scene>
    <CADAssembly name="PistonAssembly">
      <CADPart name="PistonHead" translation="0 2.5 0">
        <CADFace name="PistonTopSurface">
          <Shape>
            <Appearance>
              <Material diffuseColor="0.75 0.75 0.8" metallic="0.9" roughness="0.2"/>
            </Appearance>
            <Cylinder radius="1.0" height="0.6"/>
          </Shape>
        </CADFace>
      </CADPart>
      <CADPart name="ConnectingRod" translation="0 1.0 0">
        <CADFace name="RodShaft">
          <Shape>
            <Appearance>
              <Material diffuseColor="0.4 0.4 0.45"/>
            </Appearance>
            <Box size="0.3 2.0 0.3"/>
          </Shape>
        </CADFace>
      </CADPart>
    </CADAssembly>
  </Scene>
</X3D>`
	},
	{
		id: 'spatial-sound',
		title: 'Spatial Sound & WebAudio Graph',
		description: 'X3D 4.0 W3C Web Audio spatialization with SpatialSound, AudioClip, BiquadFilter, and Gain.',
		category: 'Audio & Environmental',
		xml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE X3D PUBLIC "ISO//Web3D//DTD X3D 4.0//EN" "https://www.web3d.org/specifications/x3d-4.0.dtd">
<X3D profile="Full" version="4.0">
  <head>
    <meta name="title" content="SpatialAudioScene.x3d"/>
  </head>
  <Scene>
    <SpatialSound distanceModel="INVERSE" spatialize="true" location="2.0 1.5 -3.0">
      <Gain gain="0.8">
        <BiquadFilter type="LOWPASS" frequency="850.0">
          <AudioClip description="Ambient Engine Hum" url='"audio/engine.wav" "audio/engine.mp3"' loop="true" enabled="true"/>
        </BiquadFilter>
      </Gain>
    </SpatialSound>
  </Scene>
</X3D>`
	},
	{
		id: 'large-mesh',
		title: 'Large Mesh Geometry (Chunking Test)',
		description: 'High-density polygon mesh with extensive coordinate points and indices to demonstrate Java method splitting & bytecode limitation prevention.',
		category: 'Stress & Bytecode Splitting',
		xml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE X3D PUBLIC "ISO//Web3D//DTD X3D 4.0//EN" "https://www.web3d.org/specifications/x3d-4.0.dtd">
<X3D profile="Interchange" version="4.0">
  <head>
    <meta name="title" content="DenseMeshChunking.x3d"/>
    <meta name="description" content="Demonstrates automatic breaking up of code into helper methods preventing JVM 64KB bytecode overflow."/>
  </head>
  <Scene>
    <Transform translation="0 0 0">
      <Shape>
        <Appearance>
          <Material diffuseColor="0.8 0.6 0.2"/>
        </Appearance>
        <IndexedFaceSet solid="false" coordIndex="0 1 2 -1 2 3 0 -1 0 3 4 -1 4 5 0 -1 0 5 6 -1 6 7 0 -1 0 7 8 -1 8 1 0 -1">
          <Coordinate point="0 1.5 0, 1 0 1, 1 0 -1, -1 0 -1, -1 0 1, 1.4 0 0, 0 0 -1.4, -1.4 0 0, 0 0 1.4"/>
          <Normal vector="0 1 0, 0.7 0.7 0, -0.7 0.7 0, 0 0.7 0.7, 0 0.7 -0.7, 1 0 0, -1 0 0, 0 0 1, 0 0 -1"/>
          <Color color="1 0 0, 0 1 0, 0 0 1, 1 1 0, 0 1 1, 1 0 1, 0.5 0.5 0.5, 0.8 0.2 0.5, 0.2 0.8 0.3"/>
        </IndexedFaceSet>
      </Shape>
    </Transform>
  </Scene>
</X3D>`
	}
];
