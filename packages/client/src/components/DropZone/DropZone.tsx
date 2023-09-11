"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatBytes } from "@/utils/formatBytes";
import { AiOutlineCheck } from "react-icons/ai";
import { BiSolidTrashAlt } from "react-icons/bi";
import { TextInput } from "@mantine/core";

const maxSize = 1024 * 1024 * 10; // 10MB
const maxFiles = 20;
const acceptedFileTypes = {
  "image/*": ["jpeg", "png", "gif", "bmp"],
};

type Props = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  fileNameToPatientMap: Record<string, string>;
  setFileNameToPatientMap: Dispatch<SetStateAction<Record<string, string>>>;
};

export default function Dropzone({
  files,
  setFiles,
  fileNameToPatientMap,
  setFileNameToPatientMap,
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

      setFileNameToPatientMap((prev) => {
        const newMap = { ...prev };
        acceptedFiles.forEach((file) => {
          newMap[file.name] = "";
        });
        return newMap;
      });
    },
  });

  const listedFiles = acceptedFiles.map((file, index) => (
    <li key={file.name} className="flex items-center justify-between w-full">
      <div className="flex items-center gap-x-4">
        <AiOutlineCheck size={20} />
        <p className="flex-shrink-0">
          {file.name} - {formatBytes(file.size)} bytes
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <TextInput
          className="w-1/4 md:w-[400px]"
          placeholder="Patient Name"
          value={fileNameToPatientMap[file.name]}
          onChange={(e) => {
            setFileNameToPatientMap((prev) => ({
              ...prev,
              [file.name]: e.target.value,
            }));
          }}
        />
        <button
          className="cursor-pointer hover:opacity-80 transition-all opacity-100"
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
          w-full h-[400px] cursor-pointer border-2 rounded-md flex flex-col justify-center items-center bg-opacity-20 transition-all duration-200 ease-in-out 
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
        <p className="text-2xl">
          Drag and drop some files here, or click to select files
        </p>
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
          <ul className="w-full px-8 flex flex-col gap-y-2">{listedFiles}</ul>
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
