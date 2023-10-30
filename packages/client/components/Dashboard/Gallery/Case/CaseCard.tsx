import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import Image from "@/components/ui/Image/Image";

import { MedicalCase } from "@/types/case-types";

const CaseCard = ({ medicalCase }: { medicalCase: MedicalCase }) => {
  const {
    _id,
    _creationTime,
    title,
    symptom_areas,
    diagnosis,
    image_url,
    chief_complaint,
  } = medicalCase;

  return (
    <div
      key={_id}
      className="flex flex-col gap-y-4 relative min-w-[200px] min-h-[200px] aspect-square border p-6 rounded-lg transition hover:bg-slate-50"
    >
      <div className="w-full relative flex flex-col gap-y-1">
        <p className="text-lg md:text-xl truncate font-medium">{title}</p>
        <p>{chief_complaint}</p>
      </div>
      <div className="relative w-full h-full rounded-lg blur-sm">
        <Image url={image_url} alt={"First case image"} />
      </div>
      <div>
        <p className="mb-1 font-medium">Symptom Areas</p>
        <div className="flex flex-wrap gap-1">
          {symptom_areas.slice(0, 3).map((area) => {
            return <Badge key={area}>{area}</Badge>;
          })}
          {symptom_areas.length > 3 && (
            <Badge>+{symptom_areas.length - 3}</Badge>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm">
          Created at {dayjs(_creationTime).format("h:mm A")}
        </p>
        <p className="text-sm">
          {diagnosis.length === 0 ? "Pending Review" : "Reviewed"}
        </p>
      </div>
    </div>
  );
};

export default CaseCard;
