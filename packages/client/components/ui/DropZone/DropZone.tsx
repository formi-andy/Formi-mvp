"use client";
import { useDropzone } from "react-dropzone";
import { notifications } from "@mantine/notifications";

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
    onDrop: (acceptedFiles, fileRejections) => {
      let duplicateCount = 0;
      const parsedFiles = acceptedFiles
        .filter((file) => {
          const isDuplicate = data.some(
            (existingFile) =>
              existingFile.file.name === file.name &&
              existingFile.file.size === file.size &&
              existingFile.file.lastModified === file.lastModified
          );
          if (isDuplicate) {
            duplicateCount += 1;
          }
          return !isDuplicate;
        })
        .map((file) => ({
          file,
          title: file.name,
        }));

      setData([...data, ...parsedFiles]);

      if (duplicateCount > 0) {
        notifications.show({
          title: `${duplicateCount} ${
            duplicateCount === 1 ? "File" : "Files"
          } already uploaded`,
          message: "",
        });
      }

      if (acceptedFiles.length - duplicateCount > 0) {
        notifications.show({
          title: `${acceptedFiles.length - duplicateCount} ${
            acceptedFiles.length - duplicateCount === 1 ? "file" : "files "
          } uploaded successfully`,
          message: "",
          color: "green",
        });
      }

      if (fileRejections.length > 0) {
        notifications.show({
          title: `${fileRejections.length} ${
            fileRejections.length === 1 ? "file" : "files "
          } rejected`,
          message: "",
          color: "red",
        });
      }
    },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`
          border-white border-dashed border w-full h-full min-h-[20rem] rounded-lg cursor-pointer flex flex-col justify-center items-center bg-opacity-20 transition-all duration-200 ease-in-out p-4 
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
        <p className="text-2xl font-medium text-center text-white">
          Drag and drop some files here, or click to select files
        </p>
        <em className="text-center text-sm max-w-[380px] text-white">
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
                  {/* {file.name} - {errors[0].message} */}
                  {file.name}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
