import Image from "next/image";

interface AvatarProps {
  src: string;
  alt?: string;
  size?: number;
}

export default function Avatar({
  src,
  alt = "User Avatar",
  size = 32,
}: AvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ borderRadius: "50%", objectFit: "cover" }}
    />
  );
}
