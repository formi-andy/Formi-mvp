import { mutation, internalMutation, query } from "./_generated/server";

import { ConvexError, v } from "convex/values";

export const getPatientDoctors = query({
  args: {
    patientId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Not authenticated",
        code: 401,
      });
    }

    const { patientId } = args;

    const patientDoctors = await ctx.db
      .query("patient_doctors")
      .withIndex("by_patient_id", (q) => q.eq("patient_id", patientId))
      .order("desc")
      .collect();

    return Promise.all(
      patientDoctors.map(async (doctor) => {
        let clerkUser = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) =>
            q.eq("clerkUser.id", doctor.doctor_id)
          )
          .first();

        return {
          ...doctor,
          imageUrl: clerkUser?.clerkUser.profile_image_url,
          firstName: clerkUser?.clerkUser.first_name,
          lastName: clerkUser?.clerkUser.last_name,
          email: clerkUser?.clerkUser.email_addresses,
          phone: clerkUser?.clerkUser.phone_numbers,
        };
      })
    );
  },
});

export const addPatientDoctor = mutation({
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
      .query("patient_doctors")
      .withIndex("by_patinet_id_and_doctor_id", (q) =>
        q.eq("patient_id", patientId).eq("doctor_id", doctorId)
      )
      .first();

    if (patientDoctor) {
      throw new ConvexError({
        message: "Pairing already exists",
        code: 400,
      });
    }

    return ctx.db.insert("patient_doctors", {
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
      .query("patient_doctors")
      .withIndex("by_patinet_id_and_doctor_id", (q) =>
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
      .query("patient_doctors")
      .withIndex("by_patinet_id_and_doctor_id", (q) =>
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
