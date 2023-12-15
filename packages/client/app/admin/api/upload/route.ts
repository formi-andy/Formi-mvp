import { Storage } from "@google-cloud/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCWwmuO6ko5ZPMo\n6zWV+tthAm14kuz3f8eLu+8aaRrJSPQb7XU7TrFP5RqWEY4GK+//P/24TrCAwUxr\nqEUr4jIK7udGYiFSWP69/tBX/lckW8VzD5QnwZfaRAn8ddDD1O7UdlcJ/TLANf11\n1HdHQl5LdRhk6ylLB+quOEgddfjarwFxYqYn5QTgifpZTrGzkP/c6eqNxXUFMU7q\nTSGYXH/scv2Pjvl3Jb0a+libmfMem38RFoHmEZ3OFEZocs41ATN99/8SdgTFPvag\n7bWPqzgj00OgtIME4Rp6Q0WyA9Ziq3yM/fFW8Um2hGrTaEyf9H50O/D2Pfu56h7H\nF7CFA+XZAgMBAAECggEAB1Pd1hPaYoQrzKjAcWpaMJKyO9kQV+gUpkMOy37Ut96q\nFscDTeWn327bf8D/4TO2tfZbRt90QfdwCnXvhSmFlMIPgnx3vo2BNdgYmLfnbmbG\ntK5kkH+4ky0Zblu5N1UcyQp53CXVY9t78IOdZI/iQdKoMK3v00WVCSP5+Iyb+Uaf\n/6iTWyKk6vlHnH/XDE92Z6goYxfRJIoY6bjlGrfgarT1RU4ZQHCS9WRIsEb+Vf0N\ngfMigfAqp7Jxibk491mb41Q5CrLYf0w4xvh1CL20ItQ/RQF48IW0DtsCR6Me9AV/\nd6xZREqqtqKuYIXzVNYlXpKCJxPlnFFkhKFfewETDQKBgQDNFEIhvCQOXQUOl4L5\n4Zp7UBRwDzALzjH4RNdchBOVsmExF9HS9wB7BWsMDYbMQZ3ku3Cjgq3hg02Wrdh5\n6flq2ueOIfvMyLLovs0NVqWWMZ4hBCpEYh9DD/k1n04toCISGcdVlc7pskQULPrY\nLU/ZmF0JwCediHcQR889HU302wKBgQC8MVyEkp57OtX2wLsWHD652xT28jsfy5u2\nM2MO72Xmf8gWk6kkfxEJu9381Zg0sBELO8Q15tTT+qSC/92zk/kjS6ojAY5sV4dW\ntlMw+Y2rzfKNMIQLdW1MHGR+F2MLBVVc+6BcFa9zR8J/1GMVS3M77DHpclOFFuVi\nJBd3aMJUWwKBgB6Khc7AVh5NfBNQPRE5p+f1ZRXLLTyU2JxApFIC2WfRyOemxHjG\nkCvCAs8otIp2uyz1PTEcpQiQpV1rRnHhhmODdjiUlwtIWFyRDbiOztovSX1hQWot\nsroqBtMVhm8FCg3oCOeWB9qF0d2vVSwck2e0aSaqlzu+tvyVtSdE1fdBAoGAOVkF\na3TOjJjSSN5UZJl41+QWEGaic771FWG1ZwC22bXIwHCA05lRFNlF/V0Ng8i/eN/e\nm9pasronVbAo3CdUfVf6Ya6Auy01Fcx7r2nsrRUWO8Y0BtXi15WzXeU8jkgyyiH3\nrPgCvit47sFG7F9Qn0sLrqrjHqRqhCyhZgbraQ8CgYEAw5w53xVRFze4VScTiu4l\nHeBJ7vnD+EluGvvX+VlDCKJnjlxI0eX/vsiPVNIZjAN6DYUsrhtRPD/yi03AvdOD\n9Nzg0gn0jFf+dUJQytjqxFVcFM6xehPyMATBoAMF/76Ym8EeqBNbyGX39qSB0FY9\nNllbqpbgp8xnfpXDgh0aLdU=\n-----END PRIVATE KEY-----\n",
      client_email: "850586775059-compute@developer.gserviceaccount.com",
    },
  });

  console.log("req: ", searchParams);

  const bucket = storage.bucket(process.env.GCP_STORAGE_BUCKET ?? "");
  const file = bucket.file(searchParams.get("file") ?? "");
  const options = {
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
    fields: { "x-goog-meta-test": "data" },
  };

  const [response] = await file.generateSignedPostPolicyV4(options);
  // res.status(200).json(response);
  return new Response(JSON.stringify(response));
}
