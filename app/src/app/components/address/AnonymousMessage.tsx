import Link from "next/link";

export const AnonymousMessage = () => {
  return (
    <div className="w-full space-y-4 flex flex-col items-center mt-[100px]">
      <div className="text-gray-500">Please sign in to access this page</div>
      <Link href="/" className="text-primary">
        Sign in Page
      </Link>
    </div>
  );
};
