"use client";

import { ErrorBoundary } from "react-error-boundary";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotFoundPage from "../../../not-found";

import Link from "next/link";
import NextImage from "next/image";
import { MdNotes } from "react-icons/md";
import { LuPencil, LuTrash, LuTags } from "react-icons/lu";
import { Breadcrumbs, TextInput, TagsInput, Modal } from "@mantine/core";
import dayjs from "dayjs";
import DOMPurify from "dompurify";

import Image from "@/components/ui/Image/Image";
import AppLoader from "@/components/Loaders/AppLoader";
import RTE from "@/components/ui/RTE/RTE";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { ConvexError } from "convex/values";
import { LuChevronDown } from "react-icons/lu";
import style from "./image.module.css";

import { Button } from "@/components/ui/button";

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
  const user = useQuery(api.users.currentUser);
  const deleteImage = useMutation(api.images.deleteImages);
  const updateImage = useMutation(api.images.updateImage);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toast = useNetworkToasts();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [notesContainer, setNotesContainer] = useState<HTMLElement | null>(
    null
  );

  const form = useForm({
    initialValues: {
      title: image?.title || "",
      description: image?.description || "",
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
    }
  }, [image]);

  useEffect(() => {
    if (image === undefined || editing) return;
    setNotesContainer(document.getElementById("notes"));
  }, [image, editing]);

  useEffect(() => {
    if (notesContainer && notesContainer.scrollHeight > 160) {
      notesContainer.classList.add(style.hidden);
    }
  }, [notesContainer]);

  if (image === undefined) {
    return <AppLoader />;
  }

  const items = [
    { title: "dashboard", href: "/dashboard" },
    { title: slug, href: `/image/${slug}` },
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
        <div className="flex items-center flex-wrap justify-between gap-y-4">
          <Breadcrumbs
            classNames={{
              separator: "!text-blue-500",
            }}
          >
            {items}
          </Breadcrumbs>
          {user && user?._id === image.user_id && (
            <div className="flex gap-x-2">
              <Button
                variant="outline-action"
                size="icon"
                className={`${
                  editing
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white"
                }`}
                disabled={updating}
                onClick={() => {
                  setEditing(!editing);
                }}
              >
                <LuPencil size={20} />
              </Button>
              <Button
                variant="outline-danger"
                size="icon"
                disabled={updating}
                onClick={() => {
                  setConfirmDelete(true);
                }}
              >
                <LuTrash size={20} />
              </Button>
            </div>
          )}
        </div>
        <TextInput
          variant="unstyled"
          placeholder="Title"
          value={form.values.title}
          disabled={!editing}
          classNames={{
            input:
              "!text-4xl font-medium !h-10 overflow-visible !border-0 disabled:bg-transparent disabled:opacity-100 disabled:text-black disabled:cursor-text",
          }}
          onChange={(e) => {
            form.setFieldValue("title", e.currentTarget.value);
          }}
        />
        {/* <p className="text-xl">{image.user_id || "No patient"}</p> */}
        <p className="text-lg">
          Uploaded at {dayjs(image._creationTime).format("M/DD/YYYY h:mm A")}
        </p>
        <div className="flex flex-col border rounded-lg">
          <div className="flex items-center w-full border-b p-4 text-xl font-semibold gap-x-4">
            <MdNotes size={24} /> Notes
          </div>
          <div className="flex flex-col w-full p-4">
            {editing ? (
              <RTE
                content={form.values.description}
                onChange={(content) => {
                  form.setFieldValue("description", content);
                }}
                maxLength={5000}
              />
            ) : (
              <>
                <div
                  id="notes"
                  className={`rte-content-container ${style.notesContainer}`}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      image.description || "No notes yet"
                    ),
                  }}
                />
                {notesContainer && notesContainer.scrollHeight > 160 && (
                  <button
                    type="button"
                    aria-label="Toggle notes"
                    aria-expanded={expanded}
                    className="flex items-center self-center justify-center w-1/2 mt-4 hover:bg-gray-50 border hover:dark:bg-zinc-700 py-1 rounded transition"
                    onClick={() => {
                      let icon = document.getElementById(
                        "assetDescriptionIcon"
                      );
                      if (expanded) {
                        notesContainer.style.maxHeight = "160px";
                        notesContainer.classList.remove(style.expanded);
                        icon?.classList.remove(style.rotate);
                      } else {
                        notesContainer.style.maxHeight = `${notesContainer.scrollHeight}px`;
                        notesContainer.classList.add(style.expanded);
                        icon?.classList.add(style.rotate);
                      }
                      setExpanded(!expanded);
                    }}
                  >
                    <LuChevronDown
                      id="assetDescriptionIcon"
                      className="transition"
                    />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        {/* <div className="flex flex-col border rounded-lg">
          <div className="items-center flex w-full border-b p-4 text-xl font-medium gap-x-4">
            <LuTags />
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
              renderTags(case.tags)
            )}
          </div>
        </div> */}
        {editing && (
          <div className="flex gap-x-4 justify-end">
            <Button
              variant="danger"
              onClick={() => {
                setEditing(false);
              }}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              variant="action"
              disabled={updating}
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
            </Button>
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
          <Button
            variant="outline"
            className="w-24"
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="w-24"
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
          </Button>
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
