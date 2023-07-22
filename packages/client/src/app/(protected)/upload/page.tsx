"use client";

import React, { useState } from "react";
import Dropzone from "@/components/DropZone/DropZone";
import { useSession } from "next-auth/react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { Loader } from "@mantine/core";
import { firebaseApp } from "@/lib/firebase";

const Upload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { data } = useSession();

  const upload = async () => {
    if (uploading || files.length === 0) {
      return;
    }

    setUploading(true);
    const userId = data?.user?.email?.replace(/\./g, "_");

    // Upload each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const storage = getStorage(firebaseApp);

      const imagesRef = ref(storage, `images/${userId}/${file.name}`);

      try {
        uploadBytes(imagesRef, file).then((snapshot) => {
          console.log(`Uploaded ${file.name}`);
        });
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }
    setUploading(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-y-4">
      <p className="text-2xl">Upload Pictures</p>
      <Dropzone files={files} setFiles={setFiles} />
      <button
        className={`text-xl px-8 py-2 rounded-md bg-blue-500 text-white transition-all hover:bg-blue-700 flex items-center justify-center gap-x-4 relative ${
          uploading
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100 cursor-pointer"
        }`}
        onClick={upload}
      >
        {uploading && (
          <Loader
            color="rgba(255, 255, 255, 1)"
            size="sm"
            className="absolute left-4"
          />
        )}
        <p>Upload</p>
      </button>
    </div>
  );
};

export default Upload;
