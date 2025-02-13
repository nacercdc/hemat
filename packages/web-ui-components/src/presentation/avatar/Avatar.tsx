import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn-ui";

interface Props {
  src: string;
  alt: string;
  fallback: string;
}

export function Avatar({ src, alt, fallback }: Props) {
  return (
    <ShadcnAvatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </ShadcnAvatar>
  );
}
