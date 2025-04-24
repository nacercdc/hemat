import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";

type Size = "sm" | "md" | "lg";
const sizesClasses: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-20 w-20",
};

interface Props {
  src: string;
  alt: string;
  fallback: string;
  size?: Size;
}

export function Avatar({ src, alt, fallback, size = "md" }: Props) {
  return (
    <ShadcnAvatar className={cn(sizesClasses[size])}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-secondary text-white font-bold">
        {fallback}
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
