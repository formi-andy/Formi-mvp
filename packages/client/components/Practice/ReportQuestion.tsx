import { Modal, Textarea } from "@mantine/core";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexError } from "convex/values";

export default function ReportQuestion({
  opened,
  setOpened,
  questionId,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  questionId: string;
}) {
  const submitFeedback = useMutation(
    api.practice_question.reportPracticeQuestion
  );
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useNetworkToasts();

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      title="Give us feedback on this question"
      classNames={{
        body: "flex flex-col gap-y-4",
      }}
    >
      <p className="text-xl font-medium">Feedback</p>
      <Textarea
        placeholder="Be as detailed as possible"
        value={feedback}
        onChange={(e) => setFeedback(e.currentTarget.value)}
        minRows={3}
        maxRows={6}
        maxLength={2000}
      />
      <Button
        disabled={feedback === "" || loading}
        onClick={async () => {
          setLoading(true);
          toast.loading({
            title: "Submitting feedback...",
          });
          try {
            await submitFeedback({
              practiceQuestionId: questionId as Id<"practice_question">,
              feedback,
            });
            setFeedback("");
            toast.success({
              title: "Feedback submitted",
              message: "Thank you for your feedback!",
            });
            setOpened(false);
          } catch (e) {
            toast.error({
              title: "Error submitting feedback",
              message:
                e instanceof ConvexError
                  ? (e.data as { message: string }).message
                  : "Please try again later",
            });
          }
          setLoading(false);
        }}
      >
        Submit
      </Button>
    </Modal>
  );
}
