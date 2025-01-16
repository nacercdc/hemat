import type { FontSource } from "expo-font";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../styles.css";
import MainLayout from "~/components/layouts/MainLayout";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono:
      require("../../assets/fonts/SpaceMono-Regular.ttf") as FontSource,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <MainLayout>
      <Slot />
    </MainLayout>
  );
}
