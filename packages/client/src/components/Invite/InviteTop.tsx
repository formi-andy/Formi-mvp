export default function InviteTop({ role }: { role: string }) {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-10">
      <div className="flex flex-col flex-1 gap-y-2">
        <p className="text-4xl font-medium">Invites</p>
        {role === "doctor" ? (
          <p className="text-sm">
            Your invites to join your patients' care team will show up here.
          </p>
        ) : (
          <p className="text-sm">
            Your invites to your doctors to join your care team will show up
            here.
          </p>
        )}
      </div>
      <div>
        <button className="border rounded-lg px-4 py-2 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition">
          {role === "doctor" ? "View your code" : "Invite a doctor"}
        </button>
      </div>
    </div>
  );
}
