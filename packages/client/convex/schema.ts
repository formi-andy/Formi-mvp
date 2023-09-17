import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  images: defineTable({
    id: v.string(),
    url: v.string(),
    user_id: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
  }).index("by_user_id", ["user_id"]),
  users: defineTable({
    // this is UserJSON from @clerk/backend
    clerkUser: v.any(),
    color: v.string(),
  }).index("by_clerk_id", ["clerkUser.id"]),
});
