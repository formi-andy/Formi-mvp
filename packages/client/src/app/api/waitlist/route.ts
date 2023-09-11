import { firestore } from "../../../lib/firestore"; // Adjust the path to point to your firestore.ts file

type Payload = {
  email: string;
};

export async function POST(request: Request) {
  const requestData: Payload = await request.json();

  if (!requestData || !requestData.email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await firestore.collection("waitlist").doc(requestData.email).set(
      {
        email: requestData.email,
        createdAt: new Date(),
      },
      { merge: true }
    );

    return new Response(
      JSON.stringify({ message: `${requestData.email} added to waitlist` }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Error(
      JSON.stringify({ error: "Error adding email to the database" })
    );
  }
}
