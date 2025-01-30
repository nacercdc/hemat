import { View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useGetLanguages from "~/libs/rn-firestore/hooks/example.hooks";
import Text from "~/components/core/presentations/text/Text";

export default function Index() {
  const { data, ...state } = useGetLanguages();

  console.log(data, "data", state);

  return (
    <SafeAreaView>
      <View className="flex gap-5 px-6 justify-center items-center w-full h-screen">
        <Text>Expo starter from yarn monorepo start</Text>

        <Text>@ETM Software PLC.</Text>
      </View>
    </SafeAreaView>
  );
}
