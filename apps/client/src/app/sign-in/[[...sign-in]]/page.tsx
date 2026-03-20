import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Neurashop</h1>
          <p className="mt-1 text-sm text-gray-600">Sign in to continue shopping</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-gray-200 rounded-2xl",
              formButtonPrimary: "bg-[#001E3C] hover:bg-[#0A7EA4]",
            }
          }}
          routing="path"
          path="/sign-in"
        />
      </div>
    </div>
  );
}
