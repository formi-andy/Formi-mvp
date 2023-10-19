import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // chief complaint should be high level field
  // should also include field for status w/ respective enum
  medical_case: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    symptom_areas: v.array(v.string()),
    age: v.optional(v.number()),
    ethnicity: v.optional(v.string()),
    symptoms: v.string(),
    medical_history: v.any(),
    user_id: v.id("users"),
    patient_id: v.id("users"),
    tags: v.array(v.string()),
    chief_complaint: v.string(),
    diagnosis: v.array(
      v.any()
      // v.object({
      //   diagnosis: v.string(),
      //   notes: v.string(),
      // })
    ),
    reviewed_at: v.optional(v.number()),
  })
    .index("by_user_id", ["user_id"])
    .index("by_tags", ["tags"]),
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
    // this is UserJSON from @clerk/backend
    clerkUser: v.any(),
    color: v.string(),
    role: v.string(),
  }).index("by_clerk_id", ["clerkUser.id"]),
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
});
