import { internalMutation } from "./_generated/server";

export const doMigration = internalMutation(async ({ db }) => {
  const users = await db.query("users").collect();
  for (const user of users) {
    if (!user.role) {
      await db.patch(user._id, { role: "patient" });
    }
  }
});
