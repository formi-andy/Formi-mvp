import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import Image from "@/components/ui/Image/Image";

import { MedicalCase } from "@/types/case-types";
import { UserRole } from "@/types/role-types";

const CaseCard = ({
  medicalCase,
  type,
}: {
  medicalCase: MedicalCase;
  type: UserRole.MedicalStudent | UserRole.Patient;
}) => {
  const { _id, _creationTime, status, image_url, chief_complaint } =
    medicalCase;

  return (
    <div
      key={_id}
      className="flex flex-col gap-y-4 relative min-w-[200px] min-h-[200px] aspect-square border p-6 rounded-lg transition hover:bg-slate-50"
    >
      <div className="w-full relative flex flex-col gap-y-1">
        <p className="text-lg md:text-xl truncate font-medium capitalize">
          {chief_complaint.replace(/_/g, " ")} case
        </p>
      </div>
      <div className="relative w-full h-full rounded-lg blur-sm">
        <Image url={image_url} alt={"First case image"} />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm">
          {type === UserRole.MedicalStudent ? "Reviewed" : "Created"} at{" "}
          {dayjs(_creationTime).format("h:mm A")}
        </p>
      </div>
    </div>
  );
};

export default CaseCard;
