"use client";

import { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  list,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { firebaseApp } from "@/lib/firebase";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { AiFillFileImage } from "react-icons/ai";

const storage = getStorage(firebaseApp);

const View = () => {
  const [urls, setUrls] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState({
    url: "",
    name: "",
  });

  const { data } = useSession();

  const itemsPerPage = 10;
  const userId = data?.user?.email?.replace(/\./g, "_");

  useEffect(() => {
    const imagesRef = ref(storage, `images/${userId}`);

    list(imagesRef).then((res) => {
      let promises: Promise<string>[] = [];
      res.items.forEach((itemRef: StorageReference) => {
        promises.push(getDownloadURL(itemRef));
      });

      Promise.all(promises)
        .then((urls: string[]) => {
          setUrls(urls);
          setLoading(false);
        })
        .catch((error: Error) => {
          console.error("Failed to get download URLs", error);
          setLoading(false);
        });
    });
  }, [userId]);

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => prev - 1);
  };

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = urls.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="block">
      <div className="flex flex-col gap-y-4">
        <p className="text-4xl font-light">Gallery</p>
        <div>
          {loading ? (
            <div className="grid-auto-fill gap-4">
              {/* render 10 times */}
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  role="status"
                  className="flex items-center justify-center h-[150px] min-w-[200px] bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
                >
                  <AiFillFileImage size={24} />
                  <span className="sr-only">Loading...</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-auto-fill gap-4">
              {currentItems.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-w-1 aspect-h-1 min-w-[200px] h-[150px] group"
                >
                  <Image src={url} alt="Description" fill={true} />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedImage({
                        url,
                        name: url.split("/").pop() || "Image",
                      });
                      open();
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default View;
