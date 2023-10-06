"use client";
import { Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { formatBytes } from "@/utils/formatBytes";
import { TextInput } from "@mantine/core";
import { Button } from "../ui/button";
import { LuTrash } from "react-icons/lu";

const maxSize = 1024 * 1024 * 5; // 5MB
const maxFiles = 20;
const acceptedFileTypes = {
  "image/png": [".png"],
  "image/jpeg": [".jpeg", ".jpg"],
  "image/webp": [".webp"],
};

type Props = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  uploadData: {
    file: File;
    title: string;
    patientId?: string;
  }[];
  setUploadData: Dispatch<
    SetStateAction<
      {
        file: File;
        title: string;
        patientId?: string;
      }[]
    >
  >;
};

export default function Dropzone({
  files,
  setFiles,
  uploadData,
  setUploadData,
}: Props) {
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    accept: acceptedFileTypes,
    maxSize: maxSize,
    maxFiles: maxFiles,
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);

      setUploadData((prev) => {
        const parsedFiles = acceptedFiles.map((file) => ({
          file,
          title: file.name,
          patientId: "",
        }));
        return [...prev, ...parsedFiles];
      });
    },
  });

  const listedFiles = uploadData.map((data, index) => (
    <li key={data.file.name} className="flex flex-col gap-y-2 w-full">
      <p className="truncate">
        {data.file.name} - {formatBytes(data.file.size)} bytes
      </p>
      <div className="flex w-full items-center gap-x-4">
        <TextInput
          className="flex-1"
          placeholder="Title"
          value={data.title}
          onChange={(e) => {
            setUploadData((prev) => {
              const newData = [...prev];
              newData[index].title = e.target.value;
              return newData;
            });
          }}
        />
        {/* <TextInput
          className="w-2/5 max-w-[400px]"
          placeholder="Patient"
          value={data.patientId}
          onChange={(e) => {
            setUploadData((prev) => {
              const newData = [...prev];
              newData[index].title = e.target.value;
              return newData;
            });
          }}
        /> */}
        <Button
          variant="outline-danger"
          size="icon"
          onClick={() => {
            setFiles((prev) => prev.filter((_, i) => i !== index));
          }}
        >
          <LuTrash size={20} />
        </Button>
      </div>
    </li>
  ));

  return (
    <>
      <div
        {...getRootProps()}
        className={`
          w-full h-80 rounded-t-lg cursor-pointer flex flex-col justify-center items-center bg-opacity-20 transition-all duration-200 ease-in-out 
          ${isDragAccept ? "border-green-500 bg-green-100" : ""} 
          ${isDragReject ? "border-red-500 bg-red-100" : ""} 
          ${
            !isDragAccept && !isDragReject
              ? "border-slate-200 border-opacity-50"
              : ""
          }
        `}
      >
        <input {...getInputProps()} />
        <p className="text-2xl font-medium text-center">
          Drag and drop some files here, or click to select files
        </p>
        <em className="text-center text-sm max-w-[380px]">
          Only *.jpeg, *.png, and *.webp images will be accepted. Max file size
          is 5MB.
        </em>
      </div>
      {files.length > 0 && (
        <div className="flex flex-col p-4 justify-center gap-y-2 w-full">
          <p className="text-xl font-medium">Accepted Files</p>
          <ul className="w-full flex flex-col gap-y-2">{listedFiles}</ul>
        </div>
      )}
      {fileRejections.length > 0 && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl text-red-500">Rejected Files</p>
          {fileRejections.map(({ file, errors }) => {
            if (errors[0].code === "file-too-large") {
              errors[0].message = "File is too large";
            }
            return (
              <div key={file.name}>
                <p>
                  {file.name} - {errors[0].message}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
