import { SafeAreaView } from "react-native";
import React from "react";
import { View, Text } from "@e-market/rn-ui-components";
import useGetLanguages from "~/hooks/rn-firebase/example.hooks";

export default function HomeScreen() {
  const { data } = useGetLanguages();
  console.log(data, "data....");

  return (
    <SafeAreaView>
      <View className="flex gap-5 px-6 w-full h-screen">
        <Text>Expo starter from yarn monorepo start</Text>
        <Text>@e-market Software PLC.</Text>
      </View>
    </SafeAreaView>
  );
}
