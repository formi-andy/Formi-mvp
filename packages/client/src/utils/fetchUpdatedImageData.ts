import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { firebaseApp } from "@/lib/firebase";

export default async function fetchUpdatedData(session: any) {
  const storage = getStorage(firebaseApp);
  const imagesRef = ref(storage, `images/${session?.user?.id}`);

  const res = await listAll(imagesRef);

  let groupedImages = {
    unlabeled: [] as string[],
  };

  let promises = res.items.map((itemRef) =>
    getDownloadURL(itemRef).then((url) => {
      groupedImages.unlabeled.push(url);
    })
  );

  for (const prefix of res.prefixes) {
    const subRes = await listAll(prefix);
    const label =
      prefix.name.toLowerCase() === "unlabeled" ? "unlabeled" : prefix.name;
    groupedImages[label] = groupedImages[label] || [];

    const subPromises = subRes.items.map((itemRef) =>
      getDownloadURL(itemRef).then((url) => {
        groupedImages[label].push(url);
      })
    );
    promises = promises.concat(subPromises);
  }

  await Promise.all(promises);

  return groupedImages;
}
