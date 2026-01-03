"use client";

import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft, Lock, User } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Unauthorized Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-slate-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-2 text-lg">
            You don't have permission to access the admin panel.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            This area is restricted to authorized administrators only.
          </p>

          {/* Access Requirements */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-amber-900">
                Admin Access Required
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>You must be logged in with an administrator account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Your account must have proper admin permissions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Contact your system administrator for access</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-in"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#001E3C] to-[#0A7EA4] hover:from-[#0A7EA4] hover:to-[#001E3C] text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <User className="w-5 h-5" />
              Sign In as Admin
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Contact Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <p className="text-sm font-semibold text-gray-700">
                Need Administrator Access?
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                If you believe you should have access, please contact:
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm">
                <a
                  href="mailto:admin@neuraltale.com"
                  className="text-[#0A7EA4] hover:text-[#001E3C] font-medium underline"
                >
                  admin@neuraltale.com
                </a>
                <span className="hidden sm:inline text-gray-400">|</span>
                <span className="text-gray-600">System Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Error 403: Forbidden | Neuraltale Admin Panel v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
