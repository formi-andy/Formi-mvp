export const BASE_QUESTIONS = [
  {
    question: "How long have you had this condition?",
    type: "textarea",
    placeholder: "Give your best estimate",
    answer: "",
  },
  {
    question: "What caused the condition to start?",
    type: "textarea",
    placeholder: "If you don't know, just say 'I don't know'",
    answer: "",
  },
  {
    question: "What alleviates the condition?",
    type: "textarea",
    placeholder: "If nothing alleviates the condition, just say 'nothing'",
    answer: "",
  },
  {
    question: "What makes the condition worse?",
    type: "textarea",
    placeholder: "If nothing makes the condition worse, just say 'nothing'",
    answer: "",
  },
  {
    question: "What have you tried to do to fix the condition?",
    type: "textarea",
    placeholder: "If you haven't tried anything, just say 'nothing'",
    answer: "",
  },
  {
    question: "Have you had this condition before?",
    type: "textarea",
    placeholder: "If you haven't had this condition before, just say 'no'",
    answer: "",
  },
  {
    question: "What is your medical history?",
    type: "textarea",
    placeholder: "If you don't have any medical history, just say 'no'",
    answer: "",
  },
  {
    question: "Any family history of this condition?",
    type: "textarea",
    placeholder: "If you don't have any family history, just say 'no'",
    answer: "",
  },
  {
    question: "What medications are you taking?",
    type: "textarea",
    placeholder: "If you aren't taking any medications, just say 'none'",
    answer: "",
  },
  {
    question: "What allergies do you have?",
    type: "textarea",
    placeholder: "If you don't have any allergies, just say 'none'",
    answer: "",
  },
  {
    question: "Is this condition affecting your daily life?",
    type: "boolean",
    answer: "",
  },
];

export const COUGH_QUESTIONS = [
  {
    question: "Describe in your own words what is happening",
    type: "textarea",
    placeholder:
      "Is the cough dry or wet, wheezing, when does it happen (exercising, or always), laying down, at night vs. day, can you finish a full sentence, what was happening when it started",
    answer: "",
  },
  {
    question: "Is there plegm?",
    type: "textinput",
    placeholder: "If yes, describe the color. Is there blood?",
    answer: "",
  },
  {
    question: "What is the frequency of coughing?",
    type: "textinput",
    placeholder: "Please describe with numbers",
    answer: "",
  },
  {
    question: "Any recent infections or illnesses?",
    type: "textinput",
    placeholder: "If yes, describe in detail",
    answer: "",
  },
  {
    question: "Is there anything that helps or worsens symptoms?",
    type: "textarea",
    placeholder: "If yes, describe in detail",
    answer: "",
  },
  {
    question: "Fever",
    type: "boolean",
    answer: "",
  },
  {
    question: "Chest pain",
    type: "boolean",
    answer: "",
  },
  {
    question: "Abdominal pain",
    type: "boolean",
    answer: "",
  },
  {
    question: "Vomiting",
    type: "boolean",
    answer: "",
  },
  {
    question: "Runny nose",
    type: "boolean",
    answer: "",
  },
  {
    question: "Sore throat",
    type: "boolean",
    answer: "",
  },
  {
    question: "Shortness of breath",
    type: "boolean",
    answer: "",
  },
];

export const ABDOMINAL_QUESTIONS = [
  {
    question: "Describe in your own words what is happening",
    type: "textarea",
    placeholder:
      "Describe the type of pain (shooting, dull, etc.), where in the abdomen, how often it occurs (constant or intermittent), when did it start, what was happening when it started, has it changed over time, is it affecting quality of life.",
    answer: "",
  },
  {
    question: "How intense is the pain on a scale from 1-10?",
    type: "textinput",
    placeholder: "1-10",
    answer: "",
  },
  {
    question: "Does it occur before or after eating?",
    type: "textinput",
    placeholder: "Please describe in detail",
    answer: "",
  },
  {
    question: "Are there any changes in appetite?",
    type: "textinput",
    placeholder: "Please describe in detail",
    answer: "",
  },
  {
    question: "Please describe the bowel movements",
    type: "textinput",
    placeholder: "Color, texture, regularity, diarrhea or constipation",
    answer: "",
  },
  {
    question: "Does the person menstruate?",
    type: "boolean",
    answer: "",
  },
  {
    question: "Is the person sexually active?",
    type: "textinput",
    placeholder: "",
    answer: "",
  },
  {
    question: "Is there anything that helps or worsens symptoms?",
    type: "textarea",
    placeholder: "If yes, describe in detail",
    answer: "",
  },
  {
    question: "Fever",
    type: "boolean",
    answer: "",
  },
  {
    question: "Nausea",
    type: "boolean",
    answer: "",
  },
  {
    question: "Vomiting",
    type: "boolean",
    answer: "",
  },
  {
    question: "Sudden weight change",
    type: "boolean",
    answer: "",
  },
  {
    question: "Weakness or fatigue",
    type: "boolean",
    answer: "",
  },
  {
    question: "Yellowing of the skin",
    type: "boolean",
    answer: "",
  },
  {
    question: "Heartburn",
    type: "boolean",
    answer: "",
  },
];

