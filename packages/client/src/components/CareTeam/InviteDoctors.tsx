import Link from "next/link";

export default function InviteDoctors() {
  return (
    <div className="flex flex-col w-full items-center">
      <p className="mt-1 text-sm">Invite your doctors to join your care team</p>
      <Link
        href="/invite"
        className="mt-4 font-medium border border-black rounded-lg px-4 py-2 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition"
      >
        Invite your doctors
      </Link>
    </div>
  );
}
