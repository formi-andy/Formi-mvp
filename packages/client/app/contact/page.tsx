import React from "react";
import { ContactForm } from "@/components/ContactForm/ContactForm";

const page = () => {
  return (
    <div className="min-h-[calc(100vh_-_152px)] py-8 gap-y-4 flex flex-col items-center">
      <p className="tracking-wide lg:tracking-wider text-blue-500 font-light text-lg lg:text-xl text-center">
        Contact Us
      </p>
      <ContactForm />
    </div>
  );
};

export default page;
