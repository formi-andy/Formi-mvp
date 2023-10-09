export const INITIAL_PARTS_INPUT = {
  head: { selected: false, show: true },
  leftShoulder: { selected: false, show: true },
  rightShoulder: { selected: false, show: true },
  leftArm: { selected: false, show: true },
  rightArm: { selected: false, show: true },
  chest: { selected: false, show: true },
  stomach: { selected: false, show: true },
  leftLeg: { selected: false, show: true },
  rightLeg: { selected: false, show: true },
  rightHand: { selected: false, show: true },
  leftHand: { selected: false, show: true },
  leftFoot: { selected: false, show: true },
  rightFoot: { selected: false, show: true },
};

export interface PartsGroups {
  head: {
    scalp: boolean;
    forehead: boolean;
    leftEye: boolean;
    rightEye: boolean;
    nose: boolean;
    leftEar: boolean;
    rightEar: boolean;
    face: boolean;
    mouth: boolean;
    jaw: boolean;
  };
  neck: { neck: boolean };
  chest: {
    chest: boolean;
    // upperChest: boolean;
    // sternum: boolean;
    // breast: boolean;
  };
  leftArm: {
    armpit: boolean;
    upperArm: boolean;
    elbow: boolean;
    forearm: boolean;
    wrist: boolean;
    hand: boolean;
    fingers: boolean;
  };
  rightArm: {
    shoulder: boolean;
    armpit: boolean;
    upperArm: boolean;
    elbow: boolean;
    forearm: boolean;
    wrist: boolean;
    hand: boolean;
    fingers: boolean;
  };
  abdomen: {
    upperAbdomen: boolean;
    centralAbdomen: boolean;
    lowerAbdomen: boolean;
  };
  pelvis: {
    hip: boolean;
    groin: boolean;
    // suprapubic: boolean;
    // genitals: boolean;
  };
  back: {
    upperBack: boolean;
    flank: boolean;
    lowerBack: boolean;
    tailbone: boolean;
  };
  hip: {
    hip: boolean;
  };
  //   buttocks: {
  //     hip: boolean;
  //     rectum: boolean;
  //   };
  leftLeg: {
    thigh: boolean;
    hamstring: boolean;
    knee: boolean;
    shin: boolean;
    calf: boolean;
    ankle: boolean;
    foot: boolean;
    toes: boolean;
  };
  rightLeg: {
    thigh: boolean;
    hamstring: boolean;
    knee: boolean;
    shin: boolean;
    calf: boolean;
    ankle: boolean;
    foot: boolean;
    toes: boolean;
  };
}
