import Link from "next/link";
import Image from "next/image";

export default function NoCases() {
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
        <p className="text-3xl font-light">No cases created yet</p>
      </div>
      <Link
        href="/record"
        className="flex w-fit text-blue-500 items-center gap-x-2 text-2xl font-light hover:underline"
      >
        Click here to create a case
      </Link>
    </div>
  );
}
