import Image from "next/image";
import { CaseForm } from "@/app/case/create/page";
import { Badge } from "../ui/badge";
import DOMPurify from "dompurify";

export default function Review({ form }: { form: CaseForm }) {
  const selected: string[] = [];

  for (const key in form.values.bodyParts) {
    if (form.values.bodyParts[key].selected) {
      const split = key.split(/(?=[A-Z])/);
      selected.push(split.join(" "));
    }
  }

  return (
    <div className="grid gap-y-6 gap-x-4">
      <div>
        <p className="font-medium text-xl mb-2">Case Title</p>
        <p>{form.values.title}</p>
      </div>
      <div>
        <p className="font-medium text-xl mb-2">Patient</p>
        <p>{form.values.patient}</p>
      </div>
      <div>
        <p className="font-medium text-xl mb-2">Files</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {form.values.files.map((file, index) => (
            <div key={index} className="grid gap-y-2">
              <Image
                src={URL.createObjectURL(file.file)}
                alt="Case Image"
                width={200}
                height={200}
                objectFit="cover"
                className="rounded-lg"
              />
              <p className="truncate">{file.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="font-medium text-xl mb-2">Symptom Areas</p>
        <div className="flex flex-wrap gap-4">
          {selected.map((part, i) => {
            return (
              <Badge key={i} variant="default">
                {part}
              </Badge>
            );
          })}
        </div>
      </div>
      <div>
        <p className="font-medium text-xl mb-2">Questions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
          {Object.keys(form.values.questions).map((key, index) => {
            let question = form.values.questions[key];
            if (question.type === "text") {
              return (
                <div key={`case_info_${index}`}>
                  <p className="text-lg">{question.question}</p>
                  <p>{question.answer}</p>
                </div>
              );
            }
            return (
              <div key={`case_info_${index}`}>
                <p className="font-medium text-lg mb-2">{question.question}</p>
                <p className="capitalize">{question.answer}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <p className="font-medium text-xl mb-2">Additional Notes</p>
        <div
          className="rte-content-container"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              form.values.description || "No additional notes"
            ),
          }}
        />
      </div>
    </div>
  );
}
