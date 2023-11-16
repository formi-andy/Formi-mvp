"use client";

import { useRef } from "react";
import Image, { ContainImage } from "@/components/ui/Image/Image";
import { Modal } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import ReviewCase from "../Case/Review/ReviewCase";

type Props = {
  opened: boolean;
  close: () => void;
  medicalCase: any;
  caseId: string;
  currentReview: any;
};

const ImageCarouselModal = ({
  opened,
  close,
  medicalCase,
  caseId,
  currentReview,
}: Props) => {
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="100%"
        centered
        classNames={{
          body: "flex flex-col gap-y-8 px-4",
        }}
        withCloseButton={false}
      >
        <p className="text-xl font-semibold">Images</p>
        <div className="flex w-full rounded-lg relative aspect-square max-h-[50vh] min-w-[200px]">
          <Carousel
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
            withIndicators
            height="100%"
            style={{ flex: 1 }}
            classNames={{
              control: "bg-white transition border",
              indicator: "bg-white transition data-[active]:w-[4rem]",
            }}
          >
            {medicalCase.images.map((image, index) => (
              <Carousel.Slide key={index} className="bg-black">
                <ContainImage url={image.url || ""} alt={image.title} />
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>
        <ReviewCase
          caseId={caseId}
          currentReview={currentReview}
          classNames="lg:w-full"
        />
      </Modal>
    </>
  );
};

export default ImageCarouselModal;
