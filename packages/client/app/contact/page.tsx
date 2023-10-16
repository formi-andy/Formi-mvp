import React from "react";
import { ContactForm } from "@/components/ContactForm/ContactForm";

const page = () => {
  return (
    <div className="min-h-[calc(100vh_-_152px)] py-8 gap-y-4 flex flex-col items-center w-full">
      <p className="tracking-wide lg:tracking-wider text-blue-500 font-light text-lg lg:text-xl text-center">
        Contact Us
      </p>
      <p className="text-3xl sm:[font-size:3rem] sm:[line-height:1.25] xl:[line-height:1.25] xl:[font-size:3.75rem] font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-500">
        Questions? We have answers.
      </p>
      <div className="flex flex-col text-base md:text-xl items-center mt-12">
        <p className="text-center">
          HomeScope is dedicated to providing the best medical information to
          your medical questions.
        </p>
        <p className="text-center">
          Contact us to scope out how we can help you.
        </p>
      </div>
      <ContactForm />
    </div>
  );
};

export default page;
