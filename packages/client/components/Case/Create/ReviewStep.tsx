import { CaseForm } from "@/app/case/create/page";
import Image from "next/image";

export default function ReviewStep({ form }: { form: CaseForm }) {
  return (
    <div className="text-white grid gap-y-6 gap-x-4 p-8 rounded-lg items-center bg-formiblue max-w-5xl w-full min-w-[400px] self-center">
      <div className="flex justify-center font-semibold text-xl sm:text-2xl">
        Review
      </div>
      <div>
        <p className="font-medium text-xl sm:text-2xl mb-2">
          Who needs help today?
        </p>
        <p>{`${form.values.patient?.firstName} ${form.values.patient?.lastName}`}</p>
      </div>
      <div>
        <p className="font-medium text-xl sm:text-2xl mb-2">Chief Complaint</p>
        <p className="capitalize">
          {form.values.chiefComplaint.replace(/_/g, " ")}
        </p>
      </div>
      <div>
        <p className="font-medium text-xl sm:text-2xl mb-2">Images</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {form.values.files.map((file, index) => (
            <div key={index} className="grid gap-y-2">
              <Image
                src={URL.createObjectURL(file.file)}
                alt="Case Image"
                width={200}
                height={200}
                className="rounded-lg"
              />
              <p className="truncate">{file.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="font-medium text-xl sm:text-2xl mb-2">Questions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
          {Object.keys(form.values.questions).map((key, index) => {
            let question = form.values.questions[key];
            if (question.type === "textarea" || question.type === "textinput") {
              return (
                <div key={`case_info_${index}`}>
                  <p className="text-lg font-medium">{question.question}</p>
                  <p>{question.answer}</p>
                </div>
              );
            }
            return (
              <div key={`case_info_${index}`}>
                <p className="text-lg font-medium">{question.question}</p>
                <p>{question.answer ? "True" : "False"}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
