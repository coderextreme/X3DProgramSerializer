# X3D program serializer from .x3d

## For TypeScript/web client-server:

```bash
# use SSH or you favorite way to pull down repositories from GitHub
git clone git@github.com:coderextreme/X3DProgramSerializer.git
cd X3DProgramSerializer/
# create package-lock.json
npm install --package-lock-only
# if needed
npm install-scripts approve @google/genai
npm install-scripts approve esbuild
npm install-scripts approve protobufjs
npm ci
npm run dev
# then go to link in terminal. I will work on getting localhost replaced with 127.0.0.1 -- my preference
```

## For Java:

Install Java and Maven 3.

```bash
cd src/java-framework/
# replace ${HOME}/X3DJSONLD/ with your own folder.
mvn install:install-file -Dfile=${HOME}/X3DJSONLD/X3DJSAIL.4.0.full.jar -DgroupId=org.web3d.x3d -DartifactId=X3DJSAIL -Dversion=4.0.full -Dpackaging=jar
mvn install:install-file -Dfile=${HOME}/X3DJSONLD/X3DJSAIL.4.0.classes.jar -DgroupId=org.web3d.x3d -DartifactId=X3DJSAIL -Dversion=4.0.classes -Dpackaging=jar

mvn clean install

## Usage

java -cp target/x3d-polyglot-serializer-framework-1.0.0.jar net.coderextreme.x3d.serializer.DOMSerializerCli

## Graal Python example

java -cp target/x3d-polyglot-serializer-framework-1.0.0.jar net.coderextreme.x3d.serializer.DOMSerializerCli ~/X3DJSONLD/src/main/data/abox.x3d graalpy abox.new.py
~/Downloads/graalpy-community-jvm-25.0.2-windows-amd64/graalpy-community-jvm-25.0.2-windows-amd64/bin/graalpy.exe --jvm --vm.cp="../../../X3DJSONLD/X3DJSAIL.4.0.full.jar" abox.new.py


## Graal JavaScript example

java -cp target/x3d-polyglot-serializer-framework-1.0.0.jar net.coderextreme.x3d.serializer.DOMSerializerCli ~/X3DJSONLD/src/main/data/abox.x3d graaljs abox.new.js
~/Downloads/graaljs-community-jvm-25.0.2-windows-amd64/graaljs-community-jvm-25.0.2-windows-amd64/bin/js --experimental-options --polyglot --vm.Djs.allowAllAccess=true --jvm --vm.classpath="../../../X3DJSONLD/X3DJSAIL.4.0.full.jar" abox.new.js

## Java example

java -cp target/x3d-polyglot-serializer-framework-1.0.0.jar net.coderextreme.x3d.serializer.DOMSerializerCli ~/X3DJSONLD/src/main/data/abox.x3d java abox.java
javac -classpath "../../../X3DJSONLD/X3DJSAIL.4.0.full.jar" abox.java
java -classpath "../../../X3DJSONLD/X3DJSAIL.4.0.full.jar:." abox

