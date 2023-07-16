import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-between items-center px-4 md:px-8 w-full border-b py-4 mb-8">
      <p className="text-2xl font-medium">Homescope</p>
      <Link href="login" className="border rounded px-4 py-1">
        Login
      </Link>
    </div>
  );
}
