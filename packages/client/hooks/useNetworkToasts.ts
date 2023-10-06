"use client";

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

  const loading = ({
    title,
    message,
  }: {
    title?: string;
    message?: string;
  }) => {
    callToast({
      loading: true,
      title: title || "Submitting...",
      message: message || defaultMessages.before,
      autoClose: false,
      withCloseButton: false,
    });
  };

  const success = ({
    title,
    message,
  }: {
    title?: string;
    message?: string;
  }) => {
    callToast({
      loading: false,
      title: title || "Success",
      message: message || defaultMessages.success,
      autoClose: true,
      withCloseButton: true,
      color: "green",
    });
  };

  const error = ({
    title,
    message,
  }: {
    title?: string;
    message?: string;
  }) => {
    callToast({
      loading: false,
      title: title || "Error",
      message: message || defaultMessages.error,
      autoClose: true,
      withCloseButton: true,
      color: "red",
    });
  };

  const dismiss = () => {
    hideNotification(toastId.current as string);
    toastId.current = undefined;
  };

  return {
    loading,
    error,
    success,
    dismiss,
  };
};

export default useNetworkToasts;
