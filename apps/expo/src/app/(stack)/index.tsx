import { View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useGetLanguages from "~/libs/rn-firestore/hooks/example.hooks";
import { Datepicker, Layout } from "@ui-kitten/components";
import Text from "~/components/core/presentations/text/Text";

export default function Index() {
  const { data, ...state } = useGetLanguages();

  const [date, setDate] = React.useState(new Date());
  console.log(data, "data", state);

  return (
    <SafeAreaView>
      <View className="flex gap-5 justify-center items-center w-full h-screen">
        <Text>Expo starter from yarn monorepo start</Text>
        <Layout level="1">
          <Text category="c2">
            {`Selected date: ${date.toLocaleDateString()}`}
          </Text>

          <Datepicker date={date} onSelect={(nextDate) => setDate(nextDate)} />
        </Layout>
        <Text>@ETM Software PLC.</Text>
      </View>
    </SafeAreaView>
  );
}
