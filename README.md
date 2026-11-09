X3D program serializer from .x3d
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
