"use client";

import { useState } from "react";
import Dropzone from "@/components/DropZone/DropZone";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

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
      const token = await user.getToken({
        template: "convex",
      });
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
          new Promise(async (resolve, reject) => {
            try {
              const res = await fetch(sendImageUrl, {
                method: "POST",
                headers: {
                  "Content-Type": file!.type,
                  Authorization: `Bearer ${token}`,
                },
                body: file,
              });

              const data = await res.json();

              await axios.post(
                `/api/scale?patientId=${data.patientId}&storageId=${data.storageId}&title=${uploadData[i].title}`,
                file
              );

              resolve(res);
            } catch (error) {
              reject(error);
            }
          })
        );
      }
      await Promise.all(promises);
      toast.success({
        title: "Successfully uploaded images",
        message: "Visit the dashboard to view your images",
      });
      setFiles([]);
      setUploadData([]);
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
    <>
      <p className="text-2xl pb-12 sm:pb-20 lg:pb-24 font-medium">
        Upload Pictures
      </p>
      <div className="w-full h-full flex flex-col items-center">
        <div className="relative gap-y-4 divide-y flex flex-col items-center max-w-2xl w-full rounded-lg shadow-accent-2">
          <Dropzone
            files={files}
            setFiles={setFiles}
            uploadData={uploadData}
            setUploadData={setUploadData}
          />
          <div className="py-4 rounded-b-lg bg-neutral-50 w-full flex justify-center items-center">
            <button
              disabled={uploading || files.length === 0}
              className={
                "w-fit disabled:cursor-not-allowed disabled:bg-gray-200 text-lg px-6 py-2 rounded-lg bg-blue-500 text-white disabled:text-gray-400 transition-all hover:bg-blue-600 flex items-center justify-center gap-x-4"
              }
              onClick={upload}
            >
              <p>Upload</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;
