import Link from "next/link";
import LandingTypeWriter from "@/components/Landing/Typewriter";
import { auth } from "@clerk/nextjs";
import LandingProviderInfo from "@/components/Landing/ProviderInfo";

import style from "../landing.module.css";
import WaitList from "@/components/WaitList/WaitList";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const mont = Montserrat({ subsets: ["latin"] });

export default async function Temp() {
  const { userId } = auth();

  return (
    <main className="flex min-h-screen flex-col">
      <div className="text-6xl text-center h-screen bg-lightblue w-full flex flex-col lg:flex-row justify-around items-center">
        <div
          className={
            mont.className +
            " w-full px-8 lg:w-1/2 text-center lg:text-left flex flex-col gap-y-8"
          }
        >
          <p className="text-5xl text-formiblue font-semibold">
            Know when to see a doctor.
          </p>
          <p className="text-2xl text-darktext">
            Take the guesswork out of pediatric visits. Understand when your
            child needs medical attention, with multiple opinions at once.
          </p>
          <p className="text-2xl text-darktext">Coming soon.</p>
          <WaitList buttonColor="bg-formiblue" />
        </div>
        <div className="w-1/3 h-2/3 aspect-auto relative hidden lg:block">
          <Image
            src="/assets/formi_parent_iPhone.png"
            layout="fill"
            alt="Formi Parent Image"
            objectFit="contain"
          />
        </div>
      </div>
      {/* <div className="flex flex-col md:flex-row gap-y-12 gap-x-8">
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
      </div> */}
      <div
        className={
          mont.className +
          " flex flex-col gap-y-16 justify-center items-center bg-[#E4E0E4] min-h-screen text-darktext px-8 py-32 lg:py-8"
        }
      >
        <p className="text-4xl sm:text-5xl font-medium text-center">
          Parent with confidence
        </p>
        <div className="flex flex-col gap-y-6 max-w-5xl">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col justify-between gap-y-12 bg-[#F3F0F2] text-darktext rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">
                On-demand answers
              </p>
              <p>
                From rashes to fevers, get answers in 1 hour or less, around the
                clock.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-y-12 bg-[#F3F0F2] text-darktext rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">Real people</p>
              <p>View answers from 3 medical students at the same time.</p>
            </div>
            <div className="flex flex-col justify-between gap-y-12 bg-[#F3F0F2] text-darktext rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">Know when to go</p>
              <p>
                Invest in a pediatrician&apos;s visit with more certainty than
                ever before.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-y-12 bg-[#F3F0F2] text-darktext rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">
                Keep your pediatrician
              </p>
              <p>
                We know it&apos;s hard to find a good doctor. Get more focused
                visits with the ones you like.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-y-12 bg-[#F3F0F2] text-darktext rounded-2xl p-6 shadow-accent-2">
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
      <div
        className={`${mont.className} flex flex-col gap-y-16 mt-40 mb-16 items-center px-8 py-32 lg:py-8`}
      >
        <p className="text-4xl sm:text-5xl font-medium text-center">
          How Formi Works
        </p>
        <div className="flex flex-col gap-y-6 max-w-5xl">
          <div className="p-6 bg-lightblue flex flex-col gap-y-3 rounded-2xl shadow-accent-2">
            <div className="flex w-16 h-16 items-center justify-center p-6 rounded-full bg-white">
              <p className="text-xl sm:text-2xl font-medium">1</p>
            </div>
            <p className="text-xl sm:text-2xl font-medium">
              Set up your profile
            </p>
            <p className="font-light">
              Share basic medical history and we&apos;ll create profiles for the
              whole family.
            </p>
          </div>
          <div className="p-6 bg-lightblue flex flex-col gap-y-3 rounded-2xl shadow-accent-2">
            <div className="flex w-16 h-16 items-center justify-center p-6 rounded-full bg-white">
              <p className="text-xl sm:text-2xl font-medium">2</p>
            </div>
            <p className="text-xl sm:text-2xl font-medium">
              Tell us what&apos;s wrong
            </p>
            <p className="font-light">
              Answer a few short questions and submit an image of the area of
              concern.
            </p>
          </div>
          <div className="p-6 bg-lightblue flex flex-col gap-y-3 rounded-2xl shadow-accent-2">
            <div className="flex w-16 h-16 items-center justify-center p-6 rounded-full bg-white">
              <p className="text-xl sm:text-2xl font-medium">3</p>
            </div>
            <p className="text-xl sm:text-2xl font-medium">
              Make better health decisions
            </p>
            <p className="font-light">
              See answers from three of the country&apos;s top medical students
              and make your own decisions.
            </p>
          </div>
        </div>
      </div>
      <div className="h-[50vh] flex flex-col items-center justify-center bg-formiblue">
        <div className="w-2/3">
          <WaitList
            text={
              <p
                className={`${mont.className} text-3xl sm:text-4xl mb-4 text-center text-white`}
              >
                Ready to get started?
              </p>
            }
            buttonColor="bg-[#F6DDB3]"
            buttonText="text-formiblue"
          />
        </div>
      </div>
    </main>
  );
}
