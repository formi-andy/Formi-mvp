import {
  getStorage,
  ref,
  list,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { firebaseApp } from "@/lib/firebase";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "@/components/Image/Image";
import NextImage from "next/image";
import { getServerSession } from "next-auth";

const storage = getStorage(firebaseApp);

const View = async () => {
  const session = await getServerSession(authOptions);
  const imagesRef = ref(storage, `images/${session?.user?.id}`);

  const res = await list(imagesRef);

  let promises = res.items.map((itemRef: StorageReference) =>
    getDownloadURL(itemRef)
  );

  let urls = await Promise.all(promises);

  return (
    <div className="flex flex-col gap-y-4">
      <p className="text-4xl font-light">Gallery</p>
      {urls.length > 0 ? (
        <div className="grid-auto-fill gap-4">
          {urls.map((url, index) => (
            <div key={index} className="relative min-w-[200px] h-[150px]">
              <Image url={url} alt={"Description"} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-y-8 items-center h-[calc(100vh_-_160px)] justify-center">
          <div>
            <div className="relative flex h-[200px] justify-center mb-4">
              <NextImage
                src="/assets/undraw_images.svg"
                fill={true}
                className="w-full h-full"
                alt="No Images Found"
              />
            </div>
            <p className="text-3xl font-extralight">No images uploaded yet</p>
          </div>
          <Link
            href="/record"
            className="flex w-fit items-center gap-x-2 text-2xl font-extralight hover:underline"
          >
            Join a meeting to start recording
          </Link>
          <Link
            href="/upload"
            className="flex w-fit items-center gap-x-2 text-2xl font-extralight hover:underline"
          >
            Already have images? Upload them here
          </Link>
        </div>
      )}
    </div>
  );
};

export default View;
