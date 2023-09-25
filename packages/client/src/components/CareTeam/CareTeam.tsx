"use client";

import Image from "next/image";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

import { LuUsers } from "react-icons/lu";
import InviteDoctors from "./InviteDoctors";
import CareTeamLoader from "./CareTeamLoader";

type doctors = (typeof api.patient_doctor.getPatientDoctors)["_returnType"];

function renderCareTeam(doctors: doctors) {
  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="p-4 border rounded-lg">
          <LuUsers size={32} />
        </div>
        <p className="text-base font-medium mt-8">No doctors found</p>
        <InviteDoctors />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="flex gap-x-4 border rounded-lg items-center p-4"
          >
            <div className="relative">
              <Image
                src={doctor.imageUrl}
                width={32}
                height={32}
                alt="Doctor Image"
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <p className="font-medium">
                {doctor.firstName} {doctor.lastName}
              </p>
              <p className="text-sm">{doctor.doctor_role}</p>
            </div>
          </div>
        ))}
      </div>
      <InviteDoctors />
    </>
  );
}

export default function CareTeam() {
  const doctors = useQuery(api.patient_doctor.getPatientDoctors);

  return (
    <div className="flex flex-col border rounded-lg min-h-[200px] p-4 lg:p-8 gap-4">
      <p className="text-2xl font-medium">Your Care Team</p>
      {doctors === undefined ? <CareTeamLoader /> : renderCareTeam(doctors)}
    </div>
  );
}
