import React from "react";
import type { ModalProps } from "react-native-modal";
import RNModal from "react-native-modal";
import { View } from "../view";
import { COLORS } from "@e-market/nativewindui-theme-config/colors";
import { omit } from "@e-market/utilities";
type Props = Omit<
  Partial<ModalProps>,
  | "backdropColor"
  | "backdropOpacity"
  | "backdropTransitionOutTiming"
  | "coverScreen"
  | "deviceHeight"
  | "deviceWidth"
  | "supportedOrientations"
  | "customBackdrop"
  | "hideModalContentWhileAnimating"
  | "scrollHorizontal"
  | "useNativeDriver"
  | "propagateSwipe"
  | "statusBarTranslucent"
> &
  Pick<ModalProps, "children"> & {
    onClose?: () => void;
  };

export const Modal = ({
  animationIn,
  animationInTiming,
  animationOut,
  swipeThreshold,
  scrollOffsetMax,
  panResponderThreshold,
  animationOutTiming,
  avoidKeyboard,
  children,
  scrollTo,
  onModalHide,
  onModalShow,
  onModalWillHide,
  onModalWillShow,
  ...props
}: Props) => {
  return (
    <View className="rounded-lg p-6">
      <RNModal
        {...omit(
          props as Record<string, unknown>,
          "backdropColor",
          "backdropOpacity",
          "backdropTransitionOutTiming",
          "coverScreen",
          "deviceHeight",
          "deviceWidth",
          "supportedOrientations",
          "customBackdrop",
          "hideModalContentWhileAnimating",
          "scrollHorizontal",
          "useNativeDriver",
          "propagateSwipe",
          "statusBarTranslucent"
        )}
        animationIn={animationIn ?? "fadeIn"}
        animationInTiming={animationInTiming ?? 300}
        animationOut={animationOut ?? "fadeOut"}
        animationOutTiming={animationOutTiming ?? 300}
        avoidKeyboard={avoidKeyboard ?? false}
        backdropColor={COLORS.light.grey2}
        backdropOpacity={0.5}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={0}
        coverScreen
        deviceHeight={null}
        deviceWidth={null}
        supportedOrientations={["portrait", "landscape"]}
        customBackdrop={null}
        hasBackdrop
        hideModalContentWhileAnimating
        scrollHorizontal={false}
        statusBarTranslucent={false}
        useNativeDriver={false}
        propagateSwipe={false}
        swipeThreshold={swipeThreshold ?? 100}
        scrollTo={scrollTo ?? null}
        scrollOffset={swipeThreshold ?? 0}
        scrollOffsetMax={scrollOffsetMax ?? 0}
        panResponderThreshold={panResponderThreshold ?? 4}
        onModalHide={onModalHide ?? (() => null)}
        onModalShow={onModalShow ?? (() => null)}
        onModalWillHide={onModalWillHide ?? (() => null)}
        onModalWillShow={onModalWillShow ?? (() => null)}
      >
        {children}
      </RNModal>
    </View>
  );
};
