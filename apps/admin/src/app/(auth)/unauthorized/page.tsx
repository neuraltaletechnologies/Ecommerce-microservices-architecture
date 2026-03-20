"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { AlertCircle, ShieldX, LogOut, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border-red-200">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX className="w-12 h-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Access Denied
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            You don't have permission to access the admin dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 mb-1">
                  Admin Access Required
                </p>
                <p className="text-sm text-red-700">
                  This area is restricted to administrators only. If you believe you should have access, please contact your system administrator.
                </p>
              </div>
            </div>
          </div>

          {user && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Current Account
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.fullName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button 
            onClick={() => signOut()} 
            variant="destructive"
            className="w-full"
            size="lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Link href="https://neurashop.neuraltale.com">
              <Home className="w-4 h-4 mr-2" />
              Go to User Store
            </Link>
          </Button>

          <p className="text-xs text-center text-gray-500 mt-2">
            Need admin access? Contact{" "}
            <a href="mailto:support@neuraltale.com" className="text-[#0A7EA4] hover:underline">
              support@neuraltale.com
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
