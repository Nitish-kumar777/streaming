'use client';

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-6">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}