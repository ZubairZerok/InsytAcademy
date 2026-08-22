"use client";

import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      variant="primary"
      className="bg-neon-green text-black font-bold hover:bg-neon-green/90"
      onClick={() => {
        window.print();
      }}
    >
      EXPORT AS PDF
    </Button>
  );
}
