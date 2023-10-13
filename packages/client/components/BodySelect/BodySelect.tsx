"use client";

import { MouseEventHandler, useState } from "react";
import style from "./bodyselect.module.css";
import { INITIAL_PARTS_INPUT } from "@/commons/constants/bodyParts";

export const SVG_PARTS: Array<string> = [
  "head",
  "leftShoulder",
  "rightShoulder",
  "leftArm",
  "rightArm",
  "chest",
  "stomach",
  "leftLeg",
  "rightLeg",
  "leftHand",
  "rightHand",
  "leftFoot",
  "rightFoot",
];

export interface PartsInput {
  head: PartSelect;
  leftShoulder: PartSelect;
  rightShoulder: PartSelect;
  leftArm: PartSelect;
  rightArm: PartSelect;
  chest: PartSelect;
  stomach: PartSelect;
  leftLeg: PartSelect;
  rightLeg: PartSelect;
  rightHand: PartSelect;
  leftHand: PartSelect;
  leftFoot: PartSelect;
  rightFoot: PartSelect;
}

export interface PartsModel {
  head?: JSX.Element;
  neck?: JSX.Element;
  leftShoulder?: JSX.Element;
  rightShoulder?: JSX.Element;
  leftArm?: JSX.Element;
  rightArm?: JSX.Element;
  chest?: JSX.Element;
  stomach?: JSX.Element;
  leftLeg?: JSX.Element;
  rightLeg?: JSX.Element;
  rightHand?: JSX.Element;
  leftHand?: JSX.Element;
  leftFoot?: JSX.Element;
  rightFoot?: JSX.Element;
}

export interface BodyComponentProps {
  onClick?: Function;
  onChange?: Function;
  partsInput?: PartsInput;
  bodyModel?: string;
}

export interface PartSelect {
  selected: boolean;
  show: boolean;
}

