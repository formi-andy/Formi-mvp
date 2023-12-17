import { DropzoneData } from "@/types/dropzone-types";

export const uploadFiles = async (uploadData: DropzoneData) => {
  if (uploadData.length === 0) {
    return [];
  }

  const parsedData = uploadData.map(({ file, title }) => ({
    file,
    // replace spaces with underscores and remove special characters
    title: title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "_"),
  }));

  const response = await fetch("/api/upload", {
    method: "POST",
    body: JSON.stringify({
      files: parsedData.map((file) => file.title),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve URLs");
  }

  const urls = await response.json();

  const paths = [] as string[];

  await Promise.all(
    parsedData.map(async ({ file, title }, index) => {
      const matchingUrl = urls.find((u) => u.fileName === title);

      if (!matchingUrl) {
        throw new Error(`URL not found for file: ${title}`);
      }

      const uploadResponse = await fetch(matchingUrl.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed for file ${file.name}`);
      }

      paths.push(`${title}`);
    })
  );

  return paths;
};
