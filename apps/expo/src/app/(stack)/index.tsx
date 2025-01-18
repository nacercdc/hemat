import { View, Text, Button } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useGetLanguages from "~/lib/firestore/hooks/language.hooks";

export default function Index() {
  const { data, ...state } = useGetLanguages();

  console.log(data, "data", state.hasNextPage);
  const handleFetchNext = () => {
    state.fetchNextPage();
  };
  return (
    <SafeAreaView>
      <View className="flex gap-5 justify-center items-center w-full h-screen">
        <Text className="text-2xl text-gray-600">
          Expo starter from yarn monorepo start
        </Text>
        <Button title="Load" onPress={handleFetchNext} />
        <Text className="text-3xl text-gray-400">@ETM Software PLC.</Text>
      </View>
    </SafeAreaView>
  );
}
