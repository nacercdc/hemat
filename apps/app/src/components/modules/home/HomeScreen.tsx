import React from "react";
import { View, Text } from "@e-market/rn-ui-components";
import { useGetLanguages } from "~/hooks/rn-firebase/example.hooks";

export default function HomeScreen() {
  const { data } = useGetLanguages();
  console.log(data, "data");

  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
}
