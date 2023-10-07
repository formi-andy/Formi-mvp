import React from "react";
import dayjs from "dayjs";

type Props = {
  _id: string;
  _creationTime: string;
  title: string;
  patient: any;
  description: string;
  medical_history: any;
  tags: string[];
  diagnosis: any;
};

const CaseCard = ({
  _id,
  _creationTime,
  title,
  patient,
  medical_history,
  tags,
}: Props) => {
  return (
    <div
      key={_id}
      className="relative min-w-[200px] min-h-[200px] aspect-video border p-6 rounded-lg transition-colors hover:bg-slate-100"
    >
      <div className="flex flex-col justify-between h-full truncate">
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-between items-center w-full">
            <p className="text-lg md:text-xl truncate">{title}</p>
            <p className="text-sm">{dayjs(_creationTime).format("h:mm A")}</p>
          </div>
          <div>
            <p className="text-sm md:text-base truncate">
              Chief Complaint: {medical_history.chief_complaint}
            </p>
            <p className="text-sm md:text-base truncate">
              Patient: {patient.first_name} {patient.last_name}
            </p>
          </div>
        </div>
        <div>
          {tags.map((tag) => {
            return (
              <div
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
              >
                {tag}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
