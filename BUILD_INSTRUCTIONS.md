# Build Instructions

## Requirements
- **Node.js** >= 18
- **npm** >= 9
- **zip** CLI tool (for packaging into `.xpi`)

## Project Structure
```plaintext
medium-stats-vizor/
├── src/                  # Source code (main logic, modules, models, images)
│   ├── main.js           # Entry point
│   ├── modules/          # Helper modules (constants, utilities, fetch-stats, etc.)
│   ├── models/           # Data models (e.g., result.js)
│   ├── images/           # Images used in the extension
├── public/               # Static assets (icons, manifest templates)
│   ├── icons/            # Extension icons
│   ├── manifest.json     # Manifest file for the extension
├── dist/                 # Build output (generated after running build)
├── package.json          # Project metadata and dependencies
├── README.md             # Project documentation
└── BUILD_INSTRUCTIONS.md # Build instructions for the project
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
- Copies `manifest.json` into `dist/` as `manifest.json`.

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
