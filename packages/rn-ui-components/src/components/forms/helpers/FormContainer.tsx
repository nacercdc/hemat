import React from "react";
import { View } from "react-native";
import{Text} from "../../presentations/text/Text"

interface Props {
  children: React.ReactNode;
  errorMessage?: string;
}
export const FormContainer = ({
  children,
  errorMessage,
}: Props) => {
  return (
    <View className="flex flex-col gap-1">
      {children}
      {errorMessage && (
        <Text className="text-sm text-destructive">{errorMessage}</Text>
      )}
    </View>
  );
};

