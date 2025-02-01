import type { StyleProp, ViewStyle } from "react-native";
import type { AnimatedStyle } from "react-native-reanimated";
import React from "react";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { cn } from "@e-market/utilities";

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}
export default function AnimatedView({ children, className, style }: Props) {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutDown}
      className={cn(className)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
