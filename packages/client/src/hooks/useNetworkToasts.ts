"use client";

// TODO: REPLACE ANTD MESSAGES WITH THIS WHEN MANTINE 7 IS OUT OF ALPHA

import { useRef } from "react";
import {
  showNotification,
  updateNotification,
  hideNotification,
  NotificationData,
} from "@mantine/notifications";
import { nanoid } from "nanoid";

const defaultMessages = {
  before: "Please wait",
  success: "",
  error: "Please try again",
};

const useNetworkToasts = () => {
  const toastId = useRef<string>();

  const callToast = (props: NotificationData) => {
    if (toastId.current) {
      updateNotification({
        id: toastId.current,
        ...props,
      });
    } else {
      const id = nanoid();
      toastId.current = id;
      showNotification({
        id,
        onClose: () => {
          toastId.current = undefined;
        },
        ...props,
      });
    }
  };

  const beforeSubmit = (beforeSubmitMessage?: string) => {
    callToast({
      loading: true,
      title: "Submitting...",
      message: beforeSubmitMessage || defaultMessages.before,
      autoClose: false,
      withCloseButton: false,
    });
  };

  const submitSuccess = (successMessage?: string) => {
    callToast({
      loading: false,
      title: "Success!",
      message: successMessage || defaultMessages.success,
      autoClose: true,
      withCloseButton: false,
      color: "green",
    });
  };

  const submitError = (errorMessage?: string) => {
    callToast({
      loading: false,
      title: "Error",
      message: errorMessage || defaultMessages.error,
      autoClose: false,
      withCloseButton: true,
      color: "red",
    });
  };

  const dismissToast = () => {
    hideNotification(toastId.current as string);
    toastId.current = undefined;
  };

  return {
    beforeSubmit,
    submitError,
    submitSuccess,
    dismissToast,
  };
};

export default useNetworkToasts;
