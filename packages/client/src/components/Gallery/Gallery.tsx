"use client";

import { useState } from "react";
import Image from "@/components/Image/Image";
import { AiOutlineCheck } from "react-icons/ai";
import NoImages from "./NoImages";

interface GalleryProps {
  groupedImages: Record<string, string[]>;
}

const Gallery: React.FC<GalleryProps> = ({
  groupedImages: initialGroupedImages,
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
    }
    setSelecting(false);
    setSelectedImages({});

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
        <NoImages />
      )}
    </div>
  );
};

export default Gallery;
