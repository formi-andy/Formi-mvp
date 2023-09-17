import Link from "next/link";
import Image from "next/image";

export default function NoImages() {
  return (
    <div className="flex flex-col gap-y-8 items-center h-[calc(100vh_-_160px)] justify-center">
      <div>
        <div className="relative flex h-[200px] justify-center mb-4">
          <Image
            src="/assets/undraw_images.svg"
            fill={true}
            className="w-full h-full"
            alt="No Images Found"
          />
        </div>
        <p className="text-3xl font-light">No images uploaded yet</p>
      </div>
      <Link
        href="/record"
        className="flex w-fit text-blue-500 items-center gap-x-2 text-2xl font-light hover:underline"
      >
        Join a meeting to start recording
      </Link>
      <Link
        href="/upload"
        className="flex w-fit text-blue-500 items-center gap-x-2 text-2xl font-light hover:underline"
      >
        Already have images? Upload them here
      </Link>
    </div>
  );
}
