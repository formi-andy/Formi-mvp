import Link from "next/link";
import LandingTypeWriter from "@/components/Landing/Typewriter";
import { auth } from "@clerk/nextjs";
import LandingProviderInfo from "@/components/Landing/ProviderInfo";

import style from "./landing.module.css";
import WaitList from "@/components/WaitList/WaitList";

export default async function Home() {
  const { userId } = auth();
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-12 px-6 py-40">
      <div className="text-6xl font-bold text-center mb-8">
        <p>Built for</p>
        <LandingTypeWriter />
      </div>
      <p className="text-2xl font-semibold text-center">
        Know when to see a doctor
      </p>
      <p className="text-center text-xl">
        Take the guesswork out of pediatric visits. Figure out if your child
        needs medical attention, with multiple opinions all at once.
      </p>
      <div className="flex flex-col md:flex-row gap-y-12 gap-x-8">
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
      <div className="flex flex-col gap-y-16 mt-40 items-center">
        <p className="text-4xl sm:text-5xl font-medium text-center">
          Parent with confidence
        </p>
        <div className="flex flex-col gap-y-6 max-w-5xl">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col justify-between gap-y-12 bg-formiblue text-white rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">
                On-demand answers
              </p>
              <p>
                From rashes to fevers, get answers in 1 hour or less, around the
                clock.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-y-12 bg-formiblue text-white rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">Real people</p>
              <p>View answers from 3 medical students at the same time.</p>
            </div>
            <div className="flex flex-col justify-between gap-y-12 bg-formiblue text-white rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">Know when to go</p>
              <p>
                Invest in a pediatrician&apos;s visit with more certainty than
                ever before.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-y-12 bg-formiblue text-white rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">
                Keep your pediatrician
              </p>
              <p>
                We know it&apos;s hard to find a good doctor. Get more focused
                visits with the ones you like.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-y-12 bg-formiblue text-white rounded-2xl p-6 shadow-accent-2">
            <p className="text-xl sm:text-2xl font-medium">Education</p>
            <p>
              The only thing worse than taking off work for an unnecessary
              doctor&apos;s visit is not knowing what is happening to your
              child. See exactly what your case reviewers say, and learn what to
              look for next time.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-16 mt-40 mb-16 items-center">
        <p className="text-4xl sm:text-5xl font-medium text-center">
          How Formi Works
        </p>
        <div className="flex flex-col gap-y-6 max-w-5xl">
          <div className="p-6 bg-lightblue flex flex-col gap-y-3 rounded-2xl shadow-accent-2">
            <div className="flex w-16 h-16 items-center justify-center p-6 rounded-full bg-white">
              <p className="text-2xl sm:text-3xl font-medium">1</p>
            </div>
            <p className="text-2xl sm:text-3xl font-medium">
              Set up your profile
            </p>
            <p className="text-lg sm:text-xl font-light">
              Share basic medical history and we’ll create profiles for the
              whole family.
            </p>
          </div>
          <div className="p-6 bg-lightblue flex flex-col gap-y-3 rounded-2xl shadow-accent-2">
            <div className="flex w-16 h-16 items-center justify-center p-6 rounded-full bg-white">
              <p className="text-2xl sm:text-3xl font-medium">2</p>
            </div>
            <p className="text-2xl sm:text-3xl font-medium">
              Tell us what&apos;s wrong
            </p>
            <p className="text-lg sm:text-xl font-light">
              Answer a few short questions and submit an image of the area of
              concern.
            </p>
          </div>
          <div className="p-6 bg-lightblue flex flex-col gap-y-3 rounded-2xl shadow-accent-2">
            <div className="flex w-16 h-16 items-center justify-center p-6 rounded-full bg-white">
              <p className="text-2xl sm:text-3xl font-medium">2</p>
            </div>
            <p className="text-2xl sm:text-3xl font-medium">
              Make better health decisions
            </p>
            <p className="text-lg sm:text-xl font-light">
              See answers from three of the country&apos;s top medical students
              and make your own decisions.
            </p>
          </div>
        </div>
      </div>
      <WaitList
        text={
          <p className="text-3xl sm:text-4xl mb-4 font-semibold text-center">
            Ready to get started?
          </p>
        }
      />
    </main>
  );
}
