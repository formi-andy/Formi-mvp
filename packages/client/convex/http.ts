import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { Id } from "./_generated/dataModel";

function ensureEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`missing environment variable ${name}`);
  }
  return value;
}

const webhookSecret = ensureEnvironmentVariable("CLERK_WEBHOOK_SECRET");

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Error occured", {
      status: 400,
    });
  }
  switch (event.type) {
    case "user.created": // intentional fallthrough
    case "user.updated": {
      const existingUser = await ctx.runQuery(internal.users.getClerkUser, {
        subject: event.data.id,
      });
      if (existingUser && event.type === "user.created") {
        console.warn("Overwriting user", event.data.id, "with", event.data);
      }
      console.log("creating/updating user", event.data.id);
      await ctx.runMutation(internal.users.updateOrCreateUser, {
        clerkUser: event.data,
      });
      break;
    }
    case "user.deleted": {
      // Clerk docs say this is required, but the types say optional?
      const id = event.data.id!;
      await ctx.runMutation(internal.users.deleteUser, {
        id,
      });
      break;
    }
    default: {
      console.log("ignored Clerk webhook event", event.type);
    }
  }
  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

async function validateRequest(
  req: Request
): Promise<WebhookEvent | undefined> {
  const payloadString = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (_) {
    console.log("error verifying");
    return;
  }

  return evt as unknown as WebhookEvent;
}

// TODO: secure this route
// This is a custom HTTP route that accepts a file upload and stores it
http.route({
  path: "/send-image",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Step 1: Store the file
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    // Step 2: Save the storage ID to the database via a mutation
    const patientId = new URL(request.url).searchParams.get("patientId");
    const title = new URL(request.url).searchParams.get("title")!;
    await ctx.runMutation(internal.images.storeImage, {
      storageId,
      title,
      patientId: patientId as Id<"users"> | null,
    });

    // Step 3: Return a response with the correct CORS headers
    return new Response(
      JSON.stringify({
        patientId,
        storageId,
      }),
      {
        status: 200,
        // CORS headers
        headers: new Headers({
          // e.g. https://mywebsite.com
          "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
          Vary: "origin",
        }),
      }
    );
  }),
});

// Pre-flight request for /sendImage
http.route({
  path: "/send-image",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com
          "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest, Authorization",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

// Scale labeling callback route
http.route({
  path: "/scale-callback",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const headers = request.headers;

    if (
      headers.get("scale-callback-auth") !== process.env.SCALE_CALLBACK_AUTH_KEY
    ) {
      return new Response(null, {
        status: 401,
      });
    }

    const { task } = body;

    if (!task) {
      return new Response(null, {
        status: 200,
      });
    }
    const { attempts } = task;
    const { storageId } = task.metadata;

    const image = await ctx.runQuery(internal.images.getImageByStorageId, {
      storageId,
    });

    const diagnosis = attempts.map((attempt: any) => ({
      diagnosis: attempt.response.annotations.ear_infection.response[0][0],
      notes: attempt.response.annotations["Notes"].response[0],
    }));

    await ctx.runMutation(internal.images.diagnosisCallback, {
      id: image._id,
      diagnosis,
    });
    return new Response(null, {
      status: 200,
    });
  }),
});

export default http;
