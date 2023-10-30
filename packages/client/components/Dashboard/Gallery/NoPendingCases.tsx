import Link from "next/link";
import Image from "next/image";

export default function NoPendingCases() {
  return (
    <div className="flex flex-col gap-y-8 items-center h-[calc(100vh_-_160px)] justify-center">
      <div>
        <div className="relative flex h-[200px] justify-center mb-4">
          <Image
            src="/assets/undraw_images.svg"
            fill={true}
            className="w-full h-full"
            alt="No Cases Found"
          />
        </div>
        <p className="text-3xl font-light">
          No pending cases to review at the moment
        </p>
      </div>
    </div>
  );
}
