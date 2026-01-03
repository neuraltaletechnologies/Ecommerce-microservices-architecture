"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCcw, ArrowLeft, LifeBuoy } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Admin Error caught by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-slate-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Admin Panel Error
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-2 text-lg">
            An unexpected error occurred in the admin dashboard.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            The system has logged this error for investigation.
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-8 text-left">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm font-semibold text-red-800">
                  Error Details (Development Mode)
                </p>
              </div>
              <div className="bg-red-100 rounded p-3">
                <p className="text-xs text-red-900 font-mono break-all">
                  {error.message || "Unknown error"}
                </p>
                {error.stack && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-700 cursor-pointer hover:text-red-900">
                      Stack Trace
                    </summary>
                    <pre className="text-xs text-red-800 mt-2 overflow-auto max-h-40">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2 font-medium">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={reset}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#001E3C] to-[#0A7EA4] hover:from-[#0A7EA4] hover:to-[#001E3C] text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <RefreshCcw className="w-5 h-5" />
              Try Again
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" />
              Dashboard Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Admin Help Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <LifeBuoy className="w-5 h-5 text-[#0A7EA4]" />
              <p className="text-sm font-semibold text-gray-700">
                Need Technical Support?
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                For urgent issues, contact the technical team:
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm">
                <a
                  href="mailto:admin@neuraltale.com"
                  className="text-[#0A7EA4] hover:text-[#001E3C] font-medium underline"
                >
                  admin@neuraltale.com
                </a>
                <span className="hidden sm:inline text-gray-400">|</span>
                <a
                  href="tel:+1234567890"
                  className="text-[#0A7EA4] hover:text-[#001E3C] font-medium underline"
                >
                  +255 653 520 829  
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Error Code: {error.digest || "UNKNOWN"} | Neuraltale Admin Panel v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
