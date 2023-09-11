"use client";

import React, { useState } from "react";
import Dropzone from "@/components/DropZone/DropZone";
import { useSession } from "next-auth/react";
import { UploadResult, getStorage, ref, uploadBytes } from "firebase/storage";
import { Loader } from "@mantine/core";
import { firebaseApp } from "@/lib/firebase";
import { message } from "antd";

const Upload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileNameToPatientMap, setFileNameToPatientMap] = useState<
    Record<string, string>
  >({});
  const { data } = useSession();

  const upload = async () => {
    if (uploading || files.length === 0) {
      return;
    }

    try {
      message.loading({ content: "Uploading images", key: "uploading" });
      setUploading(true);
      const userId = data?.user?.id;

      let promises: Promise<UploadResult>[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storage = getStorage(firebaseApp);

        const patientName = fileNameToPatientMap[file.name] || "Unlabeled";

        const imagesRef = ref(
          storage,
          `images/${userId}/${patientName}/${file.name}`
        );

        promises.push(uploadBytes(imagesRef, file));
      }

      await Promise.all(promises);
      message.success({
        content: "Successfully uploaded images",
        key: "uploading",
      });
    } catch (error) {
      // console.log("error", error);
      message.error({ content: "Failed to upload images", key: "uploading" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-y-4">
      <p className="text-2xl">Upload Pictures</p>
      <Dropzone
        files={files}
        setFiles={setFiles}
        fileNameToPatientMap={fileNameToPatientMap}
        setFileNameToPatientMap={setFileNameToPatientMap}
      />
      <button
        disabled={uploading || files.length === 0}
        className={
          "disabled:cursor-not-allowed disabled:bg-gray-300 text-xl px-8 py-2 rounded-md bg-blue-500 text-white transition-all hover:bg-blue-700 flex items-center justify-center gap-x-4 relative"
        }
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
