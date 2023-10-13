"use client";
import { useDropzone } from "react-dropzone";

const maxSize = 1024 * 1024 * 5; // 5MB
const maxFiles = 20;
const acceptedFileTypes = {
  "image/png": [".png"],
  "image/jpeg": [".jpeg", ".jpg"],
  "image/webp": [".webp"],
};

type Props = {
  data: {
    file: File;
    title: string;
  }[];
  setData: (
    data: {
      file: File;
      title: string;
    }[]
  ) => void;
};

export default function Dropzone({ data, setData }: Props) {
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
      const parsedFiles = acceptedFiles.map((file) => ({
        file,
        title: file.name,
      }));
      setData([...data, ...parsedFiles]);
    },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`
          w-full h-full min-h-[20rem] rounded-t-lg cursor-pointer flex flex-col justify-center items-center bg-opacity-20 transition-all duration-200 ease-in-out p-4 
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
