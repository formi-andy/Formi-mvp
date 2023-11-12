import { query } from "./_generated/server";

import { mustGetCurrentUser } from "./users";

export const getProfiles = query({
  args: {},
  async handler(ctx) {
    const user = await mustGetCurrentUser(ctx);

    const profiles = await ctx.db
      .query("profile")
      .withIndex("by_created_by", (q) => q.eq("created_by", user._id))
      .collect();

    return profiles;
  },
});
