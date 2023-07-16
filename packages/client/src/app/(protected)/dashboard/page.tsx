import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-y-4 w-full py-8">
      <div className="rounded-lg p-4 border flex justify-between flex-col gap-4 items-center sm:flex-row">
        <p className="text-xl">City of San Francisco</p>
        <Link href="/directory" className="text-xl text-blue-500 w-fit">
          Directory
        </Link>
      </div>
      <div className="flex flex-col items-center rounded-lg p-4 border">
        <p>Input</p>
      </div>
    </div>
  );
}
