# Build Instructions

## Requirements
- **Node.js** >= 18
- **npm** >= 9
- **zip** CLI tool (for packaging into `.xpi`)

## Project Structure
```plaintext
medium-stats-vizor/
├── src/                  # Source code (JavaScript modules, constants, utils)
├── public/               # Static assets (icons, manifest templates)
├── dist/                 # Build output (generated after running build)
├── package.json
├── manifest.firefox.json # Manifest template for Firefox
├── README.md
└── build.js              # Build script (bundles and copies files)
```

## Build Steps
### 1. Install dependencies
```bash
npm install
```

### 2. Run the build process
```bash
npm run build
```
- Bundles all JavaScript from `src/` into `dist/content.bundle.js` using **esbuild**.
- Copies icons and other static assets from `public/` into `dist/`.
- Copies `manifest.firefox.json` into `dist/` as `manifest.json`.

## Packaging
After building, create a signed `.xpi` package:
```bash
cd dist
zip -r ../medium-stats-vizor.xpi .
```
- The file `medium-stats-vizor.xpi` is ready for submission to Firefox Add-ons.
- Alternatively, load the `dist/` folder directly into Firefox for testing via:
```plaintext
about:debugging#/runtime/this-firefox
```

## Source Code Submission for Mozilla
When submitting to Mozilla Add-ons, upload:
- **Complete source code** (`src/`, `public/`, build scripts, `package.json`, etc.)
- **This build instructions file**
- **Build output** (`dist/` directory)

This ensures reviewers can rebuild the extension from source and verify it matches the `.xpi` package.
