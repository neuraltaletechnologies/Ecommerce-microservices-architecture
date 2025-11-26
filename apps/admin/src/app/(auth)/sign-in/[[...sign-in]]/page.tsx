import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to manage your store</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl border border-gray-200 rounded-2xl bg-white",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            }
          }}
          routing="path"
          path="/sign-in"
          signUpUrl={undefined}
        />
      </div>
    </div>
  );
}
