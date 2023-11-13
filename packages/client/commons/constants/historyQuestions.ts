export const MEDICAL_HISTORY_QUESTIONS = {
  immunizations: {
    type: "checkbox-description",
    question: "Are immunizations up to date?",
    answer: null,
    description: "",
    placeholder: "If no please describe",
  },
  allergies_medical: {
    type: "checkbox-description",
    question: "Do you have any allergies?",
    answer: null,
    description: "",
    placeholder: "If yes please list",
  },
  medications: {
    type: "checkbox-description",
    question: "Current or past medications?",
    answer: null,
    description: "",
    placeholder: "If yes please list",
  },
  chronic_conditions: {
    type: "checkbox-description",
    question: "Any chronic medical conditions?",
    answer: null,
    description: "",
    placeholder: "If yes please describe",
  },
  reproductive_issues: {
    type: "checkbox-description",
    question: "Any reproductive issues?",
    answer: null,
    description: "",
    placeholder: "If yes please describe",
  },
  surgeries: {
    type: "checkbox-description",
    question: "Any major surgeries?",
    answer: null,
    description: "",
    placeholder: "If yes please describe",
  },
  hospitalizations: {
    type: "checkbox-description",
    question: "Any recent hospitalizations?",
    answer: null,
    description: "",
    placeholder: "If yes please describe",
  },
  // pediatric questions
  birth_type: {
    type: "select",
    question: "Vaginal or C-section birth?",
    answer: null,
    options: [
      { value: "vaginal", label: "Vaginal" },
      { value: "c-section", label: "C-section" },
    ],
    pediatric_question: true,
  },
  weeks_born_at: {
    type: "number",
    question: "Number of weeks born at?",
    answer: null,
    pediatric_question: true,
  },
  birth_weight: {
    type: "number-select",
    question: "Weight when born?",
    answer: null,
    select: null,
    pediatric_question: true,
  },
  birth_complications: {
    type: "checkbox-description",
    question: "Any complications during birth?",
    answer: null,
    description: "",
    placeholder: "If yes please describe",
    pediatric_question: true,
  },
};

export const FAMILY_HISTORY_QUESTIONS = {
  asthma: {
    type: "checkbox-description",
    question: "Asthma?",
    answer: null,
    description: "",
    placeholder: "If yes please describe",
  },
  allergies_family: {
    type: "checkbox-description",
    question: "Any allergies?",
    answer: null,
    description: "",
    placeholder: "If yes please describe",
  },
  cancer: {
    type: "checkbox-description",
    question: "Cancer?",
    answer: null,
    description: "",
    placeholder: "If yes please list",
  },
  diabetes: {
    type: "checkbox-description",
    question: "Diabetes?",
    answer: null,
    description: "",
    placeholder: "If yes please describe",
  },
  hypertension: {
    type: "checkbox-description",
    question: "Hypertension?",
    answer: null,
    description: "",
    placeholder: "If yes please describe",
  },
  gastrointestinal: {
    type: "checkbox-description",
    question: "Gastrointestinal issues?",
    answer: null,
    description: "",
    placeholder: "If yes please describe",
  },
  other: {
    type: "checkbox-description",
    placeholder: "",
    question: "Any other major issues?",
    answer: null,
    description: "",
  },
};

export const SOCIAL_HISTORY_QUESTIONS = {
  smoking: {
    type: "checkbox",
    question: "Any smoking in the household?",
    answer: null,
  },
  alcohol: {
    type: "checkbox-description",
    question: "Any alcohol consumption?",
    answer: null,
    description: "",
    placeholder: "If yes please write how many drinks per week",
  },
  drugs: {
    key: "drugs",
    type: "checkbox-description",
    question: "Drug use (including marijuana)?",
    answer: null,
    description: "",
    placeholder: "If yes please list",
  },
  sexual_activity: {
    type: "checkbox-description",
    question: "Sexual activity?",
    answer: null,
    description: "",
    placeholder: "If yes do you use protection?",
  },
  // pediatric_questions
  home_situation: {
    type: "description",
    placeholder: "",
    answer: "",
    question: "Please briefly describe your home situation",
    pediatric_question: true,
  },
  physical_activity: {
    type: "checkbox-description",
    question: "Physical activity?",
    answer: null,
    description: "",
    placeholder: "If yes please describe",
    pediatric_question: true,
  },
};

export const INITIAL_HISTORY = {
  medicalHistoryQuestions: { ...MEDICAL_HISTORY_QUESTIONS },
  familyHistoryQuestions: { ...FAMILY_HISTORY_QUESTIONS },
  socialHistoryQuestions: { ...SOCIAL_HISTORY_QUESTIONS },
};
