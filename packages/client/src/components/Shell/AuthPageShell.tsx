import React from "react";

type Props = {
  children: React.ReactNode;
};

export const AuthPageShell = ({ children }: Props) => {
  return (
    <div className="flex justify-center w-full h-full items-center bg-cyan-600">
      {children}
    </div>
  );
};
