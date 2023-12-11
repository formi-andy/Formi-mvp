import { ReactNode } from "react";
import AdminHeader from "@/components/Header/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <AdminHeader />
      <div className="px-8 py-4">{children}</div>
    </div>
  );
}
