// src/components/LoadingSpinner.js

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-800"></div>
        <span className="mt-4 text-white">Tunggu Sebentar...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;

