import { ContactForm } from "@/components/ContactForm/ContactForm";

const page = () => {
  return (
    <div className="min-h-[calc(100vh_-_152px)] py-8 flex flex-col items-center w-full gap-y-12">
      <p className="text-3xl sm:[font-size:3rem] sm:[line-height:1.25] xl:[line-height:1.25] xl:[font-size:3.75rem] font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-500">
        Questions? We have answers
      </p>
      <div className="flex flex-col text-xl sm:text-2xl items-center">
        <p className="text-center">
            We&rsquo;re here to help and answer any question you might have.
        </p>
      </div>
      <ContactForm />
    </div>
  );
};

export default page;