export const EARACHE_QUESTIONS = [
  {
    question: "Describe in your own words what is happening",
    type: "textarea",
    placeholder:
      "Is it on the inside vs. outside of ear, is the child touching or pulling the ear, what was happening when the symptoms began, etc.",
    answer: "",
  },
  {
    question: "Any major injury to the affected area?",
    type: "textinput",
    placeholder: "",
    answer: "",
  },
  {
    question: "Do siblings have similar symptoms?",
    type: "textinput",
    placeholder: "",
    answer: "",
  },
  {
    question: "Any recent swimming or full submersion in water?",
    type: "textinput",
    answer: "",
  },
  {
    question: "Does child attend daycare?",
    type: "textinput",
    answer: "",
  },
  {
    question: "Is there anything that helps or worsens symptoms?",
    type: "textarea",
    placeholder: "If yes, describe in detail",
    answer: "",
  },
  {
    question: "Fever",
    type: "boolean",
    answer: "",
  },
  {
    question: "Itching",
    type: "boolean",
    answer: "",
  },
  {
    question: "Lightheadedness",
    type: "boolean",
    answer: "",
  },
  {
    question: "Cough",
    type: "boolean",
    answer: "",
  },
  {
    question: "Headache",
    type: "boolean",
    answer: "",
  },
  {
    question: "Ringing or popping sounds in ear",
    type: "boolean",
    answer: "",
  },
  {
    question: "Rashes",
    type: "boolean",
    answer: "",
  },
  {
    question: "Hearing loss",
    type: "boolean",
    answer: "",
  },
  {
    question: "Protruding ear",
    type: "boolean",
    answer: "",
  },
  {
    question: "Discharge from ear",
    type: "boolean",
    answer: "",
  },
];

export const FEVER_QUESTIONS = [
  {
    question: "Describe in your own words what is happening",
    type: "textarea",
    placeholder:
      "Describe the type of pain (shooting, dull, etc.), where in the abdomen, how often it occurs (constant or intermittent), when did it start, what was happening when it started, has it changed over time, is it affecting quality of life.",
    answer: "",
  },
  {
    question: "What was the temperature?",
    type: "textinput",
    placeholder: "",
    answer: "",
  },
  {
    question: "Duration of the fever",
    type: "textinput",
    placeholder: "",
    answer: "",
  },
  {
    question: "Frequency of urination",
    type: "textinput",
    placeholder: "",
    answer: "",
  },
  {
    question: "Is there anything that helps or worsens symptoms?",
    type: "textarea",
    placeholder: "If yes, describe in detail",
    answer: "",
  },
  {
    question: "Has the fever lasted more than 5 days?",
    type: "textinput",
    placeholder: "",
    answer: "",
  },
  {
    question: "Swelling of neck",
    type: "boolean",
    answer: "",
  },
  {
    question: "Rash that extends to the palms or soles of feet",
    type: "boolean",
    answer: "",
  },
  {
    question: "Swelling of hands or feet",
    type: "boolean",
    answer: "",
  },
  {
    question: "Pink color in or around eyes",
    type: "boolean",
    answer: "",
  },
  {
    question: "Burning or pain when urinating",
    type: "boolean",
    answer: "",
  },
  {
    question: "Altered mental status",
    type: "boolean",
    answer: "",
  },
  {
    question: "Coughing",
    type: "boolean",
    answer: "",
  },
  {
    question: "Loss of appetite",
    type: "boolean",
    answer: "",
  },
  {
    question: "Changes in bowel movements",
    type: "boolean",
    answer: "",
  },
];

export const RASH_QUESTIONS = [
  {
    question: "Describe in your own words what is happening",
    type: "textarea",
    placeholder:
      "Describe the type of pain (shooting, dull, etc.), where in the abdomen, how often it occurs (constant or intermittent), when did it start, what was happening when it started, has it changed over time, is it affecting quality of life.",
    answer: "",
  },
  {
    question: "Describe the rash",
    type: "textinput",
    placeholder:
      "What is the color, texture, shape, size, areas affected, does it move",
    answer: "",
  },
  {
    question: "Where does the rash occur?",
    type: "textinput",
    placeholder: "Be specific if possible",
    answer: "",
  },
  {
    question: "Any recent infections or illnesses?",
    type: "textinput",
    placeholder: "If yes, describe in detail",
    answer: "",
  },
  {
    question: "Is there anything that helps or worsens symptoms?",
    type: "textarea",
    placeholder: "If yes, describe in detail",
    answer: "",
  },
  {
    question: "Fever",
    type: "boolean",
    answer: "",
  },
  {
    question: "Cough",
    type: "boolean",
    answer: "",
  },
  {
    question: "Diarrhea",
    type: "boolean",
    answer: "",
  },
  {
    question: "Vomiting",
    type: "boolean",
    answer: "",
  },
  {
    question: "Behavioral changes",
    type: "boolean",
    answer: "",
  },
  {
    question: "Gastrointestinal issues",
    type: "boolean",
    answer: "",
  },
  {
    question: "Itchiness",
    type: "boolean",
    answer: "",
  },
  {
    question: "Pain when touching",
    type: "boolean",
    answer: "",
  },
];
