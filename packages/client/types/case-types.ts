import { api } from "../convex/_generated/api";

export enum CaseStatus {
  Created = "CREATED",
  Reviewing = "REVIEWING",
  Completed = "COMPLETED",
}

export type MedicalCasesByDate =
  (typeof api.medical_case.listMedicalCasesByUser)["_returnType"];

export type AnonymizedMedicalCasesByDate =
  (typeof api.medical_case.listClaimableMedicalCases)["_returnType"];

export type MedicalCase =
  (typeof api.medical_case.listMedicalCasesByUser)["_returnType"][number]["medicalCases"][number];
