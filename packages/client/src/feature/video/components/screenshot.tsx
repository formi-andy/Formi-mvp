import { MutableRefObject } from "react";
import { Button, Tooltip } from "antd";
import classNames from "classnames";
import { IoIosCamera } from "react-icons/io";

const createFileName = ({
  extension,
  parts,
}: {
  extension?: string;
  parts: string | string[];
}) => {
  if (!extension) {
    return "";
  }

  if (typeof parts === "string") {
    return `${parts}.${extension}`;
  }

  return `${parts.join("")}.${extension}`;
};

const ScreenshotButton = ({
  containerRef,
}: {
  containerRef: MutableRefObject<HTMLCanvasElement | null>;
}) => {
  function capture(video: HTMLVideoElement) {
    let w = video.scrollWidth;
    let h = video.scrollHeight;
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.drawImage(video, 0, 0, w, h);
    return canvas;
  }

  function shoot() {
    let screenShareVideo = document.getElementById("ZOOM_WEB_SDK_SELF_VIDEO");
    let video = document.getElementById(
      containerRef.current?.id || "_super_random_string_"
    );

    if (!screenShareVideo && !video) {
      return;
    }

    let canvas = screenShareVideo
      ? capture(screenShareVideo as HTMLVideoElement)
      : capture(video as HTMLVideoElement);

    if (!canvas) {
      return;
    }
    canvas.onclick = function () {
      window.open(this.toDataURL(image / jpg));
    };

    // download output
    download(canvas.toDataURL("image/png"), {
      name: `Homescope-Meeting-${Date.now()}`,
      extension: "png",
    });
  }

  const download = (
    image: string,
    { name = "img", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName({ extension, parts: name });
    a.click();
  };

  return (
    <Tooltip title={"Take Screenshot"}>
      <Button
        className={classNames("vc-button")}
        icon={<IoIosCamera />}
        shape="circle"
        size="large"
        onClick={() => shoot()}
      />
    </Tooltip>
  );
};

export { ScreenshotButton };
