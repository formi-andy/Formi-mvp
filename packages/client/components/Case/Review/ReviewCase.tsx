"use client";

import { useEffect, useState } from "react";
import RTE from "@/components/ui/RTE/RTE";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { ConvexError } from "convex/values";
import { Id } from "@/convex/_generated/dataModel";
import DOMPurify from "dompurify";

import style from "@/app/case/[slug]/case.module.css";
import { LuChevronDown } from "react-icons/lu";
import { ReviewStatus } from "@/types/review-types";

type currentReview = (typeof api.review.getUserReviewByCaseId)["_returnType"];

export default function ReviewCase({
  currentReview,
  caseId,
}: {
  currentReview: currentReview;
  caseId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [reviewContainer, setReviewContainer] = useState<HTMLElement | null>(
    null
  );
  const toast = useNetworkToasts();

  const saveReview = useMutation(api.review.saveReview);
  const submitReview = useMutation(api.review.submitReview);

  useEffect(() => {
    setReviewContainer(document.getElementById("review"));
  }, []);

  useEffect(() => {
    if (reviewContainer && reviewContainer.scrollHeight > 160) {
      reviewContainer.classList.add(style.hidden);
    }
  }, [reviewContainer]);

  useEffect(() => {
    if (currentReview && review === "") {
      setReview(currentReview.notes);
    }
  }, [currentReview, review]);

  return (
    <div className="flex flex-col w-full lg:w-2/5 gap-y-4">
      <p className="text-xl font-semibold">
        {currentReview?.status === ReviewStatus.COMPLETED
          ? "Submitted Review"
          : "Review"}
      </p>
      {currentReview?.status === ReviewStatus.COMPLETED ? (
        <>
          <div
            id="review"
            className={`rte-content-container ${style.notesContainer}`}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(currentReview.notes),
            }}
          />
          {reviewContainer && reviewContainer.scrollHeight > 160 && (
            <button
              type="button"
              aria-label="Toggle review"
              aria-expanded={expanded}
              className="flex items-center self-center justify-center w-1/2 mt-4 hover:bg-gray-50 border hover:dark:bg-zinc-700 py-1 rounded transition"
              onClick={() => {
                let icon = document.getElementById("reviewIcon");
                if (expanded) {
                  reviewContainer.style.maxHeight = "160px";
                  reviewContainer.classList.remove(style.expanded);
                  icon?.classList.remove(style.rotate);
                } else {
                  reviewContainer.style.maxHeight = `${reviewContainer.scrollHeight}px`;
                  reviewContainer.classList.add(style.expanded);
                  icon?.classList.add(style.rotate);
                }
                setExpanded(!expanded);
              }}
            >
              <LuChevronDown id="reviewIcon" className="transition" />
            </button>
          )}
        </>
      ) : (
        <>
          <RTE
            content={review}
            sticky={false}
            onChange={(content) => {
              setReview(content);
            }}
            loadedContent={
              currentReview?.notes && review === ""
                ? currentReview?.notes
                : undefined
            }
            maxLength={5000}
          />
          <div className="flex gap-x-4">
            <Button
              className="w-fit"
              variant="action"
              disabled={loading || review.length === 0}
              onClick={async () => {
                try {
                  setLoading(true);
                  toast.loading({
                    title: "Saving review...",
                    message: "Please wait",
                  });
                  await saveReview({
                    case_id: caseId as Id<"medical_case">,
                    notes: review,
                  });
                  toast.success({
                    title: "Review saved",
                    message: "Your review has been saved",
                  });
                } catch (error) {
                  toast.error({
                    title: "Error saving review",
                    message:
                      error instanceof ConvexError
                        ? (error.data as { message: string }).message
                        : undefined,
                  });
                } finally {
                  setLoading(false);
                }
              }}
            >
              Save
            </Button>
            <Button
              className="w-fit"
              variant="action"
              disabled={loading || review.length === 0}
              onClick={async () => {
                try {
                  setLoading(true);
                  toast.loading({
                    title: "Submitting review...",
                    message: "Please wait",
                  });
                  await submitReview({
                    case_id: caseId as Id<"medical_case">,
                    notes: review,
                  });
                  toast.success({
                    title: "Review submitted",
                    message: "Your review has been submitted",
                  });
                } catch (error) {
                  toast.error({
                    title: "Error submitting review",
                    message:
                      error instanceof ConvexError
                        ? (error.data as { message: string }).message
                        : undefined,
                  });
                } finally {
                  setLoading(false);
                }
              }}
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
