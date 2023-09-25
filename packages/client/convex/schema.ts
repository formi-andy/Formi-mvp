import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  images: defineTable({
    storage_id: v.string(),
    user_id: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    patient_id: v.optional(v.string()),
    tags: v.array(v.string()),
  }).index("by_user_id", ["user_id"]),
  users: defineTable({
    // this is UserJSON from @clerk/backend
    clerkUser: v.any(),
    color: v.string(),
    role: v.string(),
  }).index("by_clerk_id", ["clerkUser.id"]),
  action_items: defineTable({
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
  patient_doctors: defineTable({
    patient_id: v.string(),
    doctor_id: v.string(),
    doctor_role: v.string(),
  })
    .index("by_patient_id", ["patient_id"])
    .index("by_doctor_id", ["doctor_id"])
    .index("by_patinet_id_and_doctor_id", ["patient_id", "doctor_id"]),
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
  organizations: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),
  organization_members: defineTable({
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
    message: v.optional(v.string()),
  }).index("by_email", ["email"]),
});
