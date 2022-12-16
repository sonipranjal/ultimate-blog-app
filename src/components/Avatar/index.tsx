import Image from "next/image";
import React from "react";

type AvatarSize = "s" | "m" | "l" | "full";

type AvatarProps = {
  size: AvatarSize;
  url?: string | null;
  alt?: string;
};

const SIZE_MAP: Record<AvatarSize, string> = {
  s: "w-16 h-16",
  m: "w-24 h-24",
  l: "w-32 h-32",
  full: "w-full h-full",
};

const Avatar = ({ size = "s", url, alt }: AvatarProps) => {
  return (
    <div
      className={`${SIZE_MAP[size]} relative rounded-full bg-gradient-to-br from-gray-100 via-slate-200 to-neutral-300 ring ring-white`}
    >
      {url && (
        <Image
          src={url}
          fill
          alt={alt ?? ""}
          className="rounded-full object-cover"
        />
      )}
    </div>
  );
};

export default Avatar;
