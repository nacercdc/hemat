# E-market monorepo

## 🔦 About

This monorepo comprises four main components: apps, packages, shared resources, and tooling. The apps section includes the backend, web application, and Expo application. The packages section contains modules designed to be published as npm packages. The shared section provides code and resources that are reusable locally across the apps within the monorepo. Lastly, the tooling includes shared and fine-grained configurations for ESLint presets, Prettier, Tailwind CSS, and extendable tsconfig.

## 📦Major packages are included in the apps:

- `Common`: Tanstack Query v5
- `Expo app`: Expo v52, React Native Firebase, React v18, Nativewind V4, ...
- `Web`: Firebase v11, React v19, Nextjs v15, Next Firebase Auth Edge latest, ...

## 🏁 Start the app

- Install dependencies: `yarn`

- web local dev: `yarn web`

To run with optimizer on in dev mode (just for testing, it's faster to leave it off): `yarn web:extract`. To build for production `yarn web:prod`.

- Expo local build: `yarn android/ios`

## 🆕 Add new shared module

- `yarn turbo gen shared`

## 🆕 Add new packages module

- `yarn turbo gen package`

### In the future, the folder structure and DevOps processes will be included and described in greater detail. Stay tuned for updates!
