import { useState } from "react";
import { Skeleton } from "antd";
import NextImage from "next/image";
import { LuX } from "react-icons/lu";

type Props = {
  url: string;
  alt: string;
  onIconClick?: () => void;
  icon?: React.ReactNode;
  overLay?: React.ReactNode;
};

export default function PendingImage({
  url,
  alt,
  onIconClick,
  icon = <LuX size={20} />,
  overLay,
}: Props) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full group">
      {loading && (
        <Skeleton.Button active className="w-full h-full absolute z-10" />
      )}
      <NextImage
        onLoad={() => setLoading(false)}
        src={url}
        alt={alt}
        fill={true}
        style={{ opacity: loading ? 0 : 1 }}
        className="rounded-lg object-cover"
      />
      <button
        className="absolute -top-3 -right-3 bg-black text-white rounded-full p-2 hidden group-hover:flex z-20"
        onClick={() => {
          if (onIconClick) {
            onIconClick();
          }
        }}
      >
        {icon}
      </button>
      {overLay}
    </div>
  );
}
