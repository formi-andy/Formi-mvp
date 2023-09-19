"use client";

import { useState } from "react";
import Image from "@/components/Image/Image";
import { AiOutlineCheck } from "react-icons/ai";
import NoImages from "./NoImages";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Skeleton } from "antd";
import { GALLERY_LOADERS } from "@/commons/constants/loaders";

const Gallery: React.FC = () => {
  let images = useQuery(api.images.listImages);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selecting, setSelecting] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedImages((prev) => {
      const newSelection = [...prev];
      if (newSelection.includes(id)) {
        newSelection.splice(newSelection.indexOf(id), 1);
      } else {
        newSelection.push(id);
      }
      return newSelection;
    });
  };

  const deleteSelectedImages = async () => {
    for (const storageId of selectedImages) {
      // await api.images.deleteImage(storageId);
    }
    setSelecting(false);
    setSelectedImages([]);
  };

  const renderImages = () => {
    if (images === undefined) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(GALLERY_LOADERS)].map((i) => {
            return (
              <div key={i} className="min-w-[200px] h-fit z-100">
                <Skeleton.Button
                  active
                  className="!w-full !h-full min-h-[150px]"
                />
              </div>
            );
          })}
        </div>
      );
    }

    if (images.length === 0) {
      return <NoImages />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => {
          return (
            <div
              className="flex flex-col"
              onClick={() => {
                if (selecting) {
                  toggleSelection(image._id);
                }
              }}
              key={image._id}
            >
              <div className="relative min-w-[200px] h-[150px]">
                <Image url={image.url} alt={"Description"} />
              </div>
              <div>{image.title}</div>
              {selectedImages.includes(image._id) && (
                <div className="absolute inset-0 bg-white opacity-50" />
              )}
              {selecting && selectedImages.includes(image._id) && (
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full border border-white flex items-center justify-center bg-blue-500">
                  <AiOutlineCheck
                    size={12}
                    className="border-white text-white stroke-2"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
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
                setSelectedImages([]);
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
      {renderImages()}
    </div>
  );
};

export default Gallery;
