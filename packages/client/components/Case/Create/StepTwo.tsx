import { CaseForm } from "@/app/home/(private)/(padded)/case/create/page";
import Cough from "./Questions/Cough";
import AbdominalPain from "./Questions/AbdominalPain";
import Earache from "./Questions/Earache";
import Rash from "./Questions/Rash";
import Fever from "./Questions/Fever";

function renderQuestions(form: CaseForm) {
  switch (form.values.chiefComplaint) {
    case "cough":
      return <Cough form={form} />;
    case "abdominal_pain":
      return <AbdominalPain form={form} />;
    case "earache":
      return <Earache form={form} />;
    case "fever":
      return <Fever form={form} />;
    case "rash":
      return <Rash form={form} />;
  }
}

export default function StepTwo({ form }: { form: CaseForm }) {
  return (
    <div className="self-center flex flex-col gap-6 p-8 rounded-lg items-center bg-formiblue max-w-5xl w-full">
      <p className="font-semibold text-center text-xl sm:text-2xl text-white">
        Tell us more about the {form.values.chiefComplaint.replace(/_/g, " ")}
      </p>
      {renderQuestions(form)}
    </div>
  );
}
