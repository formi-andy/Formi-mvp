type Payload = {
  password: string;
};

export async function POST(request: Request) {
  const requestData: Payload = await request.json();

  return new Response(
    JSON.stringify({
      verified: requestData.password === "Homescope",
      password: requestData.password,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
