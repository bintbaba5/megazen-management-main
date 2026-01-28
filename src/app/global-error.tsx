"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center  p-6">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Something went wrong!
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              We&apos;re sorry for the inconvenience. Please try again.{" "}
              {error.message}
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
