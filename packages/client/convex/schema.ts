import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // chief complaint should be high level field
  medical_case: defineTable({
    // title: v.string(),
    // description: v.optional(v.string()),
    // symptom_areas: v.array(v.string()),
    // symptoms: v.string(),
    profile: v.object({
      user_id: v.optional(v.id("users")),
      first_name: v.string(),
      last_name: v.string(),
      ethnicity: v.array(v.string()),
      date_of_birth: v.number(),
      sex_at_birth: v.string(),
      state: v.string(),
      pediatric_patient: v.boolean(),
    }),
    questions: v.any(),
    // medical_history: v.id("history"),
    medical_history: v.any(),
    user_id: v.id("users"),
    patient_id: v.id("users"),
    duration: v.string(),
    // tags: v.array(v.string()),
    chief_complaint: v.string(),
    reviewed_at: v.optional(v.number()),
    reviewers: v.array(v.id("users")),
    status: v.union(
      v.literal("CREATED"),
      v.literal("REVIEWING"),
      v.literal("COMPLETED")
    ),
    max_reviewers: v.number(),
  }).index("by_user_id", ["user_id"]),
  profile: defineTable({
    user_id: v.optional(v.id("users")),
    created_by: v.id("users"),
    first_name: v.string(),
    last_name: v.string(),
    ethnicity: v.array(v.string()),
    date_of_birth: v.number(),
    sex_at_birth: v.string(),
    state: v.string(),
    pediatric_patient: v.boolean(),
  })
    .index("by_user_id", ["user_id"])
    .index("by_created_by", ["created_by"]),
  review: defineTable({
    case_id: v.id("medical_case"),
    user_id: v.id("users"),
    notes: v.string(),
    status: v.union(v.literal("CREATED"), v.literal("COMPLETED")),
    updated_at: v.number(),
  })
    .index("by_case_id", ["case_id"])
    .index("by_user_id", ["user_id"])
    .index("by_user_id_and_status", ["user_id", "status"]),
  images: defineTable({
    storage_id: v.string(),
    user_id: v.string(),
    title: v.string(),
    case_id: v.optional(v.string()),
    // case_id: v.string(),
    description: v.optional(v.string()),
  })
    .index("by_storage_id", ["storage_id"])
    .index("by_case_id", ["case_id"])
    .index("by_user_id", ["user_id"]),
  users: defineTable({
    // this is UserJSON from @clerk/node-sdk
    clerkUser: v.any(),
    color: v.string(),
    role: v.union(v.string(), v.null()), //TODO: enum
  }).index("by_clerk_id", ["clerkUser.id"]),
  medical_student: defineTable({
    user_id: v.id("users"),
    school: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    blurb: v.optional(v.string()),
  })
    .index("by_user_id", ["user_id"])
    .index("by_school", ["school"])
    .index("by_email", ["email"]),
  action_item: defineTable({
    user_id: v.string(),
    created_by: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    completion_time: v.optional(v.number()),
    updated_at: v.number(),
    completed: v.boolean(),
  })
    .index("by_user_id", ["user_id"])
    .index("by_created_by", ["created_by"])
    .index("by_completed", ["completed"])
    .index("by_updated_at", ["updated_at"])
    .index("by_user_id_and_completed", ["user_id", "completed"])
    .index("by_user_id_and_created_by", ["user_id", "created_by"]),
  patient_doctor: defineTable({
    patient_id: v.string(),
    doctor_id: v.string(),
    doctor_role: v.string(),
  })
    .index("by_patient_id", ["patient_id"])
    .index("by_doctor_id", ["doctor_id"])
    .index("by_patient_id_and_doctor_id", ["patient_id", "doctor_id"]),
  inbox: defineTable({
    sent_by: v.string(),
    sent_to: v.array(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    read: v.boolean(),
    parent_id: v.optional(v.string()),
  })
    .index("by_sent_by", ["sent_by"])
    .index("by_sent_to", ["sent_to"])
    .index("by_parent_id", ["parent_id"]),
  invite: defineTable({
    sent_by: v.string(),
    sent_to: v.string(),
    code: v.string(),
    accepted: v.boolean(),
    responded_at: v.union(v.number(), v.null()),
  })
    .index("by_sent_to", ["sent_to", "responded_at"])
    .index("by_sent_by", ["sent_by", "responded_at"]),
  invite_code: defineTable({
    code: v.string(),
    user_id: v.string(),
  })
    .index("by_code", ["code"])
    .index("by_user_id", ["user_id"]),
  organization: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),
  organization_member: defineTable({
    organization_id: v.string(),
    user_id: v.string(),
    role: v.string(),
  })
    .index("by_organization_id", ["organization_id"])
    .index("by_user_id", ["user_id"]),
  waitlist: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  }).index("by_email", ["email"]),
  contact_us_message: defineTable({
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  }),
  history: defineTable({
    user_id: v.optional(v.id("users")),
    profile_id: v.id("profile"),
    created_by: v.id("users"),
    // medical history questions
    immunizations: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    allergies_medical: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    medications: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    chronic_conditions: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    reproductive_issues: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    surgeries: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    hospitalizations: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    birth_type: v.optional(v.string()),
    weeks_born_at: v.optional(v.number()),
    birth_weight: v.optional(
      v.object({
        answer: v.number(),
        select: v.string(),
      })
    ),
    birth_complications: v.optional(
      v.object({
        answer: v.boolean(),
        description: v.optional(v.string()),
      })
    ),
    // family history questions
    asthma: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    allergies_family: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    cancer: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    diabetes: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    hypertension: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    gastrointestinal: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    other: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    // social history questions
    smoking: v.boolean(),
    alcohol: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    drugs: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    sexual_activity: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    home_situation: v.optional(v.string()),
    physical_activity: v.optional(
      v.object({
        answer: v.boolean(),
        description: v.optional(v.string()),
      })
    ),
  })
    .index("by_user_id", ["user_id"])
    .index("by_created_by", ["created_by"])
    .index("by_user_id_and_created_by", ["user_id", "created_by"])
    .index("by_profile_id", ["profile_id"]),
});
