"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  useEffect(() => {
    // Optional: Auto-print when the page loads
    // window.print();
  }, []);

  return (
    <Button onClick={() => window.print()} className="gap-2 shrink-0">
      <Printer className="w-4 h-4" /> Print Invoice
    </Button>
  );
}
