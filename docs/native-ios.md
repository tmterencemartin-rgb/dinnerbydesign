# DinnerByDesign iOS Wrapper

DinnerByDesign uses Capacitor to package the existing React/Vite app as an iOS app.

The web app remains the source of truth. Native builds use the same `src/` code and sync the compiled Vite output into `ios/App/App/public`.

## Commands

```bash
npm run build:native
npm run native:sync:ios
npm run native:open:ios
```

`build:native` sets `VITE_API_BASE_URL=https://dinnerbydesign.app` so the iOS app calls the production API rather than a relative `/api` path from the local native webview.

## Local Requirements

To compile or run the iOS app, install full Xcode and make sure the active developer directory points at Xcode:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

After Xcode is active, run:

```bash
npm run native:open:ios
```

Then choose a simulator or connected iPhone in Xcode.

## Notes

- The regular web build and deployment are unchanged.
- Re-run `npm run native:sync:ios` after web app changes that should be bundled into the iOS app.
- App Store/TestFlight work still needs bundle signing, icons, splash assets, screenshots, and Apple account configuration.
