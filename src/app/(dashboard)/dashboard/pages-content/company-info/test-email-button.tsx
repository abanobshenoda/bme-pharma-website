"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendTestOrderEmail } from "@/actions/test-email-action";
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react";

export function TestEmailButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setResult(null);
    const res = await sendTestOrderEmail();
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          {loading ? "Sending Test Email..." : "Send Test Order Email"}
        </Button>
      </div>

      {result && (
        <div
          className={`flex items-start gap-2 p-3 rounded-lg text-sm border ${
            result.success
              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-800 dark:text-green-300"
              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300"
          }`}
        >
          {result.success ? (
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          )}
          <span>{result.message}</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Sends a fake order notification to the admin email above.{" "}
        <strong>No real order is created.</strong> Make sure{" "}
        <code className="bg-muted px-1 py-0.5 rounded text-[11px]">
          GMAIL_USER
        </code>{" "}
        and{" "}
        <code className="bg-muted px-1 py-0.5 rounded text-[11px]">
          GMAIL_APP_PASSWORD
        </code>{" "}
        are set in your <code className="bg-muted px-1 py-0.5 rounded text-[11px]">.env</code> file.
      </p>
    </div>
  );
}
