import { api } from "../convex/_generated/api";

export enum CaseStatus {
  CREATED = "CREATED",
  REVIEWING = "REVIEWING",
  COMPLETED = "COMPLETED",
}

export type MedicalCasesByDate =
  (typeof api.medical_case.listMedicalCasesByUser)["_returnType"];

export type AnonymizedMedicalCasesByDate =
  (typeof api.medical_case.listClaimableMedicalCases)["_returnType"];

export type MedicalCase =
  (typeof api.medical_case.listMedicalCasesByUser)["_returnType"][number]["medicalCases"][number];
