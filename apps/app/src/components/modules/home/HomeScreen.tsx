import { View, Text, SafeAreaView } from "react-native";
import React from "react";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View className="flex gap-5 px-6 justify-center items-center w-full h-screen">
        <Text>Expo starter from yarn monorepo start</Text>
        <Text>@e-market Software PLC.</Text>
      </View>
    </SafeAreaView>
  );
}
