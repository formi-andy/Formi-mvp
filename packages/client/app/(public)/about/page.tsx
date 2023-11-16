import { LuGlobe, LuGraduationCap, LuZap } from "react-icons/lu";
import WaitList from "@/components/WaitList/WaitList";
import { Montserrat } from "next/font/google";
import Image from "next/image";

type Props = {};

const mont = Montserrat({ subsets: ["latin"] });

const AboutPage = (props: Props) => {
  return (
    <div className="min-h-[calc(100vh_-_152px)] flex flex-col items-center">
      {/* <p className="tracking-wide lg:tracking-wider text-blue-500 font-light text-lg lg:text-xl text-center">
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
      </div> */}
      <div className="text-center h-[50vh] bg-lightblue w-full flex justify-center items-center">
        <p
          className={`${mont.className} text-3xl lg:text-5xl lg:text-left text-center w-5/6 text-formiblue font-semibold`}
        >
          We&apos;re radically changing how you get medical information online
        </p>
      </div>
      <div
        className={`${mont.className} text-center py-16 h-fit min-h-screen bg-[#E4E0E4] w-full flex flex-col lg:flex-row justify-around items-center`}
      >
        <div className="w-full px-8 lg:w-1/2 text-center lg:text-left flex flex-col gap-y-8">
          <p className="text-3xl lg:text-5xl text-formiblue font-semibold">
            Parenting is hard enough. You shouldn&apos;t have to scour the
            internet for answers.
          </p>
          <p className="text-lg lg:text-2xl text-darktext">
            More time than ever is spent online looking for answers to health
            concerns, and with so much information available, it&apos;s tough to
            know where to look and who to listen to.
          </p>
          <p className="text-lg lg:text-2xl text-darktext">
            Despite all this work, 20% of visits to the pediatrician are for
            issues that should have been monitored at home. That means a wasted
            day off of work, needless stress, and an avoidable bill, equating to
            over $65B in unnecessary healthcare expenditure.
          </p>
          <p className="text-lg lg:text-2xl text-darktext">
            We built formi to be your first line of defense when seeking care
            and to take the guesswork out of your child&apos;s health.
          </p>
          <p className="text-lg lg:text-2xl text-darktext">
            With formi, get all the information you need to make good healthcare
            decisions, and be better equipped to advocate for your child&apos;s
            health when you do need a visit.
          </p>
        </div>
        <div className="w-1/3 h-[66vh] aspect-auto relative hidden lg:block">
          <Image
            src="/assets/formi_case_complete_parent_iPhone.png"
            layout="fill"
            alt="Formi Iphone Image"
            className="object-contain"
            priority
          />
        </div>
      </div>
      <div className="w-full h-[50vh] flex flex-col items-center justify-center bg-formiblue">
        <div className="w-2/3">
          <WaitList
            text={
              <p
                className={`${mont.className} text-3xl sm:text-4xl mb-4 text-center text-white`}
              >
                Want to learn more?
              </p>
            }
            buttonColor="bg-[#F6DDB3]"
            buttonText="text-formiblue"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
