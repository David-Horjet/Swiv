import Link from "next/link";

export default function Logo() {
  return (
    <div>
      <Link href={"/"} className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-blue-500"></div>
        <span className="ml-2 text-xl font-bold">Swiv</span>
      </Link>
    </div>
  );
}
