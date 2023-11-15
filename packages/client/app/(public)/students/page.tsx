import { auth } from "@clerk/nextjs";

import WaitList from "@/components/WaitList/WaitList";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const mont = Montserrat({ subsets: ["latin"] });

export default async function Temp() {
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
            Learn with real patient data.
          </p>
          <p className="text-2xl text-darktext">
            Score higher on your STEP 2 exam and match with your dream
            residency. Oh, and get paid while you do it.
          </p>
          <p className="text-2xl text-darktext">Coming soon.</p>
          <WaitList buttonColor="bg-formiblue" />
        </div>
        <div className="w-1/3 h-2/3 aspect-auto relative hidden lg:block">
          <Image
            src="/assets/formi_student_iPhone.png"
            layout="fill"
            alt="Formi Iphone Image"
            objectFit="contain"
          />
        </div>
      </div>
      <div
        className={`${mont.className} flex flex-col gap-y-16 justify-center items-center bg-[#E4E0E4] min-h-screen text-darktext px-8 py-32 lg:py-8}`}
      >
        <p className="text-4xl sm:text-5xl font-medium text-center">
          Medical education, reimagined
        </p>
        <div className="flex flex-col gap-y-6 max-w-5xl">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col justify-between gap-y-12 bg-[#F3F0F2] text-darktext rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">
                Earn while you learn
              </p>
              <p>
                Get paid for each correct assessment, and get feedback for the
                ones you get wrong. clock.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-y-12 bg-[#F3F0F2] text-darktext rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">
                Personalized cases
              </p>
              <p>
                We identify your strengths and weaknesses. Choose the types of
                cases that need the most practice.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-y-12 bg-[#F3F0F2] text-darktext rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">
                On your own time
              </p>
              <p>
                Being a student is tough. Review cases whenever you have free
                time and stop when you have to.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-y-12 bg-[#F3F0F2] text-darktext rounded-2xl p-6 shadow-accent-2">
              <p className="text-xl sm:text-2xl font-medium">Stand out</p>
              <p>
                Track your performance and show residencies that you&apos;re
                among the very best.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-16 mt-40 mb-16 items-center px-8 py-32 lg:py-8">
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
              Use your school email to register and tell us a little bit about
              yourself.
            </p>
          </div>
          <div className="p-6 bg-lightblue flex flex-col gap-y-3 rounded-2xl shadow-accent-2">
            <div className="flex w-16 h-16 items-center justify-center p-6 rounded-full bg-white">
              <p className="text-2xl sm:text-3xl font-medium">2</p>
            </div>
            <p className="text-2xl sm:text-3xl font-medium">Review cases</p>
            <p className="text-lg sm:text-xl font-light">
              See and assess real cases from actual patients. Practice writing
              assessments and delivering patient-facing info.
            </p>
          </div>
          <div className="p-6 bg-lightblue flex flex-col gap-y-3 rounded-2xl shadow-accent-2">
            <div className="flex w-16 h-16 items-center justify-center p-6 rounded-full bg-white">
              <p className="text-2xl sm:text-3xl font-medium">3</p>
            </div>
            <p className="text-2xl sm:text-3xl font-medium">Keep improving </p>
            <p className="text-lg sm:text-xl font-light">
              Get actionable study insights based on performance. Practice the
              cases you need the most help with.
            </p>
          </div>
        </div>
      </div>
      <div className="h-[25vh] lg:h-[50vh] flex flex-col items-center justify-center bg-formiblue">
        <div className="w-2/3">
          <WaitList
            text={
              <p
                className={`${mont.className} text-3xl sm:text-4xl mb-4 text-center text-white`}
              >
                Ready to start earning?
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
