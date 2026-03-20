"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCcw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error caught by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-2 text-lg">
            We encountered an unexpected error while processing your request.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Don't worry, our team has been notified and we're working to fix it.
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm font-semibold text-red-800 mb-2">
                Error Details (Development Mode):
              </p>
              <p className="text-xs text-red-700 font-mono break-all">
                {error.message || "Unknown error"}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={reset}
              className="w-full sm:w-auto px-6 py-3 bg-[#FDB913] hover:bg-[#e5a811] text-[#001E3C] font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <RefreshCcw className="w-5 h-5" />
              Try Again
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-[#001E3C] hover:bg-[#0A7EA4] text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border-2 border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If this problem persists, please{" "}
              <Link
                href="/contact"
                className="text-[#0A7EA4] hover:text-[#001E3C] font-medium underline"
              >
                contact our support team
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Error Code: {error.digest || "UNKNOWN"} | Neuraltale E-Commerce
          </p>
        </div>
      </div>
    </div>
  );
}
