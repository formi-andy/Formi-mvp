"use client";

import { useState } from "react";
import Dropzone from "@/components/DropZone/DropZone";
import { Loader } from "@mantine/core";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAuth } from "@clerk/nextjs";

const Upload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState<
    {
      file: File;
      title: string;
      patientId?: string;
    }[]
  >([]);
  const user = useAuth();
  const toast = useNetworkToasts();

  const upload = async () => {
    if (uploading || files.length === 0) {
      return;
    }

    try {
      toast.loading({ title: "Uploading images", message: "Please wait" });
      setUploading(true);
      const userId = user.userId;
      let promises: Promise<Response>[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // const patientName = fileNameToPatientMap[file.name] || "Unlabeled";
        const sendImageUrl = new URL(
          `${
            process.env.NEXT_PUBLIC_CONVEX_SITE_URL
          }/send-image?userId=${userId}&patientName=${""}&title=${
            uploadData[i].title
          }`
        );
        promises.push(
          fetch(sendImageUrl, {
            method: "POST",
            headers: { "Content-Type": file!.type },
            body: file,
          })
        );
      }
      await Promise.all(promises);
      toast.success({
        title: "Successfully uploaded images",
        message: "Visit the dashboard to view your images",
      });
      setFiles([]);
    } catch (error) {
      // console.log("error", error);
      toast.error({
        title: "Error uploading images",
        message: "Please try again later",
      });
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
        uploadData={uploadData}
        setUploadData={setUploadData}
      />
      <button
        disabled={uploading || files.length === 0}
        className={
          "w-fit disabled:cursor-not-allowed disabled:bg-gray-300 text-xl px-8 py-2 rounded-md bg-blue-500 text-white transition-all hover:bg-blue-700 flex items-center justify-center gap-x-4"
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
