import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br text-basic w-full">
      <h1 className="text-9xl font-bold">404</h1>
      <p className="text-2xl mt-4">Oops! Page not found.</p>
      <p className="text-lg mt-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-primary font-semibold rounded-lg shadow-lg hover:bg-basic/50 transition duration-300 text-basic-100 hover:text-basic"
      >
        Go Back Home
      </Link>
    </div>
  );
}
