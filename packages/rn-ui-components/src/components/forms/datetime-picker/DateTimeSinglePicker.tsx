import { COLORS } from "@etm/nativewindui-theme-config/colors";
import { omit } from "@etm/utilities";
import DTPDateTimePicker from "react-native-ui-datepicker";
import type { DatePickerSingleProps } from "react-native-ui-datepicker/lib/typescript/DateTimePicker";
import { View } from "../../presentations/view/View";
import { useState } from "react";
import { Modal } from "../../popups/modal/Modal";
import { TextField } from "../textfield";
interface Props
  extends Omit<
    DatePickerSingleProps,
    "selectedItemColor" | "headerButtonColor" | "mode"
  > {
  fontFamily: string;
  children?: React.ReactNode;
  leftView?: React.ReactNode;
  rightView?: React.ReactNode;
  label?: string;
  errorMessage?: string;
  materialVariant?: "outlined" | "filled";
  placeholder?: string;
  editable?: boolean;
  onClearText?: () => void;
}
export const DateTimeSinglePicker = ({
  fontFamily,
  calendarTextStyle,
  headerTextStyle,
  leftView,
  rightView,
  errorMessage,
  materialVariant,
  placeholder = "Select date",
  editable = true,
  label,
  date,
  onChange,
  onClearText,
  ...props
}: Props) => {
  const [visible, setVisible] = useState(false);
  const onOpenModalHandler = () => {
    setVisible(true);
  };

  const onCloseModalHandler = () => {
    setVisible(false);
  };

  return (
    <>
      <TextField
        label={label}
        value={date?.toString() ?? ""}
        editable={editable}
        placeholder={placeholder}
        rightView={rightView}
        leftView={leftView}
        errorMessage={errorMessage}
        materialVariant={materialVariant}
        caretHidden
        showSoftInputOnFocus={false}
        onPress={onOpenModalHandler}
        onClearText={onClearText}
      />
      <Modal
        isVisible={visible}
        onBackButtonPress={onCloseModalHandler}
        onBackdropPress={onCloseModalHandler}
      >
        <View className="bg-background p-6 rounded-lg">
          <DTPDateTimePicker
            {...omit(
              props as Record<string, unknown>,
              "selectedItemColor",
              "headerButtonColor",
              "mode"
            )}
            mode="single"
            date={date}
            onChange={(v) => {
              onChange?.(v);
              onCloseModalHandler();
            }}
            calendarTextStyle={{
              fontFamily,
              ...calendarTextStyle,
            }}
            headerTextStyle={{ fontFamily, ...headerTextStyle }}
            selectedItemColor={COLORS.light.primary}
            headerButtonColor={COLORS.light.primary}
          />
        </View>
      </Modal>
    </>
  );
};
