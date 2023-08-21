import Link from "next/link";
import LandingTypeWriter from "@/components/Landing/Typewriter";
import LandingProviderInfo from "@/components/Landing/ProviderInfo";
import LandingSteps from "@/components/Landing/Steps";

import style from "./landing.module.css";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-8 px-24 py-40">
      <div className="text-6xl font-bold text-center mb-8">
        <p>Built for</p>
        <LandingTypeWriter />
      </div>
      <p className="text-2xl font-semibold text-center">
        Comprehensive Remote Physical Exams From the Comfort of Home
      </p>
      <p className="text-center text-xl">
        Homescope is the platform that gives patients and their doctors easy
        access to 24/7 monitoring of their health.
      </p>
      <div className="flex flex-col md:flex-row gap-y-4 gap-x-8">
        <Link
          href="/login"
          className="flex items-center text-center justify-center border border-black bg-black hover:bg-zinc-700 hover:border-zinc-700 text-white font-medium h-12 w-40 rounded-lg transition"
        >
          Get Started
        </Link>
        <div className="relative">
          <span className={style.gradientButtonShadow} />
          <Link href="/about" className={style.gradientButton}>
            Learn More
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 w-full">
        <div className="bg-black px-8 py-8 rounded-2xl w-full">
          <p className="text-white text-2xl">Our Doctors</p>
          <hr className="bg-white my-8" />
          <div className={style.wrapper}>
            <div className={style.marquee}>
              <p className="text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                volutpat, ante eu bibendum tincidunt, sem lacus vehicula augue,
                ut suscipit.
              </p>
              <p className="text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                volutpat, ante eu bibendum tincidunt, sem lacus vehicula augue,
                ut suscipit.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-black px-8 py-8 rounded-2xl w-full">
          <p className="text-white text-2xl">Our Partners</p>
          <hr className="bg-white my-8" />
          <div className={style.wrapper}>
            <div className={style.marquee}>
              <p className="text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                volutpat, ante eu bibendum tincidunt, sem lacus vehicula augue,
                ut suscipit.
              </p>
              <p className="text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                volutpat, ante eu bibendum tincidunt, sem lacus vehicula augue,
                ut suscipit.
              </p>
            </div>
          </div>
        </div>
      </div>
      <LandingProviderInfo />
      <LandingSteps />
    </main>
  );
}
