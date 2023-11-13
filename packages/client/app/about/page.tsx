import { LuGlobe, LuGraduationCap, LuZap } from "react-icons/lu";
import WaitList from "@/components/WaitList/WaitList";

type Props = {};

const AboutPage = (props: Props) => {
  return (
    <div className="min-h-[calc(100vh_-_152px)] py-8 gap-y-4 flex flex-col items-center mt-24">
      <p className="tracking-wide lg:tracking-wider text-blue-500 font-light text-lg lg:text-xl text-center">
        OUR MISSION
      </p>
      <p className="text-3xl sm:[font-size:3rem] sm:[line-height:1.25] xl:[line-height:1.25] xl:[font-size:3.75rem] font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-500">
        Changing how you get medical information online
      </p>
      <div className="flex flex-col text-base md:text-xl items-center mt-12">
        <span className="flex whitespace-pre-wrap text-center">
          We build for <p className="font-bold">parents and students.</p>
        </span>
        <p className="text-center mt-2">
          We&apos;re a team of builders from Columbia University & USC who
          believe that everyone deserves access to quality medical information.
        </p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row mt-12">
        <div className="flex gap-x-4 w-80">
          <div className="bg-black w-10 h-10 rounded-lg text-white items-center justify-center flex">
            <LuZap size={20} />
          </div>
          <div className="flex flex-col gap-y-1 text-left flex-1">
            <p className="text-2xl font-medium leading-none">Fast</p>
            <p className="text-neutral-600">
              Get answers in 1 hour or less, around the clock.
            </p>
          </div>
        </div>
        <div className="flex gap-x-4 w-80">
          <div className="bg-black w-10 h-10 rounded-lg text-white items-center justify-center flex">
            <LuGraduationCap size={20} />
          </div>
          <div className="flex flex-col gap-y-1 text-left flex-1">
            <p className="text-2xl font-medium leading-none">Smart</p>
            <p className="text-neutral-600">
              You get answers, students get experience.
            </p>
          </div>
        </div>
        <div className="flex gap-x-4 w-80">
          <div className="bg-black w-10 h-10 rounded-lg text-white items-center justify-center flex">
            <LuGlobe size={20} />
          </div>
          <div className="flex flex-col gap-y-1 text-left flex-1">
            <p className="text-2xl font-medium leading-none">Accessible</p>
            <p className="text-neutral-600">
              Accessible for everyone, regardless of technical ability.
            </p>
          </div>
        </div>
      </div>
      <WaitList
        text={
          <p className="text-3xl sm:text-4xl mb-4 font-semibold text-center">
            Want to learn more?
          </p>
        }
      />
    </div>
  );
};

export default AboutPage;
