import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh_-_117px)] flex flex-col relative">
      {children}
    </div>
  );
}
