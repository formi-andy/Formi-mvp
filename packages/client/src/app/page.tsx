import Link from "next/link";
import LandingTypeWriter from "@/components/Landing/Typewriter";
import WaitList from "@/components/WaitList/WaitList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-16 p-24">
      <div className="text-6xl font-bold text-center">
        <p>Built for</p>
        <LandingTypeWriter />
      </div>
      <p className="text-center text-xl">
        Homescope is the data platform that gives patients and their doctors
        easy access to 24/7 monitoring of their health data.
      </p>
      <div className="flex flex-col md:flex-row gap-x-8">
        <Link
          href="/login"
          className="flex items-center text-center justify-center border border-black bg-black hover:bg-neutral-700 hover:border-neutral-700 text-white font-medium py-2 w-40 rounded transition"
        >
          Get Started
        </Link>
        <Link
          href="/about"
          className="flex items-center text-center justify-center border font-medium py-2 w-40 rounded transition"
        >
          Learn More
        </Link>
      </div>
      <WaitList />
    </main>
  );
}
