import { TbArrowsJoin } from "react-icons/tb";
import { LuGlobe, LuZap } from "react-icons/lu";
import WaitList from "@/components/WaitList/WaitList";

type Props = {};

const AboutPage = (props: Props) => {
  return (
    <div className="min-h-[calc(100vh_-_152px)] py-8 gap-y-4 flex flex-col items-center mt-24">
      <p className="tracking-wide lg:tracking-wider text-blue-500 font-light text-lg lg:text-xl text-center">
        OUR MISSION
      </p>
      <p className="text-3xl sm:[font-size:3rem] sm:[line-height:1.25] xl:[line-height:1.25] xl:[font-size:3.75rem] font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-500">
        Building the future of virtual care
      </p>
      <div className="flex flex-col text-base md:text-xl items-center mt-12">
        <span className="flex whitespace-pre-wrap text-center">
          We build for <p className="font-bold">doctors and patients.</p>
        </span>
        <p className="text-center">
          See everything you can during an in-person visit, from anywhere.
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
              Our design makes virtual visits lightning-quick.
            </p>
          </div>
        </div>
        <div className="flex gap-x-4 w-80">
          <div className="bg-black w-10 h-10 rounded-lg text-white items-center justify-center flex">
            <TbArrowsJoin size={20} />
          </div>
          <div className="flex flex-col gap-y-1 text-left flex-1">
            <p className="text-2xl font-medium leading-none">Compatible</p>
            <p className="text-neutral-600">
              Homescope integrate with all EMR systems and devices.
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
      <WaitList />
      {/* <p className="tracking-wide text-blue-500 font-light text-lg text-center mt-24">
        OUR STORY
      </p> */}
      {/* <div className="flex flex-col gap-y-8 text-center w-3/4">
        <div className="flex flex-col gap-y-4">
          <p className="text-3xl font-bold">
            Say hello to the future of virtual care
          </p>
          <div className="space-y-2">
            <p>
              See everything you can during an in-person visit, from anywhere.
            </p>
            <p className="text-lg font-bold">
              HomeScope aims to improve virtual health care in these five ways
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 md:gap-x-4 gap-y-4">
            <div className="flex flex-col items-center justify-center bg-black text-white rounded-xl p-4">
              <p className="font-bold">Reduced Costs</p>
              <p>
                Implementing effective virtual visits reduces costs by diverting
                patients away from later procedures and visits.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center bg-black text-white rounded-xl p-4">
              <p className="font-bold">Convenience</p>
              <p>
                Make no changes to your current telehealth workflow. We
                integrate with all EMR systems, meaning you can focus on
                providing quality care.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center bg-black text-white rounded-xl p-4">
              <p className="font-bold">Shorter Visits</p>
              <p>
                Our intuitive design makes for lightning-quick virtual visits.
                Even the least tech-savvy patients can go from box to diagnosis
                in under a minute.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center bg-black text-white rounded-xl p-4">
              <p className="font-bold">Access to New Patients</p>
              <p>
                With HomeScope, you can deliver effective care to patients
                located anywhere within the state you’re licensed to practice
                in. We help you get it right the first time, so there’s no need
                for wasteful, in-person follow ups.
              </p>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-black text-white rounded-xl p-4 1">
              <p className="font-bold">Improved Outcomes</p>
              <p>
                Facilitated communication between patients and physicians makes
                for earlier intervention and better outcomes. Not to mention a
                more natural patient-physician interaction and more trust in
                your remote diagnoses.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <p className="text-3xl font-bold">Our Story</p>
          <p>
            Frustrated by the poor quality of remote care available during the
            pandemic, we knew that there had to be a better way to do virtual
            visits. After speaking with physicians, we learned why traditional
            telehealth is so ineffective – it&apos;s because it&apos;s
            impossible to see and interact with the body the way it&apos;s done
            in-person. That is, until now. HomeScope brings the exam room home,
            offering physicians an unparalleled capability to examine their
            patients, from anywhere. Physicians aren&apos;t the only ones who
            benefit, either. For patients, HomeScope makes working your schedule
            around a visit to the doctor a thing of the past. Convenient,
            flexible, and easy-to-use. Welcome to the era of at-home care.
          </p>
        </div>
        <div className="flex flex-col gap-y-4">
          <p className="text-3xl font-bold">Updates</p>
          <p>
            The HomeScope team is hard at work building the future of virtual
            care. We&apos;re currently demoing our product to physicians and
            patients at several hospitals in New York. If you&apos;re interested
            in learning more, please join the wait list and we&apos;ll be in
            touch!
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default AboutPage;
