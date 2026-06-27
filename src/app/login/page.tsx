"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shield } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full mt-4" type="submit" disabled={pending}>
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  // Show a toast if there is an error
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50/50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
        <div className="space-y-2 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Secure Admin Login
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your credentials to access the dashboard
          </p>
        </div>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                id="email"
                placeholder="admin@bmepharma.com"
                required
                type="email"
                name="email"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <Input
                id="password"
                required
                type="password"
                name="password"
                className="w-full"
              />
            </div>

            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
