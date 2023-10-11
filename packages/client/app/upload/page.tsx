"use client";

import { useState } from "react";
import Dropzone from "@/components/DropZone/DropZone";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Upload = () => {
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
    if (uploading || uploadData.length === 0) {
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
      for (let i = 0; i < uploadData.length; i++) {
        const file = uploadData[i].file;
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
            data={uploadData}
            setData={setUploadData}
          />
          <div className="py-4 rounded-b-lg bg-zinc-50 w-full flex justify-center items-center">
            <Button
              variant="action"
              disabled={uploading || uploadData.length === 0}
              className="px-6"
              onClick={upload}
            >
              <p>Upload</p>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;
