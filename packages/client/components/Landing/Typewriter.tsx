"use client";

import Typewriter from "typewriter-effect";

const words = ["Patients", "Doctors", "Scale"];

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
