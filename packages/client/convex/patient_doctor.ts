import { mutation, internalMutation, query } from "./_generated/server";

import { ConvexError, v } from "convex/values";
import { mustGetCurrentUser } from "./users";
import { Id } from "./_generated/dataModel";

export const getPatientDoctors = query({
  args: {},
  async handler(ctx) {
    const user = await mustGetCurrentUser(ctx);

    const patientDoctors = await ctx.db
      .query("patient_doctor")
      .withIndex("by_patient_id", (q) => q.eq("patient_id", user._id))
      .order("desc")
      .collect();

    return Promise.all(
      patientDoctors.map(async (doctor) => {
        // TODO: abstract to helper function when join is supported
        let clerkUser = await ctx.db.get(doctor.doctor_id as Id<"users">);

        return {
          ...doctor,
          imageUrl: clerkUser?.clerkUser.image_url,
          firstName: clerkUser?.clerkUser.first_name,
          lastName: clerkUser?.clerkUser.last_name,
          email: clerkUser?.clerkUser.email_addresses,
          phone: clerkUser?.clerkUser.phone_numbers,
        };
      })
    );
  },
});

export const addPatientDoctor = internalMutation({
  args: {
    patientId: v.string(),
    doctorId: v.string(),
    doctorRole: v.string(),
  },
  async handler(ctx, args) {
    const { patientId, doctorId, doctorRole } = args;

    const patientDoctor = await ctx.db
      .query("patient_doctor")
      .withIndex("by_patient_id_and_doctor_id", (q) =>
        q.eq("patient_id", patientId).eq("doctor_id", doctorId)
      )
      .first();

    if (patientDoctor) {
      throw new ConvexError({
        message: "Pairing already exists",
        code: 400,
      });
    }

    return ctx.db.insert("patient_doctor", {
      patient_id: patientId,
      doctor_id: doctorId,
      doctor_role: doctorRole,
    });
  },
});

export const updatePatientDoctor = mutation({
  args: {
    patientId: v.string(),
    doctorId: v.string(),
    doctorRole: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Not authenticated",
        code: 401,
      });
    }

    const { patientId, doctorId, doctorRole } = args;

    const patientDoctor = await ctx.db
      .query("patient_doctor")
      .withIndex("by_patient_id_and_doctor_id", (q) =>
        q.eq("patient_id", patientId).eq("doctor_id", doctorId)
      )
      .first();

    if (!patientDoctor) {
      throw new ConvexError({
        message: "Pairing does not exist",
        code: 400,
      });
    }

    if (patientDoctor.patient_id !== patientId) {
      throw new ConvexError({
        message: "User does not have permission to update",
        code: 403,
      });
    }

    return ctx.db.patch(patientDoctor._id, {
      doctor_role: doctorRole,
    });
  },
});

export const deletePatientDoctor = mutation({
  args: {
    patientId: v.string(),
    doctorId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Not authenticated",
        code: 401,
      });
    }

    const { patientId, doctorId } = args;

    const patientDoctor = await ctx.db
      .query("patient_doctor")
      .withIndex("by_patient_id_and_doctor_id", (q) =>
        q.eq("patient_id", patientId).eq("doctor_id", doctorId)
      )
      .first();

    if (!patientDoctor) {
      throw new ConvexError({
        message: "Pairing does not exist",
        code: 400,
      });
    }

    return ctx.db.delete(patientDoctor._id);
  },
});
