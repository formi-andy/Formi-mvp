import {
  getStorage,
  ref,
  list,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { firebaseApp } from "@/lib/firebase";
import { authOptions } from "@/lib/auth";
import Image from "@/components/Image/Image";
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
    <div className="block">
      <div className="flex flex-col gap-y-4">
        <p className="text-4xl font-light">Gallery</p>
        <div>
          <div className="grid-auto-fill gap-4">
            {urls.map((url, index) => (
              <div key={index} className="relative min-w-[200px] h-[150px]">
                <Image url={url} alt={"Description"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
