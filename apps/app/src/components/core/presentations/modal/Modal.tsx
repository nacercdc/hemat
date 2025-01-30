import type { ModalProps } from "@ui-kitten/components";
import {
  StyleService,
  Modal as UKModal,
  useTheme,
} from "@ui-kitten/components";
import { omit } from "~/utils/object";
type Props = Omit<ModalProps, "className" | "style" | "backdropStyle">;
export default function Modal(props: Props) {
  const { backdrop } = useStyle();
  return (
    <UKModal
      {...omit(props as ModalProps, "className", "style", "backdropStyle")}
      backdropStyle={backdrop}
    />
  );
}

const useStyle = () => {
  const theme = useTheme();
  return StyleService.create({
    backdrop: {
      backgroundColor: theme["color-backdrop"],
      flex: 1,
    },
  });
};
