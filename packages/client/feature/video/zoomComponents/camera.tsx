"use client";

import { useContext, useState } from "react";
import { Button, Tooltip, Menu, Dropdown } from "antd";
import {
  CheckOutlined,
  UpOutlined,
  VideoCameraAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import ZoomMediaContext from "@/context/media-context";
import classNames from "classnames";
import { MediaDevice } from "../video-types";
import {
  getAntdDropdownMenu,
  getAntdItem,
  MenuItem,
} from "./video-footer-utils";
interface CameraButtonProps {
  isStartedVideo: boolean;
  isMirrored?: boolean;
  isBlur?: boolean;
  onCameraClick: () => Promise<void>;
  onSwitchCamera: (deviceId: string) => Promise<void>;
  onMirrorVideo?: () => Promise<void>;
  onVideoStatistic?: () => void;
  onBlurBackground?: () => Promise<void>;
  onSelectVideoPlayback?: (url: string) => Promise<void>;
  className?: string;
  cameraList?: MediaDevice[];
  activeCamera?: string;
  activePlaybackUrl?: string;
}

// these will be actual recordings in the future
const videoPlaybacks = [
  {
    title: "Video 1",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    title: "Video 2",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    title: "Video 3",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
];

const CameraButton = (props: CameraButtonProps) => {
  const {
    isStartedVideo,
    className,
    cameraList,
    activeCamera,
    isMirrored,
    isBlur,
    activePlaybackUrl,
    onCameraClick,
    onSwitchCamera,
    onMirrorVideo,
    onVideoStatistic,
    onBlurBackground,
    onSelectVideoPlayback,
  } = props;
  const { mediaStream } = useContext(ZoomMediaContext);
  const onMenuItemClick = async (payload: { key: any }) => {
    if (loading) return;
    setLoading(true);
    if (payload.key === "mirror") {
      await onMirrorVideo?.();
    } else if (payload.key === "statistic") {
      onVideoStatistic?.();
    } else if (payload.key === "blur") {
      await onBlurBackground?.();
    } else if (/^https:\/\//.test(payload.key)) {
      await onSelectVideoPlayback?.(payload.key);
    } else {
      await onSwitchCamera(payload.key);
    }
    setLoading(false);
  };
  const menuItems =
    cameraList &&
    cameraList.length > 0 &&
    ([
      getAntdItem(
        "Select a Camera",
        "camera",
        undefined,
        cameraList.map((item) =>
          getAntdItem(
            item.label,
            item.deviceId,
            item.deviceId === activeCamera && <CheckOutlined />
          )
        ),
        "group"
      ),
      // getAntdItem(
      //   "Select a Video Playback",
      //   "playback",
      //   undefined,
      //   videoPlaybacks.map((item) =>
      //     getAntdItem(
      //       item.title,
      //       item.url,
      //       item.url === activePlaybackUrl && <CheckOutlined />
      //     )
      //   ),
      //   "group"
      // ),
      getAntdItem("", "d1", undefined, undefined, "divider"),
      getAntdItem("Mirror My Video", "mirror", isMirrored && <CheckOutlined />),
      mediaStream?.isSupportVirtualBackground()
        ? getAntdItem("Blur My Background", "blur", isBlur && <CheckOutlined />)
        : undefined,
      getAntdItem("", "d2", undefined, undefined, "divider"),
      getAntdItem("Video Statistic", "statistic"),
    ].filter(Boolean) as MenuItem[]);

  const [loading, setLoading] = useState(false);

  return (
    <div className={classNames("camera-footer", className)}>
      {isStartedVideo && menuItems ? (
        <Dropdown.Button
          className="vc-dropdown-button"
          size="large"
          menu={getAntdDropdownMenu(menuItems, onMenuItemClick)}
          onClick={async () => {
            if (loading) return;
            setLoading(true);
            await onCameraClick();
            setLoading(false);
          }}
          trigger={["click"]}
          icon={<UpOutlined />}
          placement="topRight"
        >
          <VideoCameraOutlined />
        </Dropdown.Button>
      ) : (
        <Tooltip title={`${isStartedVideo ? "Stop Camera" : "Start Camera"}`}>
          <Button
            className={classNames("vc-button", className)}
            icon={
              isStartedVideo ? (
                <VideoCameraOutlined />
              ) : (
                <VideoCameraAddOutlined />
              )
            }
            shape="circle"
            size="large"
            onClick={async () => {
              if (loading) return;
              setLoading(true);
              await onCameraClick();
              setLoading(false);
            }}
          />
        </Tooltip>
      )}
    </div>
  );
};
export default CameraButton;
