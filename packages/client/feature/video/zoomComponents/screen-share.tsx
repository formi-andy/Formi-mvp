import { Button, Tooltip, Menu, Dropdown } from "antd";
import classNames from "classnames";
import { IconFont } from "@/components/icon-font";
import {
  LockOutlined,
  UnlockOutlined,
  UpOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import "./screen-share.scss";
import { SharePrivilege } from "@zoom/videosdk";
import { getAntdDropdownMenu, getAntdItem } from "./video-footer-utils";

const { Button: DropdownButton } = Dropdown;
interface ScreenShareButtonProps {
  isStartedScreenShare: boolean;
  sharePrivilege: SharePrivilege;
  isHostOrManager: boolean;
  onSharePrivilegeClick?: (privilege: SharePrivilege) => void;
  onScreenShareClick: () => void;
}

interface ScreenShareLockButtonProps {
  isLockedScreenShare: boolean;
  onScreenShareLockClick: () => void;
}

const ScreenShareButton = (props: ScreenShareButtonProps) => {
  const {
    isStartedScreenShare,
    sharePrivilege,
    isHostOrManager,
    onScreenShareClick,
    onSharePrivilegeClick,
  } = props;
  const menu = [
    getAntdItem(
      "Lock share",
      `${SharePrivilege.Locked}`,
      sharePrivilege === SharePrivilege.Locked && <CheckOutlined />
    ),
    getAntdItem(
      "One participant can share at a time",
      `${SharePrivilege.Unlocked}`,
      sharePrivilege === SharePrivilege.Unlocked && <CheckOutlined />
    ),
    getAntdItem(
      "Multiple participants can share simultaneously",
      `${SharePrivilege.MultipleShare}`,
      sharePrivilege === SharePrivilege.MultipleShare && <CheckOutlined />
    ),
  ];
  const onMenuItemClick = (payload: { key: any }) => {
    onSharePrivilegeClick?.(Number(payload.key));
  };
  return (
    <>
      {isHostOrManager ? (
        <Tooltip
          title={`${
            isStartedScreenShare ? "Stop Screenshare" : "Start Screenshare"
          }`}
        >
          <DropdownButton
            className="vc-dropdown-button"
            size="large"
            menu={getAntdDropdownMenu(menu, onMenuItemClick)}
            onClick={onScreenShareClick}
            trigger={["click"]}
            icon={<UpOutlined />}
            placement="topRight"
          >
            <IconFont type="icon-share" />
          </DropdownButton>
        </Tooltip>
      ) : (
        <Tooltip
          title={`${
            isStartedScreenShare ? "Stop Screenshare" : "Start Screenshare"
          }`}
        >
          <Button
            className={classNames("screen-share-button", "vc-button", {
              "started-share": isStartedScreenShare,
            })}
            icon={<IconFont type="icon-share" />}
            shape="circle"
            size="large"
            onClick={onScreenShareClick}
          />
        </Tooltip>
      )}
    </>
  );
};

const ScreenShareLockButton = (props: ScreenShareLockButtonProps) => {
  const { isLockedScreenShare, onScreenShareLockClick } = props;
  return (
    <Tooltip
      title={isLockedScreenShare ? "unlock screen share" : " lock screen share"}
    >
      <Button
        className="screen-share-button"
        icon={isLockedScreenShare ? <LockOutlined /> : <UnlockOutlined />}
        shape="circle"
        size="large"
        onClick={onScreenShareLockClick}
      />
    </Tooltip>
  );
};

export { ScreenShareButton, ScreenShareLockButton };
