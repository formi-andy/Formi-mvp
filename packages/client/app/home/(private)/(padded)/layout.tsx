import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 md:px-8 min-h-[calc(100vh_-_117px)] py-8 flex flex-col relative">
      {children}
    </div>
  );
}
