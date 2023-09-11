"use client";

import { useState } from "react";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import { firebaseApp } from "@/lib/firebase";
import Link from "next/link";
import Image from "@/components/Image/Image";
import NextImage from "next/image";
import { AiOutlineCheck } from "react-icons/ai";

interface GalleryProps {
  groupedImages: Record<string, string[]>;
  session: any;
  // fetchUpdatedData: () => Promise<Record<string, string[]>>;
}

const storage = getStorage(firebaseApp);

const Gallery: React.FC<GalleryProps> = ({
  groupedImages: initialGroupedImages,
  session,
  // fetchUpdatedData,
}) => {
  const [selectedImages, setSelectedImages] = useState<
    Record<string, string[]>
  >({});
  const [selecting, setSelecting] = useState(false);
  const [groupedImages, setGroupedImages] = useState(initialGroupedImages);

  const toggleSelection = (label: any, url: any) => {
    setSelectedImages((prev) => {
      const newSelection = { ...prev };
      if (newSelection[label]?.includes(url)) {
        newSelection[label] = newSelection[label].filter(
          (item) => item !== url
        );
      } else {
        newSelection[label] = newSelection[label] || [];
        newSelection[label].push(url);
      }
      return newSelection;
    });
  };

  const deleteSelectedImages = async () => {
    for (const [label, urls] of Object.entries(selectedImages)) {
      for (const url of urls) {
        // Get the reference of the file from the URL and delete it
        const fileRef = ref(storage, url);
        await deleteObject(fileRef);
      }
      // Check if the subfolder is empty and delete it
      // const folderRef = ref(storage, `images/${session?.user?.id}/${label}`);
      // const folderRes = await listAll(folderRef);
      // if (folderRes.items.length === 0 && label !== "unlabeled") {
      //   await deleteObject(folderRef);
      // }
    }
    // setRefreshKey((prevKey) => prevKey + 1);
    setSelecting(false);
    setSelectedImages({});

    // const updatedGroupedImages = await fetchUpdatedData();
    // setGroupedImages(updatedGroupedImages);
    // refresh page
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <p className="text-4xl font-light">Gallery</p>
        {selecting ? (
          <div className="flex items-center gap-x-4">
            <button
              className="px-6 py-2 text-white bg-red-500 hover:bg-red-600 transition-all rounded-lg"
              onClick={deleteSelectedImages}
            >
              Delete Selected Images
            </button>
            <button
              className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded-lg"
              onClick={() => {
                setSelecting(false);
                setSelectedImages({});
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded-lg"
            onClick={() => setSelecting(true)}
          >
            Select
          </button>
        )}
      </div>
      {Object.keys(groupedImages).length > 0 ? (
        Object.entries(groupedImages).map(([label, urls]) => (
          <div key={label}>
            <p className="text-2xl">{label}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {urls.map((url, index) => (
                <div
                  key={index}
                  className="relative min-w-[200px] h-[150px]"
                  onClick={() => {
                    if (selecting) {
                      toggleSelection(label, url);
                    }
                  }}
                >
                  <Image url={url} alt={"Description"} />
                  {selectedImages[label]?.includes(url) && (
                    <div className="absolute inset-0 bg-white opacity-50" />
                  )}
                  {selecting && selectedImages[label]?.includes(url) && (
                    <div
                      className="absolute bottom-2 right-2 w-6 h-6 rounded-full border border-white flex items-center justify-center 
                        bg-blue-500"
                    >
                      <AiOutlineCheck
                        size={12}
                        className="border-white text-white stroke-2"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
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

export default Gallery;
