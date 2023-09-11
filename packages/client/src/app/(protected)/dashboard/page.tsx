import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { firebaseApp } from "@/lib/firebase";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Gallery from "@/components/Gallery/Gallery";
import fetchUpdatedData from "@/utils/fetchUpdatedImageData";

const storage = getStorage(firebaseApp);

const View = async () => {
  const session = await getServerSession(authOptions);
  const imagesRef = ref(storage, `images/${session?.user?.id}`);

  const res = await listAll(imagesRef);

  let groupedImages = {
    unlabeled: [] as string[],
  };

  let promises = res.items.map((itemRef: StorageReference) =>
    getDownloadURL(itemRef).then((url) => {
      groupedImages.unlabeled.push(url);
    })
  );

  // Get URLs from subfolders
  for (const prefix of res.prefixes) {
    const subRes = await listAll(prefix);
    const label =
      prefix.name.toLowerCase() === "unlabeled" ? "unlabeled" : prefix.name;
    groupedImages[label] = groupedImages[label] || [];

    const subPromises = subRes.items.map((itemRef: StorageReference) =>
      getDownloadURL(itemRef).then((url) => {
        groupedImages[label].push(url);
      })
    );
    promises = promises.concat(subPromises);
  }

  await Promise.all(promises);
  // const groupedImages = await fetchUpdatedData(session);

  return (
    <Gallery
      groupedImages={groupedImages}
      session={session}
      // fetchUpdatedData={() => fetchUpdatedData(session)}
    />
  );

  // return <Gallery groupedImages={groupedImages} session={session} />;
};

export default View;
