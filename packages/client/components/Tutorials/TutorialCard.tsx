import React from "react";

const TutorialCard = () => {
  const embedCode = "dQw4w9WgXcQ";

  return (
    <div className="p-8 rounded-lg flex flex-col justify-center gap-y-4 md:gap-y-6 lg:gap-y-8 border">
      <div className="flex flex-col gap-y-2 md:gap-y-3 lg:gap-y-4 items-center">
        <p className="text-lg md:text-xl lg:text-2xl text-center">
          How to use the HomeScope Otoscope
        </p>
        <p className="text-base md:text-lg lg:text-xl text-slate-500 text-center">
          Andy from HomeScope showcases how to use the device safely without
          causing discomfort in the ear. We also cover what effective pictures
          look like and how to best use the otoscope to capture them.
        </p>
      </div>
      <div className="aspect-video">
        <iframe
          className="relative h-full w-full rounded-lg"
          src={`https://www.youtube.com/embed/${embedCode}`}
          title="Rick Astley - Never Gonna Give You Up (Official Music Video)"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      </div>
    </div>
  );
};

export default TutorialCard;