const MaleBodyModel: PartsModel = {
  head: (
    <path d="M 49.432 37.702 L 51.958 20.638 L 28.531 5.896 L 4.949 21.448 L 7.485 38.074 L 4.85 38.591 L 6.312 49.381 L 11.52 51.947 L 13.88 63.577 L 23.6 74.595 L 34.456 74.271 L 44.016 63.901 L 45.934 51.949 L 50.99 50.592 L 52.181 39.262 L 49.432 37.702 Z"></path>
  ),
  neck: (
    <path d="M 41.206 66.384 L 17.293 66.688 L 14.836 71.529 L 19.676 87.129 L 30.244 95.034 L 39.498 87.654 L 43.818 71.655 L 41.206 66.384 Z"></path>
  ),
  leftShoulder: (
    <path d="M 38.244 -0.004 L 40.224 9.228 L 28.571 12.085 L 18.502 30.932 L 8.575 36.462 L 0.132 46.755 L 0.219 22.23 L 12.835 8.29 L 19.606 9.571 L 38.244 -0.004 Z"></path>
  ),
  rightShoulder: (
    <path d="M 3.276 -0.004 L 1.296 9.228 L 11.877 12.475 L 22.083 31.131 L 34.053 36.518 L 42.201 47.802 L 41.18 22.506 L 28.53 8.516 L 19.394 8.766 L 3.276 -0.004 Z"></path>
  ),
  leftArm: (
    <path d="M 17.229 50.062 L 18.682 43.737 L 16.442 16.358 L 33.128 0.155 L 39.953 9.973 L 29.237 79.632 L 10.364 119.167 L -0.977 115.813 L 6.654 77.532 L 17.229 50.062 Z"></path>
  ),
  rightArm: (
    <path d="M 6.186 57.362 L 0.01 10.154 L 7.047 0.015 L 18.284 8.364 L 22.997 18.252 L 21.226 43.483 L 33.91 77.03 L 40.918 112.541 L 35.761 118.994 L 29.43 118.465 L 11.079 79.559 L 6.186 57.362 Z"></path>
  ),
  chest: (
    <path d="M 19.32 0 L 9.58 14.601 L -0.005 21.544 L 6.145 26.38 L 10.977 40.45 L 22.177 45.066 L 38.91 36.349 L 46.11 36.037 L 64.211 45.157 L 75.21 40.048 L 79.956 26.138 L 87.048 21.573 L 76.817 14.103 L 66.985 0.152 L 51.079 1.833 L 48.807 5.171 L 36.261 5.483 L 34.051 1.394 L 19.32 0 Z"></path>
  ),
  stomach: (
    <path d="M 15.988 6.215 L 0.765 1.373 L 8.471 30.123 L 6.866 55.306 L 0.057 67.982 L 10.522 82.302 L 36.246 107.323 L 38.8 107.227 L 65.182 83.078 L 75.754 68.424 L 68.905 55.361 L 66.776 30.912 L 74.336 2.311 L 55.921 6.748 L 39.102 0.128 L 34.984 0.264 L 15.988 6.215 Z"></path>
  ),
  leftLeg: (
    <path d="M 34.822 170.168 L 35.794 164.644 L 36.888 158.794 L 39.264 152.9 L 34.561 129.077 L 39.58 87.961 L 43.599 36.561 L 10.799 0.928 L 0.232 30.113 L 5.641 63.554 L 4.668 89.142 L 11.542 121.956 L 10.806 159.345 L 9.017 195.132 L 16.544 224.793 L 22.674 252.725 L 30.692 253.507 L 33.937 215.649 L 38.807 201.895 L 39.47 186.808 L 34.822 170.168 Z"></path>
  ),
  rightLeg: (
    <path d="M 34.308 1.138 L 1.595 32.897 L 4.199 87.843 L 8.051 128.404 L 5.559 134.166 L 4.78 153.519 L 9.418 161.961 L 8.838 170.375 L 5.001 186.538 L 5.695 201.551 L 10.359 215.894 L 9.982 257.679 L 21.301 252.703 L 36.543 194.712 L 32.595 162.705 L 32.401 129.906 L 30.401 125.278 L 40.239 89.299 L 40.455 61.267 L 43.818 30.666 L 34.308 1.138 Z"></path>
  ),
  rightHand: (
    <path d="M 15.281 0.317 L 9.85 6.26 L 1.651 8.339 L 1.305 19.734 L 6.477 37.003 L 9.036 36.995 L 7.405 26.637 L 8.8 26.553 C 8.8 26.553 14.545 38.621 14.221 38.621 L 16.914 38.069 L 13.896 25.545 L 14.948 25.174 L 22.308 38.398 L 25.673 37.74 L 21.074 24.172 L 21.898 23.56 L 31.127 35.891 L 33.934 33.745 L 23.755 11.12 L 33.214 16.208 L 35.792 12.06 L 27.263 4.38 L 15.281 0.317 Z"></path>
  ),
  leftHand: (
    <path d="M 21.893 1.486 L 27.006 7.43 L 34.992 8.871 L 32.786 21.329 L 28.465 37.109 L 25.906 37.527 L 25.942 26.637 L 24.121 26.34 L 20.721 38.408 L 17.921 37.644 L 19.769 25.545 L 18.824 25.174 L 12.102 37.76 L 9.056 36.89 L 13.974 23.747 L 13.575 23.347 L 4.346 34.19 L 1.008 32.363 L 12.081 12.581 L 11.506 11.545 L 0.665 14.72 L -1.914 10.998 L 21.893 1.486 Z"></path>
  ),
  leftFoot: (
    <path d="M 2.167 22.595 L 14.491 2.905 L 22.295 3.398 L 26.954 7.665 L 23.162 33.553 L 18.986 33.71 L 17.194 25.729 L 16.559 31.003 L 15.009 31.095 L 13.441 25.263 L 12.93 30.591 L 10.683 29.829 L 9.88 24.825 L 9.052 29.4 L 6.436 29.455 L 6.018 24.163 L 5.097 29.251 L 2.073 28.438 L 2.167 22.595 Z"></path>
  ),
  rightFoot: (
    <path d="M 6.378 3.485 L 6.18 26.763 L 7.958 33.198 L 11.794 33.082 L 11.963 27.717 L 13.86 32.134 L 15.962 31.932 L 15.795 27.255 L 18.39 31.123 L 20.696 30.607 L 19.257 26.201 L 23.069 29.834 L 24.706 29.107 L 23.997 24.581 L 26.322 27.261 L 27.578 25.159 L 20.436 6.313 L 13.535 1.527 L 6.378 3.485 Z"></path>
  ),
};

