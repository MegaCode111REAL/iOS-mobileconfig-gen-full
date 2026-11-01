# iOS Mobileconfig Gen Full

A fully static SvelteKit application for building Apple configuration profiles.

## Local development

```sh
npm install
npm run dev
```

## Check and build

```sh
npm run check
npm run build
```

The production site is generated into `build/` using `@sveltejs/adapter-static`. All routes are prerendered; no server runtime or backend is required.

## GitHub Pages

1. In **Settings → Pages**, set the source to **GitHub Actions**.
2. Push to `main`; the workflow builds and deploys the site.
3. The project-site base path is `/iOS-mobileconfig-gen-full`.

Profile generation runs locally in the visitor's browser. Profile contents are not uploaded.

## Compatibility

The payload library is not an exhaustive guarantee of Apple's payload specifications. Verify payload types, keys, data types, OS support, supervision requirements and signing requirements against Apple's current deployment documentation.
