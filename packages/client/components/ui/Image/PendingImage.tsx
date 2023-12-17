import { LuX } from "react-icons/lu";
import Image from "./Image";

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
  return (
    <div className="relative w-full group">
      <Image url={url} alt={alt} />
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
