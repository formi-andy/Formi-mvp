"use client";

import classes from "./carousel.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useMediaQuery } from "@mantine/hooks";

export default function PlatformTutorialModal({
  opened,
  close,
  setOpened,
}: {
  opened: boolean;
  close: any;
  setOpened?: Dispatch<SetStateAction<boolean>>;
}) {
  const [finished, setFinished] = useState(false);
  const { user } = useUser();
  const isMobile = useMediaQuery("(max-width: 50em)");

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();

        if (user) {
          const currentMetadata = user.unsafeMetadata;
          delete currentMetadata.tutorial;

          user.update({
            unsafeMetadata: currentMetadata,
          });
        }
      }}
      closeOnClickOutside={finished}
      centered
      withCloseButton={false}
      size={isMobile ? "95%" : "80%"}
      classNames={{
        body: "flex flex-col gap-y-4 items-center",
      }}
    >
      <p className="text-xl font-medium text-center my-2">
        Welcome to Formi!
      </p>
      <Button
        variant="action"
        className={`absolute top-4 right-4 px-8 transition-all ${
          finished ? "opacity-100" : "opacity-0 cursor-default"
        }`}
        size="icon"
        onClick={() => {
          if (finished) {
            close();

            if (user) {
              const currentMetadata = user.unsafeMetadata;
              delete currentMetadata.tutorial;

              user.update({
                unsafeMetadata: currentMetadata,
              });
            }
          }
        }}
      >
        Done
      </Button>
      <Carousel
        className="w-full"
        slideSize="95%"
        height={"100%"}
        slideGap="md"
        withIndicators
        classNames={classes}
        onSlideChange={(index) => index === 4 && setFinished(true)}
      >
        <Carousel.Slide>
          <div className="h-full p-8 border rounded-lg flex flex-col gap-y-8">
            <div className="flex items-center justify-center text-white bg-black aspect-video h-3/4 rounded-lg">
              <p>[place holder picture]</p>
            </div>
            <p className="text-center text-lg px-16">
            Formi connects you with medical reviewers who look at what you
              submit and generate the most likely issues.
            </p>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="h-full p-8 border rounded-lg flex flex-col gap-y-8">
            <div className="flex items-center justify-center text-white bg-black aspect-video h-3/4 rounded-lg">
              <p>[place holder picture]</p>
            </div>
            <p className="text-center text-lg px-16">
              To get started, click &quot;start case&quot; and begin filling out
              the information.
            </p>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="h-full p-8 border rounded-lg flex flex-col gap-y-8">
            <div className="flex items-center justify-center text-white bg-black aspect-video h-3/4 rounded-lg">
              <p>[place holder picture]</p>
            </div>
            <p className="text-center text-lg px-16">
              Depending on the complexity of your case, your information is sent
              to 3-5 medical reviewers.
            </p>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="h-full p-8 border rounded-lg flex flex-col gap-y-8">
            <div className="flex items-center justify-center text-white bg-black aspect-video h-3/4 rounded-lg">
              <p>[place holder picture]</p>
            </div>
            <p className="text-center text-lg px-16">
              In under 30 minutes, you can view what each reviewer has to say
              about your case.
            </p>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="h-full w-full p-8 border rounded-lg flex flex-col gap-y-8">
            <div className="flex items-center justify-center text-white bg-black aspect-video h-3/4 rounded-lg">
              <p>[place holder picture]</p>
            </div>
            <p className="text-center text-lg px-16">
              If you have questions, schedule a chat with one of your medical
              reviewers or view articles related to your case. Be better
              informed about your health and what&apos;s happening!
            </p>
          </div>
        </Carousel.Slide>
      </Carousel>
    </Modal>
  );
}
