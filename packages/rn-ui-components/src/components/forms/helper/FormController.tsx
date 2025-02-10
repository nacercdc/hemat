import React from "react";
import { View } from "react-native";
import { Text } from "../../presentations/text/Text";

interface Props {
  caption?: string;
  errorMessage?: string;
  children: React.ReactNode;
}
export const FormController = ({ children, caption, errorMessage }: Props) => {
  return (
    <View className="flex flex-col gap-1">
      {children}
      {errorMessage && (
        <Text className="text-sm text-destructive">{errorMessage}</Text>
      )}
      {!errorMessage && caption && (
        <Text className="text-xs text-foreground/50 ">{caption}</Text>
      )}
    </View>
  );
};
