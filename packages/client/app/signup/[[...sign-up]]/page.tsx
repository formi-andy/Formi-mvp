import { SignUp as ClerkSignUp } from "@clerk/nextjs";

const SignUp = () => {
  return (
    <div className="flex flex-1 justify-center items-center flex-col w-full">
      <ClerkSignUp
        path="/signup"
        redirectUrl={"dashboard"}
        unsafeMetadata={{ tutorial: false }}
      />
    </div>
  );
};

export default SignUp;
