import { query } from "./_generated/server";
import { getHistoryByProfile } from "./history";

import { mustGetCurrentUser } from "./users";

export const getProfiles = query({
  args: {},
  async handler(ctx) {
    const user = await mustGetCurrentUser(ctx);

    const profiles = await ctx.db
      .query("profile")
      .withIndex("by_created_by", (q) => q.eq("created_by", user._id))
      .collect();

    // for each profile, get the history
    const profilesWithHistory = await Promise.all(
      profiles.map(async (profile) => {
        const history = await getHistoryByProfile(ctx, {
          profile_id: profile._id,
        });

        return { ...profile, history };
      })
    );

    return profilesWithHistory;
  },
});
