import { DropzoneData } from "@/types/dropzone-types";

export const removeFileExtensions = (images: DropzoneData) => {
  const imagesWithoutFileExtensions = images.map((image) => {
    const split = image.title.split(".");
    split.pop();

    return {
      ...image,
      title: split.join("."),
    };
  });

  return imagesWithoutFileExtensions;
};
