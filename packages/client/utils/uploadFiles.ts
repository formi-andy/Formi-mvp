export const uploadFiles = async (
  uploadData: {
    file: File;
    title: string;
  }[],
  toast: any
) => {
  const questionHash = (Math.random() + 1).toString(36).substring(7);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        questionHash,
        files: uploadData.map((file) => file.title),
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
      uploadData.map(async ({ file, title }, index) => {
        const { url } = urls.find((u) => u.fileName === title);

        if (!url) {
          throw new Error(`URL not found for file: ${title}`);
        }

        const uploadResponse = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed for file ${file.name}`);
        }

        toast.loading({
          title: `Uploaded ${index + 1}/${uploadData.length} files`,
          message: `File ${file.name} uploaded successfully`,
        });
        paths.push(`${questionHash}-${title}`);
      })
    );

    return paths;
  } catch (error) {
    if (error instanceof Error) {
      toast.error({
        title: "Error",
        message: `Upload failed: ${error.message}`,
      });
    } else {
      toast.error({
        title: "Error",
        message: `Upload failed: ${error}`,
      });
    }
  }
};
