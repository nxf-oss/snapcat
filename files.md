#  package.json

### File Content

```json
{
"name": "snapcat",
"version": "2.0.0",
"description": "Tree it, Read it, Shape it",
"keywords": [
"cli",
"tree",
"cat",
"filesystem",
"snapshot",
"files",
"node-cli",
"typescript",
"esm"
],
"homepage": "https://github.com/nxf-oss/snapcat#readme",
"bugs": {
"url": "https://github.com/nxf-oss/snapcat/issues"
},
"repository": {
"type": "git",
"url": "git+https://github.com/nxf-oss/snapcat.git"
},
"license": "MIT",
"author": "neuxdotdev",
"type": "module",
"main": "dist/index.js",
"bin": {
"snapcat": "dist/bin/snapcat.js"
},
"files": [
"dist",
"README.md",
"LICENSE"
],
"engines": {
"node": ">=20.0.0"
},
"scripts": {
"build": "yarn run clean && tsc --build",
"dev": "ts-node --esm --loader ts-node/esm bin/snapcat.ts",
"start": "node --enable-source-maps dist/bin/snapcat.js",
"lint": "eslint 'src/**/*.{ts,tsx}' 'bin/**/*.ts'",
"test": "jest",
"clean": "rm -rf dist .tsbuildinfo",
"prepare": "yarn run build"
},
"dependencies": {
"chalk": "^5.6.2",
"commander": "^14.0.2",
"fast-glob": "^3.3.3"
},
"devDependencies": {
"@types/node": "^24.10.1",
"@typescript-eslint/eslint-plugin": "^8.48.0",
"@typescript-eslint/parser": "^8.48.0",
"eslint": "^9.39.1",
"ts-node": "^10.9.2",
"typescript": "^5.9.3",
"jest": "^30.2.0",
"@types/jest": "^30.0.2"
},
"enginesStrict": true
}
```

### Metadata

```json
{
  "extension": ".json",
  "fullPath": "/home/neuxdotdev/Repository/Github/snapcat/package.json",
  "relativePath": "package.json",
  "baseName": "package",
  "size": "1.44KB",
  "sha256": "c75dca8545831fe35ee0112e6d2c328b7e0ea856f29f61d3c18bd44817cd7755",
  "fileType": {
    "isFile": true,
    "isDirectory": false,
    "isSymbolicLink": false
  },
  "lastModified": "2025-11-29T14:40:48.022Z",
  "permissions": "rw-r--r--"
}
```

---

