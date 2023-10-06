"use client";

import { useState } from "react";
import Image from "@/components/Image/Image";
import { useMutation, useQuery } from "convex/react";
import { Skeleton } from "antd";
import dayjs from "dayjs";
import Link from "next/link";

import { AiOutlineCheck } from "react-icons/ai";
import NoImages from "./NoImages";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GALLERY_LOADERS } from "@/commons/constants/loaders";
import useNetworkToasts from "@/hooks/useNetworkToasts";

const Gallery: React.FC = () => {
  let images = useQuery(api.images.listImages, {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const deleteMutation = useMutation(api.images.deleteImages);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selecting, setSelecting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toast = useNetworkToasts();

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

  const deleteImages = async () => {
    try {
      setDeleting(true);
      toast.loading({
        title: "Deleting images...",
        message: "Please be patient",
      });

      // cast to Id<"images">[] to make TS happy
      await deleteMutation({
        ids: selectedImages as Id<"images">[],
      });
      toast.success({
        title: "Images deleted",
        message: "Please refresh the page",
      });
      setSelectedImages([]);
      setSelecting(false);
    } catch (e) {
      console.log(e);
      toast.error({
        title: "Error deleting images",
        message: "Please try again later",
      });
    } finally {
      setDeleting(false);
    }
  };

  const renderImages = () => {
    if (images === undefined) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {[...Array(GALLERY_LOADERS)].map((_, index) => {
            return (
              <div
                key={index}
                className="min-w-[200px] aspect-square h-fit z-100"
              >
                <Skeleton.Button
                  active
                  className="!w-full !h-full min-h-[200px]"
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

    return images.map(({ date, images }) => {
      return (
        <div key={date} className="flex flex-col gap-y-2">
          <p className="text-xl md:text-2xl font-medium">
            {dayjs(date).format("M/DD/YYYY")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {images.map((image) => {
              return (
                <div
                  className="flex flex-col relative cursor-pointer"
                  key={image._id}
                >
                  <div
                    className={`${!selecting && "pointer-events-none"}`}
                    onClick={() => {
                      if (selecting) {
                        toggleSelection(image._id);
                      }
                    }}
                  >
                    <div className="relative min-w-[200px] min-h-[200px] aspect-square">
                      <Image url={image.url} alt={"Description"} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-lg truncate">
                        {image.title || "Image"}
                      </p>
                      <p className="text-sm">
                        {dayjs(image._creationTime).format("M/DD/YYYY")}
                      </p>
                    </div>
                    {selectedImages.includes(image._id) && (
                      <div className="absolute inset-0 bg-white opacity-50 h-full" />
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
                  {!selecting && (
                    <Link
                      className="h-full w-full absolute"
                      href={`/image/${image._id}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-medium">Gallery</p>
        {selecting ? (
          <div className="flex items-center gap-x-4">
            <button
              className="px-6 py-2 text-white bg-red-500 hover:bg-red-600 transition-all rounded-lg"
              onClick={deleteImages}
              disabled={deleting}
            >
              Delete Selected Images
            </button>
            <button
              disabled={deleting}
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
    </>
  );
};

export default Gallery;
