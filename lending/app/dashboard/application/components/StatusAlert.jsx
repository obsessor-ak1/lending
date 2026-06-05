export default function StatusAlert({ error, success, message }) {
  if (error) {
    return (
      <div role="alert" className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-900 text-sm font-medium flex items-start gap-2 mb-6 transition-all duration-300">
        <span className="text-red-500 text-lg mt-0.5">⚠️</span>
        <div>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div role="status" className="p-4 rounded-xl border border-green-200 bg-green-50 text-green-900 text-sm font-medium flex items-start gap-2 mb-6 transition-all duration-300 animate-pulse">
        <span className="text-green-500 text-lg mt-0.5">🎉</span>
        <div>
          <strong>Success:</strong> {message || "Application submitted successfully! Redirecting..."}
        </div>
      </div>
    );
  }

  return null;
}
