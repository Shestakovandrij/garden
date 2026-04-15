import { getCurrentUser } from "@/engine/lib/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/engine/components/admin-shell";

export const metadata = { title: "Admin Panel" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if it's the login page
  return <AdminShell>{children}</AdminShell>;
}
