"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatBytes } from "@/utils/formatBytes";
import { AiOutlineCheck } from "react-icons/ai";
import { BiSolidTrashAlt } from "react-icons/bi";
import { TextInput } from "@mantine/core";

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
      <div className="flex w-full items-center gap-x-2 md:gap-x-4">
        <AiOutlineCheck size={20} className="min-w-[20px]" />
        <p className="truncate">
          {data.file.name} - {formatBytes(data.file.size)} bytes
        </p>
      </div>
      <div className="flex w-full items-center gap-x-4">
        <TextInput
          className="w-full"
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
        <TextInput
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
        />
        <button
          className="border hover:border-red-600 rounded cursor-pointer hover:text-red-600 hover:bg-red-50 w-9 h-9 min-w-[36px] flex items-center justify-center transition"
          onClick={() => {
            setFiles((prev) => prev.filter((_, i) => i !== index));
          }}
        >
          <BiSolidTrashAlt size={20} />
        </button>
      </div>
    </li>
  ));

  return (
    <div className="flex flex-col h-full items-center gap-y-4">
      <div
        {...getRootProps()}
        className={`
          px-4 md:px-8 w-full h-[400px] cursor-pointer border-2 rounded-md flex flex-col justify-center items-center bg-opacity-20 transition-all duration-200 ease-in-out 
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
        <p className="text-2xl text-center">
          Drag and drop some files here, or click to select files
        </p>
        <em className="text-center text-sm">
          Only *.jpeg, *.png, and *.webp images will be accepted
        </em>
        <div className="h-5 transition-opacity duration-200 ease-in-out">
          {isDragAccept && (
            <p className="text-green-500 opacity-100">
              All files will be accepted
            </p>
          )}
          {!isDragAccept && (
            <p className="opacity-0">All files will be accepted</p>
          )}
          {isDragReject && (
            <p className="text-red-500 opacity-100">
              Some files will be rejected
            </p>
          )}
          {!isDragReject && (
            <p className="opacity-0">Some files will be rejected</p>
          )}
        </div>
      </div>
      {files.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-y-2 w-full">
          <p className="text-xl">Accepted Files</p>
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
    </div>
  );
}
