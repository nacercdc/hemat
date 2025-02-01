import { View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "~/components/core/presentations/text/Text";
import useGetLanguages from "~/hooks/rn-firebase/example.hooks";
export default function Index() {
  const { data, ...state } = useGetLanguages();
  console.log(data, state);

  return (
    <SafeAreaView>
      <View className="flex gap-5 px-6 justify-center items-center w-full h-screen">
        <Text>Expo starter from yarn monorepo start</Text>
        <Text>@e-market Software PLC.</Text>
      </View>
    </SafeAreaView>
  );
}
