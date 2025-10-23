'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold mb-4">Une erreur est survenue</h2>
        <p className="text-dark-500 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="btn btn-primary"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
