import { CaseForm } from "@/app/case/create/page";
import Cough from "./Questions/Cough";
import AbdominalPain from "./Questions/AbdominalPain";
import Earache from "./Questions/Earache";
import Rash from "./Questions/Rash";

function renderQuestions(form: CaseForm) {
  switch (form.values.chiefComplaint) {
    case "cough":
      return <Cough form={form} />;
    case "abdominal_pain":
      return <AbdominalPain form={form} />;
    case "earache":
      return <Earache form={form} />;
    case "rash":
      return <Rash form={form} />;
  }
}

export default function StepTwo({ form }: { form: CaseForm }) {
  return (
    <div className="self-center flex flex-col gap-6 p-8 rounded-lg items-center bg-formiblue w-fit min-w-[400px]">
      <p className="font-semibold text-center text-xl sm:text-2xl text-white">
        Tell us more about the {form.values.chiefComplaint}
      </p>
      {renderQuestions(form)}
    </div>
  );
}
