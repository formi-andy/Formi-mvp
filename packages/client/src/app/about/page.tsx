import React from "react";

type Props = {};

const AboutPage = (props: Props) => {
  return (
    <div className="min-h-screen py-8 flex flex-col gap-y-4 text-center">
      <p className="text-3xl font-bold">What is HomeScope?</p>
      <p className="italic color-slate-500 text-xl">
        &quot;Test Text Test Text Test Text Test Text Test Text Test Text Test
        TextTest Text Test Text Test Text&quot;
      </p>
      <p>
        Test Text Test Text Test Text Test Text Test Text Test Text Test Text
        Test Text Test Text Test Text Test Text Test Text Test Text Test Text
        Test Text Test Text Test Text Test Text Test Text Test Text
      </p>
      <p className="text-3xl font-bold">Mission and Vision</p>
      <p>
        Test Text Test Text Test Text Test Text Test Text Test Text Test Text
        Test Text Test Text Test Text
      </p>
      <p className="text-3xl font-bold">Mission and Vision</p>
      <p>
        Columbia Doctoral Candidates with years of experience Test Text Test
        Text Test Text Test Text
      </p>
    </div>
  );
};

export default AboutPage;
