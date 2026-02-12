import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#001E3C]/10 via-white to-[#0A7EA4]/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo.png" 
              alt="Neurashop Logo" 
              width={64} 
              height={64}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to manage your store</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl border border-gray-200 rounded-2xl bg-white",
              formButtonPrimary: "bg-[#001E3C] hover:bg-[#0A7EA4]",
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