export default function BodyComponent({
  onClick,
  partsInput,
}: {
  onClick: (parts: PartsInput) => void;
  partsInput: PartsInput;
}) {
  let currentBodyModel = MaleBodyModel;

  partsInput = {
    ...INITIAL_PARTS_INPUT,
    ...partsInput,
  };

  const [parts, setParts] = useState<PartsInput>(partsInput);

  const setValue = function (value: boolean | PartSelect): PartSelect {
    if (value === true || value === false) {
      value = { selected: !value, show: !value };
    } else if (value) {
      value.selected = !value.selected;
    } else {
      value = { selected: true, show: true };
    }
    return value;
  };

  const onClickSvg: MouseEventHandler = (event): void => {
    if (!event.target || !(event.target instanceof Element)) {
      return;
    }
    const target: Element = event.target;
    const id = target.id || target.parentElement?.id;
    if (!id) {
      return;
    }

    let property: keyof typeof parts;
    for (property in parts) {
      if (
        id !== property ||
        (parts[property] && parts[property].show === false)
      ) {
        continue;
      }
      parts[property] = setValue(parts[property]);
    }

    const partsChanged = { ...parts };
    setParts(partsChanged);
    if (onClick) {
      onClick(partsChanged);
    }
  };

  const svgElements = {
    render: (): Array<JSX.Element> => {
      let property: keyof typeof parts;
      const elements: Array<JSX.Element> = [];
      for (property in parts) {
        if (parts[property] && parts[property].show === false) {
          continue;
        }
        const svg = svgElements[property];
        const selected: boolean = parts[property].selected ? true : false;
        elements.push(svg(selected));
      }
      return elements;
    },
    head: function head(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="head"
          key="head"
          id="head"
          className={(selected ? `${style.bodyPartSelected} ` : "") + "head"}
          xmlns="http://www.w3.org/2000/svg"
          width="56.594"
          height="95.031"
          viewBox="0 0 56.594 95.031"
        >
          {currentBodyModel.head}
        </svg>
      );
    },
    neck: function neck(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="neck"
          key="neck"
          id="neck"
          className={(selected ? `${style.bodyPartSelected} ` : "") + "neck"}
          xmlns="http://www.w3.org/2000/svg"
          width="27.594"
          height="21.5"
          viewBox="0 0 27.594 21.5"
        >
          {currentBodyModel.neck}
        </svg>
      );
    },
    leftShoulder: function leftShoulder(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="leftShoulder"
          key="leftShoulder"
          id="leftShoulder"
          className={
            (selected ? `${style.bodyPartSelected} ` : "") + "leftShoulder"
          }
          xmlns="http://www.w3.org/2000/svg"
          width="109.532"
          height="46.594"
          viewBox="0 0 109.532 46.594"
        >
          {currentBodyModel.leftShoulder}
        </svg>
      );
    },
    rightShoulder: function rightShoulder(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="rightShoulder"
          key="rightShoulder"
          id="rightShoulder"
          className={
            (selected ? `${style.bodyPartSelected} ` : "") + "rightShoulder"
          }
          xmlns="http://www.w3.org/2000/svg"
          width="109.532"
          height="46.594"
          viewBox="0 0 109.532 46.594"
        >
          {currentBodyModel.rightShoulder}
        </svg>
      );
    },
    leftArm: function leftArm(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="leftArm"
          key="leftArm"
          id="leftArm"
          className={(selected ? `${style.bodyPartSelected} ` : "") + "leftArm"}
          xmlns="http://www.w3.org/2000/svg"
          width="156.344"
          height="119.25"
          viewBox="0 0 156.344 119.25"
        >
          {currentBodyModel.leftArm}
        </svg>
      );
    },
    rightArm: function rightArm(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="rightArm"
          key="rightArm"
          id="rightArm"
          className={
            (selected ? `${style.bodyPartSelected} ` : "") + "rightArm"
          }
          xmlns="http://www.w3.org/2000/svg"
          width="156.344"
          height="119.25"
          viewBox="0 0 156.344 119.25"
        >
          {currentBodyModel.rightArm}
        </svg>
      );
    },
    chest: function chest(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="chest"
          key="chest"
          id="chest"
          className={(selected ? `${style.bodyPartSelected} ` : "") + "chest"}
          xmlns="http://www.w3.org/2000/svg"
          width="86.594"
          height="45.063"
          viewBox="0 0 86.594 45.063"
        >
          {currentBodyModel.chest}
        </svg>
      );
    },
    stomach: function stomach(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="stomach"
          key="stomach"
          id="stomach"
          className={(selected ? `${style.bodyPartSelected} ` : "") + "stomach"}
          xmlns="http://www.w3.org/2000/svg"
          width="75.25"
          height="107.594"
          viewBox="0 0 75.25 107.594"
        >
          {currentBodyModel.stomach}
        </svg>
      );
    },
    leftLeg: function leftLeg(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="leftLeg"
          key="leftLeg"
          id="leftLeg"
          className={(selected ? `${style.bodyPartSelected} ` : "") + "leftLeg"}
          xmlns="http://www.w3.org/2000/svg"
          width="93.626"
          height="250.625"
          viewBox="0 0 93.626 250.625"
        >
          {currentBodyModel.leftLeg}
        </svg>
      );
    },
    rightLeg: function rightLeg(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="rightLeg"
          key="rightLeg"
          id="rightLeg"
          className={
            (selected ? `${style.bodyPartSelected} ` : "") + "rightLeg"
          }
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="250.625"
          viewBox="0 0 80 250.625"
        >
          {currentBodyModel.rightLeg}
        </svg>
      );
    },
    leftHand: function leftHand(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="leftHand"
          key="leftHand"
          id="leftHand"
          className={
            (selected ? `${style.bodyPartSelected} ` : "") + "leftHand"
          }
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="38.938"
          viewBox="0 0 90 38.938"
        >
          {currentBodyModel.leftHand}
        </svg>
      );
    },
    rightHand: function rightHand(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="rightHand"
          key="rightHand"
          id="rightHand"
          className={
            (selected ? `${style.bodyPartSelected} ` : "") + "rightHand"
          }
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="38.938"
          viewBox="0 0 90 38.938"
        >
          {currentBodyModel.rightHand}
        </svg>
      );
    },
    leftFoot: function leftFoot(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="leftFoot"
          key="leftFoot"
          id="leftFoot"
          className={
            (selected ? `${style.bodyPartSelected} ` : "") + "leftFoot"
          }
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
        >
          {currentBodyModel.leftFoot}
        </svg>
      );
    },
    rightFoot: function rightFoot(selected: boolean): JSX.Element {
      return (
        <svg
          onClick={onClickSvg}
          data-position="rightFoot"
          key="rightFoot"
          id="rightFoot"
          className={
            (selected ? `${style.bodyPartSelected} ` : "") + "rightFoot"
          }
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="38.938"
          viewBox="0 0 90 38.938"
        >
          {currentBodyModel.rightFoot}
        </svg>
      );
    },
  };

  return <div className={style.bodyContainer}>{svgElements.render()}</div>;
}
