import { cn, Text, useColorScheme } from "@etm/rn-ui-components";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { IconProps } from "@roninoss/icons";
import { Icon } from "@roninoss/icons";
import { Stack, Tabs } from "expo-router";
import * as React from "react";
import type { PressableProps } from "react-native";
import { Platform, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { colors } = useColorScheme();
  return (
    <>
      <Stack.Screen options={{ title: "Tabs" }} />
      <Tabs
        tabBar={TAB_BAR}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarBadge: 3,
            tabBarIcon(props) {
              return <Icon name="home" {...props} size={27} />;
            },
          }}
        />
        <Tabs.Screen
          name="Category"
          options={{
            title: "Category",
            tabBarBadge: 3,
            tabBarIcon(props) {
              return <Icon name="cog" {...props} size={27} />;
            },
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon(props) {
              return <Icon name="account-circle" {...props} size={27} />;
            },
          }}
        />
      </Tabs>
    </>
  );
}

const TAB_BAR = Platform.select({
  ios: undefined,
  android: (props: BottomTabBarProps) => <MaterialTabBar {...props} />,
});

const TAB_ICON = {
  index: "home",
  Profile: "account-circle",
  Category: "cog",
} as const;

function MaterialTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingBottom: insets.bottom + 12,
      }}
      className="border-t-border/25 bg-card flex-row border-t pb-4 pt-3 dark:border-t-0"
    >
      {state.routes.map((route, index) => {
        const options = descriptors[route.key]?.options;

        const label =
          options?.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options?.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <MaterialTabItem
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options?.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            name={TAB_ICON[route.name as keyof typeof TAB_ICON]}
            isFocused={isFocused}
            badge={options?.tabBarBadge}
            label={
              typeof label === "function"
                ? label({
                    focused: isFocused,
                    color: isFocused ? colors.foreground : colors.grey2,
                    children: options?.title ?? route.name ?? "",
                    position: options?.tabBarLabelPosition ?? "below-icon",
                  })
                : label
            }
          />
        );
      })}
    </View>
  );
}

function MaterialTabItem({
  isFocused,
  name = "star",
  badge: _,
  className,
  label,
  ...pressableProps
}: {
  isFocused: boolean;
  name: IconProps<"material">["name"];
  label: string | React.ReactNode;
  badge?: number | string;
} & Omit<PressableProps, "children">) {
  const { colors } = useColorScheme();
  const isFocusedDerived = useDerivedValue(() => isFocused);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      transform: [
        {
          scaleX: withTiming(isFocusedDerived.value ? 1 : 0, { duration: 200 }),
        },
      ],
      opacity: withTiming(isFocusedDerived.value ? 1 : 0, { duration: 200 }),
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      borderRadius: 100,
    };
  });
  return (
    <Pressable
      className={cn("flex-1 items-center", className)}
      {...pressableProps}
    >
      <View className="h-12 w-24 items-center justify-center overflow-hidden rounded-full">
        <Animated.View
          style={animatedStyle}
          className="bg-primary/5 dark:bg-secondary"
        />
        <View className="flex flex-row items-center gap-2">
          <Icon
            ios={{ useMaterialIcon: true }}
            size={24}
            name={name}
            color={isFocused ? colors.primary : colors.grey2}
          />
          {isFocused && (
            <Text variant="caption2" className={cn("text-primary font-bold")}>
              {label}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
