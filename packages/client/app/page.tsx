import Link from "next/link";
import LandingTypeWriter from "@/components/Landing/Typewriter";
import { auth } from "@clerk/nextjs";
import LandingProviderInfo from "@/components/Landing/ProviderInfo";

import style from "./landing.module.css";
import WaitList from "@/components/WaitList/WaitList";

export default async function Home() {
  const { userId } = auth();
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-8 px-6 py-40">
      <div className="text-6xl font-bold text-center mb-8">
        <p>Built for</p>
        <LandingTypeWriter />
      </div>
      <p className="text-2xl font-semibold text-center">
        Comprehensive Remote Physical Exams From the Comfort of Home
      </p>
      <p className="text-center text-xl">
        Formi is the platform that gives patients and their doctors easy access
        to 24/7 monitoring of their health.
      </p>
      <div className="flex flex-col md:flex-row gap-y-4 gap-x-8">
        <Link
          href={userId ? "/dashboard" : "/signup"}
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
      <WaitList />
    </main>
  );
}
