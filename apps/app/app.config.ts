import type { ConfigContext, ExpoConfig } from "expo/config";

const EAS_PROJECT_ID = "f7a7ba65-93a4-4758-bee3-35f8c8481d30";
const PROJECT_SLUG = "e-market";
const OWNER = "etmsoftwareplc";

// App production config
const APP_NAME = "E-Market";
const BUNDLE_IDENTIFIER = "com.company.emarket";
const PACKAGE_NAME = "com.company.emarket";
const ICON = "./assets/images/icon.png";
const ADAPTIVE_ICON = "./assets/images/adaptive-icon.png";
const SPLASH_IMAGE = "./assets/images/splash-icon.png";
const SCHEME = "app-scheme";
const GOOGLE_SERVICE_FILE_ANDROID = `./configs/google-services.json`;
const GOOGLE_SERVICE_FILE_IOS = `./configs/GoogleService-Info.plist`;
export default ({ config }: ConfigContext): ExpoConfig => {
  console.log("⚙️ Building app for environment:", process.env.APP_ENV);
  const {
    name,
    bundleIdentifier,
    icon,
    adaptiveIcon,
    splashImage,
    packageName,
    scheme,
    googleServicesFileAndroid,
    googleServicesFileIOS,
  } = getDynamicAppConfig(
    (process.env.APP_ENV as EnvironnementType) || "development"
  );

  return {
    ...config,
    name: name,
    slug: PROJECT_SLUG,
    owner: OWNER,
    scheme,
    version: "0.1.0",
    orientation: "portrait",
    icon,
    userInterfaceStyle: "automatic",
    splash: {
      image: splashImage,
      resizeMode: "contain",
      backgroundColor: "#FFFFFF",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: bundleIdentifier,
      supportsTablet: true,
      googleServicesFile: googleServicesFileIOS,
    },
    android: {
      package: packageName,
      googleServicesFile: googleServicesFileAndroid,
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: "#FFFFFF",
      },
    },
    updates: {
      url: ` {EAS_PROJECT_ID}`,
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
    },
    plugins: [
      "expo-router",
      "expo-font",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-firebase/crashlytics",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      [
        "expo-splash-screen",
        {
          image: splashImage,
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
  };
};

// Dynamically configure the app based on the environment.
export const getDynamicAppConfig = (environment: EnvironnementType) => {
  if (environment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      splashImage: SPLASH_IMAGE,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
      googleServicesFileAndroid: GOOGLE_SERVICE_FILE_ANDROID,
      googleServicesFileIOS: GOOGLE_SERVICE_FILE_IOS,
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      splashImage: "./assets/images/splash-icon.png",
      icon: "./assets/images/icon.png",
      adaptiveIcon: "./assets/images/adaptive-icon.png",
      scheme: `${SCHEME}-prev`,
      googleServicesFileAndroid: "./configs/google-services.json",
      googleServicesFileIOS: "./configs/GoogleService-Info.plist",
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    splashImage: "./assets/images/splash-icon.png",
    icon: "./assets/images/icon.png",
    adaptiveIcon: "./assets/images/adaptive-icon.png",
    scheme: `${SCHEME}-dev`,
    googleServicesFileAndroid: "./configs/google-services.json",
    googleServicesFileIOS: "./configs/GoogleService-Info.plist",
  };
};
