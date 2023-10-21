"use client";

import { Button } from "../ui/button";

export default function UserTab() {
  return (
    <div className="flex items-center justify-center p-4 rounded-lg border w-full">
      <Button
        variant="outline-action"
        onClick={() => {
          // update user role and metadta
          // redirect to dashboard
        }}
      >
        Continue to Dashboard
      </Button>
    </div>
  );
}
