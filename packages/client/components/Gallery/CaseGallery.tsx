"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Skeleton } from "antd";
import dayjs from "dayjs";
import Link from "next/link";

import { LuCheck } from "react-icons/lu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GALLERY_LOADERS } from "@/commons/constants/loaders";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Button } from "../ui/button";
import NoCases from "./NoCases";
import CaseCard from "./CaseCard";

const CaseGallery: React.FC = () => {
  // let cases = useQuery(api.cases.listCases, {
  //   timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  // });

  // required params for case before it can be created should be:
  // - title
  // - description
  // - type
  // - medical_history
  // - user_id
  // - patient

  const casesByDate = [
    {
      date: "2023-10-07T08:28:39.738Z",
      cases: [
        {
          _id: "1",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Ear Infection",
          description: "Ear Infection in the left ear of my son Matthew",
          type: "Ear Infection",
          medical_history: {
            allergies: "None",
            medications: "None",
            surgeries: "None",
            family_history: "None",
            social_history: "None",
            chief_complaint: "Ear Infection",
          },
          user_id: "1",
          patient: {
            first_name: "Matthew",
            last_name: "Smith",
          },
          tags: ["Ear Infection", "Not Urgent"],
          diagnosis: [
            {
              diagnosis: "Ear Infection",
              notes: "Ear Infection in the left ear of my son Matthew",
            },
          ],
        },
        {
          _id: "2",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Asthma Flare-up",
          description: "Sudden asthma attack during a morning jog",
          type: "Asthma",
          medical_history: {
            allergies: "Pollen",
            medications: "Albuterol inhaler",
            surgeries: "None",
            family_history: "Mother has asthma",
            social_history: "Non-smoker",
            chief_complaint: "Difficulty breathing",
          },
          user_id: "2",
          patient: {
            first_name: "Lucas",
            last_name: "Brown",
          },
          tags: ["Asthma", "Urgent"],
          diagnosis: [
            {
              diagnosis: "Asthma Attack",
              notes:
                "Patient experienced difficulty breathing during physical activity.",
            },
          ],
        },
        {
          _id: "3",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Migraine Onset",
          description: "Severe headache with sensitivity to light and sound",
          type: "Migraine",
          medical_history: {
            allergies: "None",
            medications: "Ibuprofen",
            surgeries: "None",
            family_history: "Father has migraines",
            social_history: "Occasional drinker",
            chief_complaint: "Severe headache",
          },
          user_id: "3",
          patient: {
            first_name: "Emily",
            last_name: "Johnson",
          },
          tags: ["Migraine", "Moderate"],
          diagnosis: [
            {
              diagnosis: "Migraine",
              notes:
                "Patient has a history of migraines, likely triggered by stress.",
            },
          ],
        },
        {
          _id: "4",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Sprained Ankle",
          description: "Twisted ankle while playing basketball",
          type: "Sprain",
          medical_history: {
            allergies: "None",
            medications: "None",
            surgeries: "None",
            family_history: "None",
            social_history: "Active lifestyle",
            chief_complaint: "Ankle pain",
          },
          user_id: "4",
          patient: {
            first_name: "Michael",
            last_name: "Williams",
          },
          tags: ["Sprain", "Not Urgent"],
          diagnosis: [
            {
              diagnosis: "Ankle Sprain",
              notes:
                "Patient should rest and elevate the ankle. Ice and compression may help.",
            },
          ],
        },
        {
          _id: "5",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Allergic Reaction",
          description: "Hives and itching after eating seafood",
          type: "Allergy",
          medical_history: {
            allergies: "Shellfish",
            medications: "Antihistamines",
            surgeries: "None",
            family_history: "None",
            social_history: "None",
            chief_complaint: "Skin rash",
          },
          user_id: "5",
          patient: {
            first_name: "Sophia",
            last_name: "Taylor",
          },
          tags: ["Allergy", "Urgent"],
          diagnosis: [
            {
              diagnosis: "Allergic Reaction",
              notes:
                "Patient had a reaction to shellfish. Administered antihistamine.",
            },
          ],
        },
      ],
    },
    {
      date: "2023-10-06T08:28:39.738Z",
      cases: [
        {
          _id: "6",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Diabetic Episode",
          description: "Sudden dizziness and weakness after skipping a meal",
          type: "Diabetes",
          medical_history: {
            allergies: "None",
            medications: "Insulin",
            surgeries: "None",
            family_history: "Mother has Type 2 Diabetes",
            social_history: "Non-smoker, occasional drinker",
            chief_complaint: "Dizziness",
          },
          user_id: "6",
          patient: {
            first_name: "Oliver",
            last_name: "Roberts",
          },
          tags: ["Diabetes", "Urgent"],
          diagnosis: [
            {
              diagnosis: "Hypoglycemia",
              notes:
                "Patient's blood sugar dropped due to missed meal. Advised to eat regularly.",
            },
          ],
        },
        {
          _id: "7",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Skin Rash",
          description: "Red, itchy patches on arms and legs for the past week",
          type: "Dermatology",
          medical_history: {
            allergies: "None",
            medications: "None",
            surgeries: "None",
            family_history: "None",
            social_history: "Recently tried a new detergent",
            chief_complaint: "Itchy skin",
          },
          user_id: "7",
          patient: {
            first_name: "Isabella",
            last_name: "Martinez",
          },
          tags: ["Dermatology", "Not Urgent"],
          diagnosis: [
            {
              diagnosis: "Contact Dermatitis",
              notes:
                "Likely reaction to new detergent. Advised to switch back to previous product.",
            },
          ],
        },
        {
          _id: "8",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Chest Pain",
          description:
            "Sharp pain in the chest while resting, lasting for 10 minutes",
          type: "Cardiology",
          medical_history: {
            allergies: "None",
            medications: "Aspirin",
            surgeries: "None",
            family_history: "Father had heart disease",
            social_history: "Smoker",
            chief_complaint: "Chest discomfort",
          },
          user_id: "8",
          patient: {
            first_name: "Jacob",
            last_name: "Garcia",
          },
          tags: ["Cardiology", "Very Urgent"],
          diagnosis: [
            {
              diagnosis: "Angina",
              notes:
                "Possible blockage in coronary arteries. Recommended further testing.",
            },
          ],
        },
        {
          _id: "9",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Stomach Upset",
          description: "Nausea and vomiting after eating at a new restaurant",
          type: "Gastroenterology",
          medical_history: {
            allergies: "None",
            medications: "None",
            surgeries: "Appendectomy",
            family_history: "None",
            social_history: "None",
            chief_complaint: "Nausea",
          },
          user_id: "9",
          patient: {
            first_name: "Ava",
            last_name: "Hernandez",
          },
          tags: ["Gastroenterology", "Moderate"],
          diagnosis: [
            {
              diagnosis: "Food Poisoning",
              notes:
                "Likely consumed contaminated food. Advised to stay hydrated and rest.",
            },
          ],
        },
      ],
    },
    {
      date: "2023-10-05T08:28:39.738Z",
      cases: [
        {
          _id: "10",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Joint Pain",
          description: "Persistent pain and swelling in the knees and elbows",
          type: "Rheumatology",
          medical_history: {
            allergies: "Penicillin",
            medications: "Ibuprofen",
            surgeries: "None",
            family_history: "Grandmother had rheumatoid arthritis",
            social_history: "Non-smoker, occasional drinker",
            chief_complaint: "Joint discomfort",
          },
          user_id: "10",
          patient: {
            first_name: "Liam",
            last_name: "Rodriguez",
          },
          tags: ["Rheumatology", "Moderate"],
          diagnosis: [
            {
              diagnosis: "Rheumatoid Arthritis",
              notes:
                "Symptoms suggest early stages of rheumatoid arthritis. Recommended rheumatologist consultation.",
            },
          ],
        },
        {
          _id: "11",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Vision Issues",
          description:
            "Blurred vision and frequent headaches over the past month",
          type: "Ophthalmology",
          medical_history: {
            allergies: "None",
            medications: "None",
            surgeries: "None",
            family_history: "Mother wears glasses",
            social_history: "Works on a computer daily",
            chief_complaint: "Blurred vision",
          },
          user_id: "11",
          patient: {
            first_name: "Emma",
            last_name: "Perez",
          },
          tags: ["Ophthalmology", "Not Urgent"],
          diagnosis: [
            {
              diagnosis: "Myopia",
              notes:
                "Patient likely has nearsightedness. Recommended eye examination and corrective lenses.",
            },
          ],
        },
        {
          _id: "12",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Frequent Cough",
          description: "Persistent dry cough and fatigue for three weeks",
          type: "Pulmonology",
          medical_history: {
            allergies: "Dust",
            medications: "Cough syrup",
            surgeries: "None",
            family_history: "None",
            social_history: "Non-smoker",
            chief_complaint: "Cough and fatigue",
          },
          user_id: "12",
          patient: {
            first_name: "Noah",
            last_name: "Gonzalez",
          },
          tags: ["Pulmonology", "Moderate"],
          diagnosis: [
            {
              diagnosis: "Bronchitis",
              notes:
                "Inflammation of the bronchial tubes. Advised rest and increased fluid intake.",
            },
          ],
        },
        {
          _id: "13",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Unexplained Weight Loss",
          description:
            "Lost 15 pounds in two months without dieting or exercise changes",
          type: "Endocrinology",
          medical_history: {
            allergies: "None",
            medications: "None",
            surgeries: "None",
            family_history: "Aunt has hyperthyroidism",
            social_history: "None",
            chief_complaint: "Weight loss",
          },
          user_id: "13",
          patient: {
            first_name: "Olivia",
            last_name: "Ramirez",
          },
          tags: ["Endocrinology", "Urgent"],
          diagnosis: [
            {
              diagnosis: "Hyperthyroidism",
              notes:
                "Overactive thyroid gland might be causing the weight loss. Recommended thyroid function tests.",
            },
          ],
        },
      ],
    },
    {
      date: "2023-10-04T08:28:39.738Z",
      cases: [
        {
          _id: "14",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Persistent Fever",
          description: "High fever for five days with no other symptoms",
          type: "Infectious Disease",
          medical_history: {
            allergies: "None",
            medications: "Paracetamol",
            surgeries: "None",
            family_history: "None",
            social_history: "Recently traveled to a tropical country",
            chief_complaint: "Fever",
          },
          user_id: "14",
          patient: {
            first_name: "Ethan",
            last_name: "Walker",
          },
          tags: ["Infectious Disease", "Urgent"],
          diagnosis: [
            {
              diagnosis: "Dengue Fever",
              notes:
                "Possible dengue infection from recent travel. Advised hospitalization for monitoring.",
            },
          ],
        },
        {
          _id: "15",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Back Pain",
          description: "Lower back pain after lifting heavy objects",
          type: "Orthopedics",
          medical_history: {
            allergies: "None",
            medications: "None",
            surgeries: "None",
            family_history: "None",
            social_history: "Works in a warehouse",
            chief_complaint: "Back pain",
          },
          user_id: "15",
          patient: {
            first_name: "Mia",
            last_name: "Turner",
          },
          tags: ["Orthopedics", "Not Urgent"],
          diagnosis: [
            {
              diagnosis: "Muscle Strain",
              notes:
                "Likely strained a muscle while lifting. Advised rest and hot compress.",
            },
          ],
        },
      ],
    },
    {
      date: "2023-10-03T08:28:39.738Z",
      cases: [
        {
          _id: "16",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Frequent Nosebleeds",
          description: "Nosebleeds occurring almost daily for two weeks",
          type: "ENT",
          medical_history: {
            allergies: "None",
            medications: "None",
            surgeries: "None",
            family_history: "None",
            social_history: "None",
            chief_complaint: "Nosebleeds",
          },
          user_id: "16",
          patient: {
            first_name: "Aiden",
            last_name: "Phillips",
          },
          tags: ["ENT", "Moderate"],
          diagnosis: [
            {
              diagnosis: "Dry Nasal Passages",
              notes:
                "Possible dryness in the nasal passages causing bleeding. Advised saline nasal spray.",
            },
          ],
        },
      ],
    },
    {
      date: "2023-10-02T08:28:39.738Z",
      cases: [
        {
          _id: "17",
          _creationTime: "2023-10-07T08:28:39.738Z",
          title: "Abdominal Pain",
          description: "Sharp pain in the right lower abdomen with nausea",
          type: "Gastroenterology",
          medical_history: {
            allergies: "None",
            medications: "None",
            surgeries: "None",
            family_history: "None",
            social_history: "None",
            chief_complaint: "Abdominal pain",
          },
          user_id: "17",
          patient: {
            first_name: "Zoe",
            last_name: "Barnes",
          },
          tags: ["Gastroenterology", "Very Urgent"],
          diagnosis: [
            {
              diagnosis: "Appendicitis",
              notes:
                "Possible inflamed appendix. Recommended immediate surgical consultation.",
            },
          ],
        },
      ],
    },
  ];

  const toast = useNetworkToasts();

  const renderCases = () => {
    if (casesByDate === undefined) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {[...Array(GALLERY_LOADERS)].map((_, index) => {
            return (
              <div
                key={index}
                className="min-w-[200px] aspect-square h-fit z-100"
              >
                <Skeleton.Button
                  active
                  className="!w-full !h-full min-h-[200px]"
                />
              </div>
            );
          })}
        </div>
      );
    }

    if (casesByDate.length === 0) {
      return <NoCases />;
    }

    return casesByDate.map(({ date, cases }) => {
      return (
        <div key={date} className="flex flex-col gap-y-2">
          <p className="text-xl md:text-2xl font-medium my-4">
            {dayjs(date).format("M/DD/YYYY")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {cases.map(
              ({
                _id,
                _creationTime,
                title,
                description,
                patient,
                medical_history,
                tags,
                diagnosis,
              }) => {
                return (
                  <div
                    className="flex flex-col relative cursor-pointer"
                    key={_id}
                  >
                    <Link href={`/cases/${_id}`}>
                      <CaseCard
                        _id={_id}
                        _creationTime={_creationTime}
                        title={title}
                        patient={patient}
                        description={description}
                        medical_history={medical_history}
                        tags={tags}
                        diagnosis={diagnosis}
                      />
                    </Link>
                  </div>
                );
              }
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-3xl font-medium">Cases</p>
      </div>
      {renderCases()}
    </>
  );
};

export default CaseGallery;
