"use client";

import { useState } from "react";
import { TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { validateEmail } from "@/utils/validateEmail";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Button } from "../ui/button";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !validateEmail(value),
      subject: (value) => value.trim().length === 0,
      message: (value) => value.trim().length === 0,
    },
  });

  const toast = useNetworkToasts();
  const createContactUsMessage = useMutation(
    api.contact_us_message.createContactUsMessage
  );

  const submit = async () => {
    if (loading) return;

    setLoading(true);

    try {
      setLoading(true);
      toast.loading({
        title: "Sending your message...",
        message: "Thanks for your patience!",
      });
      await createContactUsMessage({
        email: form.values.email,
        name: form.values.name,
        subject: form.values.subject,
        message: form.values.message,
      });
      toast.success({
        title: "Successfully sent your message!",
        message: "We'll be in touch soon.",
      });
    } catch (err) {
      toast.error({
        title: "Something went wrong!",
        message: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="grid gap-4 w-full max-w-xl border p-4 sm:p-8 rounded-lg"
      onSubmit={form.onSubmit(() => submit())}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Name"
          placeholder="Your name"
          name="name"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Email"
          placeholder="hello@formi.health"
          name="email"
          {...form.getInputProps("email")}
        />
      </div>
      <TextInput
        label="Subject"
        placeholder="Subject"
        name="subject"
        {...form.getInputProps("subject")}
      />
      <Textarea
        label="How Can We Help You?"
        placeholder="Your message"
        maxRows={10}
        minRows={5}
        autosize
        maxLength={1000}
        name="message"
        {...form.getInputProps("message")}
      />
      <Button type="submit" disabled={loading}>
        Send
      </Button>
    </form>
  );
}
