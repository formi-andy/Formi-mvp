import { internalMutation } from "./_generated/server";

export const doMigration = internalMutation(async ({ db }) => {
  // const users = await db.query("users").collect();
  // for (const user of users) {
  //   if (!user.role) {
  //     await db.patch(user._id, { role: "patient" });
  //   }
  // }
  // const images = await db.query("images").collect();
  // for (const image of images) {
  //   await db.patch(image._id, {
  //     case_id: "621bdta1bawhjh2s2bbhepgw9jtd2p8" as any,
  //   });
  // }
  // const medicalCases = await db.query("medical_case").collect();
  // for (const medicalCase of medicalCases) {
  //   await db.patch(medicalCase._id, {
  //     reviews: undefined,
  //   });
  // }
  // const reviews = await db.query("review").collect();
  // for (const review of reviews) {
  //   await db.patch(review._id, {
  //     updated_at: Date.now(),
  //   });
  // }
});
