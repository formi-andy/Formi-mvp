"use client";

import { ErrorBoundary } from "react-error-boundary";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "@mantine/form";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import NotFoundPage from "@/app/not-found";

import Link from "next/link";
import NextImage from "next/image";
import { MdNotes } from "react-icons/md";
import { PiTagSimpleLight } from "react-icons/pi";
import { GoPencil } from "react-icons/go";
import { Breadcrumbs, TextInput, TagsInput, Modal } from "@mantine/core";
import dayjs from "dayjs";

import Image from "@/components/Image/Image";
import AppLoader from "@/components/Loaders/AppLoader";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import TextArea from "antd/es/input/TextArea";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { BiSolidTrashAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { ConvexError } from "convex/values";

function renderTags(tags: string[]) {
  if (tags.length === 0) {
    return "No tags yet";
  }
  return tags.map((tag, index) => {
    return (
      <span
        key={`${tag}_${index}`}
        className="border rounded px-2 py-1.5 text-sm"
      >
        {tag}
      </span>
    );
  });
}

// TODO: Move this to ssr after convex supports server side reactive queries
function ImagePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // cast to Id<"images"> to satisfy type checker
  const image = useQuery(api.images.getImage, {
    id: slug as Id<"images">,
  });
  const deleteImage = useMutation(api.images.deleteImages);
  const updateImage = useMutation(api.images.updateImage);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toast = useNetworkToasts();
  const router = useRouter();

  const { user, isLoaded } = useUser();
  const [editing, setEditing] = useState(false);
  const form = useForm({
    initialValues: {
      title: image?.title || "",
      description: image?.description || "",
      patientId: image?.patient_id || "",
      tags: image?.tags || [],
    },

    validate: {
      title: (value) => {
        if (value === "") {
          return "Title cannot be empty";
        }
      },
    },
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (image !== undefined) {
      form.setFieldValue("title", image.title);
      form.setFieldValue("description", image.description || "");
      form.setFieldValue("patientId", image.patient_id || "");
      form.setFieldValue("tags", image.tags);
    }
  }, [image, form]);

  if (image === undefined) {
    return <AppLoader />;
  }

  const items = [
    { title: "dashboard", href: "/dashboard" },
    { title: slug, href: `/images/${slug}` },
  ].map((item, index) => (
    <Link
      href={item.href}
      key={index}
      className="text-blue-500 hover:underline"
    >
      {item.title}
    </Link>
  ));

  // TODO: break down into components
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      <div className="flex w-full lg:w-2/5 relative aspect-square max-h-[50vh] min-w-[200px]">
        <Image url={image.url} alt={image.title} />
      </div>
      <div className="flex flex-col w-full lg:w-3/5 gap-y-4">
        <div className="flex items-center flex-wrap justify-between">
          <Breadcrumbs
            classNames={{
              separator: "!text-blue-500",
            }}
          >
            {items}
          </Breadcrumbs>
          {isLoaded && user?.id === image.user_id && (
            <div className="flex gap-x-2">
              <button
                className={`w-10 h-10 flex items-center justify-center border rounded hover:bg-blue-500 hover:text-white transition hover:border-blue-500
              ${editing ? "bg-blue-500 text-white border-blue-500" : "bg-white"}
              `}
                disabled={updating}
                onClick={() => {
                  setEditing(!editing);
                }}
              >
                <GoPencil size={20} />
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center border rounded hover:bg-red-500 hover:text-white transition hover:border-red-500"
                disabled={updating}
                onClick={() => {
                  setConfirmDelete(true);
                }}
              >
                <BiSolidTrashAlt size={20} />
              </button>
            </div>
          )}
        </div>
        {editing ? (
          <TextInput
            variant="unstyled"
            placeholder="Title"
            value={form.values.title}
            classNames={{
              input: "!text-4xl font-medium !h-10 overflow-visible !border-0",
            }}
            onChange={(e) => {
              form.setFieldValue("title", e.currentTarget.value);
            }}
          />
        ) : (
          <p className="text-4xl font-medium">{image.title || "No Title"}</p>
        )}
        <p className="text-xl">{image.patient_id || "No patient"}</p>
        <p className="text-lg">
          Uploaded at {dayjs(image._creationTime).format("M/DD/YYYY h:mm A")}
        </p>
        <div className="flex flex-col border rounded-lg">
          <div className="flex items-center w-full border-b p-4 text-xl font-semibold gap-x-4">
            <MdNotes size={24} /> Notes
          </div>
          <div className="w-full p-4">
            {editing ? (
              <TextArea
                placeholder="Notes"
                value={form.values.description}
                onChange={(e) => {
                  form.setFieldValue("description", e.currentTarget.value);
                }}
                maxLength={5000}
              />
            ) : (
              <p className="text-lg">{image.description || "No notes yet"}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col border rounded-lg">
          <div className="items-center flex w-full border-b p-4 text-xl font-medium gap-x-4">
            <PiTagSimpleLight />
            Tags
          </div>
          <div className="flex flex-row p-4 flex-wrap gap-4">
            {editing ? (
              <TagsInput
                label="Press Enter to submit a tag"
                placeholder="Enter tag"
                value={form.values.tags}
                onChange={(value) => {
                  form.setFieldValue("tags", value);
                }}
                classNames={{
                  root: "w-full",
                }}
              />
            ) : (
              renderTags(image.tags)
            )}
          </div>
        </div>
        {editing && (
          <div className="flex gap-x-4 justify-end">
            <button
              className="flex justify-center items-center w-[120px] h-12 rounded-lg text-xl bg-red-500 hover:bg-red-600 text-white transition"
              onClick={() => {
                setEditing(false);
              }}
              disabled={updating}
            >
              Cancel
            </button>
            <button
              disabled={updating}
              className="flex justify-center items-center w-[120px] h-12 text-xl rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
              onClick={async () => {
                try {
                  setUpdating(true);
                  toast.loading({
                    title: "Updating image",
                    message: "Please wait",
                  });
                  await updateImage({
                    id: image._id,
                    title: form.values.title,
                    description: form.values.description,
                    tags: form.values.tags,
                  });
                  toast.success({
                    title: "Successfully updated image",
                  });
                  setEditing(false);
                } catch (error) {
                  console.log("error", error);
                  toast.error({
                    title: "Error updating image",
                    message: "Please try again later",
                  });
                } finally {
                  setUpdating(false);
                }
              }}
            >
              Save
            </button>
          </div>
        )}
      </div>
      <Modal
        opened={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        centered
        classNames={{
          body: "flex flex-col gap-y-4 items-center",
        }}
      >
        <div className="relative aspect-square w-1/2">
          <NextImage
            src={image.url}
            alt={image.title}
            fill={true}
            className="rounded-lg"
          />
        </div>
        <div>
          <p className="text-xl font-medium text-center">
            Are you sure you want to delete this image?
          </p>
          <p className="text-opacity-50 text-center">This cannot be undone</p>
        </div>
        <div className="flex gap-x-4">
          <button
            className="w-40 text-xl h-12 border rounded-lg hover:border-black transition"
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </button>
          <button
            className="w-40 text-xl bg-red-500 hover:bg-red-600 transition text-white rounded-lg"
            onClick={async () => {
              try {
                setUpdating(true);
                toast.loading({
                  title: "Deleting image",
                  message: "Please be patient",
                });
                await deleteImage({
                  ids: [image._id],
                });
                toast.success({
                  title: "Successfully deleted image",
                  message: "Redirecting to dashboard",
                });
                router.push("/dashboard");
              } catch (err) {
                toast.error({
                  title: "Error deleting image",
                  message: "Please try again later",
                });
                setUpdating(false);
              }
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  if (error instanceof ConvexError) {
    switch ((error.data as { code: number }).code) {
      case 404:
        return <NotFoundPage />;
      case 401:
        return (
          <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>You are not authorized</pre>
          </div>
        );
      default:
        return (
          <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>{error.data.message}</pre>
          </div>
        );
    }
  }

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <ImagePage params={params} />
    </ErrorBoundary>
  );
}
