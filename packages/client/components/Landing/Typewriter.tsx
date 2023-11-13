"use client";

import Typewriter from "typewriter-effect";

const words = ["Parents", "Students", "Training"];

export default function LandingTypeWriter() {
  return (
    <Typewriter
      options={{
        strings: words,
        autoStart: true,
        loop: true,
      }}
    />
  );
}
