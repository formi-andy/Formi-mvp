"use client";

import { useState } from "react";
import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
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
      // joinWaitlist: true,
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !validateEmail(value),
      subject: (value) => value.trim().length === 0,
      message: (value) => value.trim().length === 0,
    },
  });

  const toast = useNetworkToasts();
  const joinWaitlist = useMutation(api.waitlist.joinWaitlist);

  const submit = async () => {
    if (loading) return;

    setLoading(true);

    // if (form.values.joinWaitlist) {
    //   try {
    //     setLoading(true);
    //     toast.loading({
    //       title: "Joining the waitlist...",
    //       message: "Thanks for your patience!",
    //     });
    //     await joinWaitlist({
    //       email: form.values.email,
    //     });
    //     toast.success({
    //       title: "Successfully joined the waitlist!",
    //       message: "We'll be in touch soon.",
    //     });
    //   } catch (err) {
    //     if (err instanceof ConvexError && err.data.code === 409) {
    //       toast.error({
    //         title: "You're already on the waitlist!",
    //         message: "We'll be in touch soon!",
    //       });
    //     } else {
    //       toast.error({
    //         title: "Something went wrong!",
    //         message: "Please try again.",
    //       });
    //     }
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    try {
      setLoading(true);
      toast.loading({
        title: "Sending your message...",
        message: "Thanks for your patience!",
      });
      await joinWaitlist({
        email: form.values.email,
        name: form.values.name,
        message: `${form.values.subject}\n\n${form.values.message}`,
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

    // send email
    // try {
    //   toast.loading({
    //     title: "Sending your message...",
    //     message: "Thanks for your patience!",
    //   });
    //   await joinWaitlist({
    //     email: form.values.email,
    //   });
    //   toast.success({
    //     title: "Successfully sent your message!",
    //     message: "We'll respond soon.",
    //   });
    // } catch (err) {
    //   toast.error({
    //     title: "Something went wrong!",
    //     message: "Please try again.",
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <form
      className="w-full md:w-3/4 lg:w-1/2"
      onSubmit={form.onSubmit(() => submit())}
    >
      <Title order={2} size="h1" fw={900} ta="center">
        Get in touch
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
        <TextInput
          label="Name"
          placeholder="Your name"
          name="name"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Email"
          placeholder="Your email"
          name="email"
          {...form.getInputProps("email")}
        />
      </SimpleGrid>

      <TextInput
        label="Subject"
        placeholder="Subject"
        mt="md"
        name="subject"
        {...form.getInputProps("subject")}
      />
      <Textarea
        mt="md"
        label="Message"
        placeholder="Your message"
        maxRows={10}
        minRows={5}
        autosize
        name="message"
        {...form.getInputProps("message")}
      />

      {/* <Group justify="center" mt="md">
        <Checkbox
          mt="md"
          label="Join the waitlist"
          {...form.getInputProps("joinWaitlist", { type: "checkbox" })}
        />
      </Group> */}

      <Group justify="center" mt="lg">
        <Button type="submit" disabled={loading} size="lg">
          Send
        </Button>
      </Group>
    </form>
  );
}
