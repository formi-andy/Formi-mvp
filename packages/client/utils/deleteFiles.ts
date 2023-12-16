export const deleteFiles = async (deleteData: string[]) => {
  if (deleteData.length === 0) {
    return;
  }

  const response = await fetch("/api/delete", {
    method: "POST",
    body: JSON.stringify({
      paths: deleteData,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve URLs");
  }

  const urls = await response.json();

  await Promise.all(
    deleteData.map(async (path, index) => {
      const { url } = urls.find((u) => u.path === path);

      if (!url) {
        throw new Error(`URL not found for file: ${path}`);
      }

      const deleteResponse = await fetch(url, {
        method: "DELETE",
      });

      if (!deleteResponse.ok) {
        throw new Error(`Deletion failed for file ${path}`);
      }
    })
  );
};
