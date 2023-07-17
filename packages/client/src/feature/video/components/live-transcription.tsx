"use client";

import { Button, Tooltip } from "antd";
import classNames from "classnames";
import { IconFont } from "../../../components/icon-font";
import "./live-transcription.scss";
interface LiveTranscriptionButtonProps {
  isStartedLiveTranscription: boolean;
  onLiveTranscriptionClick: () => void;
}

interface LiveTranscriptionLockButtonProps {
  isLockedLiveTranscription: boolean;
  onLiveTranscriptionLockClick: () => void;
}

const LiveTranscriptionButton = (props: LiveTranscriptionButtonProps) => {
  const { isStartedLiveTranscription, onLiveTranscriptionClick } = props;
  return (
    <Tooltip title="Live Transcription" placement="top">
      <Button
        className={classNames("vc-button", {
          "started-transcription": isStartedLiveTranscription,
        })}
        icon={<IconFont type="icon-subtitle" />}
        shape="circle"
        size="large"
        onClick={onLiveTranscriptionClick}
      />
    </Tooltip>
  );
};

export { LiveTranscriptionButton };
