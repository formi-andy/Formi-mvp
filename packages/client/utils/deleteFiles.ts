export const deleteFiles = async (deleteData: string[], toast: any) => {
  try {
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

        toast.loading({
          title: `Deleted ${index + 1}/${deleteData.length} files`,
          message: `File ${path} deleted successfully`,
        });
      })
    );
  } catch (error) {
    if (error instanceof Error) {
      toast.error({
        title: "Error",
        message: `Deletion failed: ${error.message}`,
      });
    } else {
      toast.error({
        title: "Error",
        message: `Deletion failed: ${error}`,
      });
    }
  }
};
