import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            This device is not recognized. For security reasons, please verify your identity.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/sign-in"
            className="block w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition"
          >
            Sign In Again
          </Link>
          
          <Link 
            href="/"
            className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
