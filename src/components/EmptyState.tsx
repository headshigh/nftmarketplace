import React from "react";
import { ReactNode } from "react";

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {children}
    </div>
  );
}

export default EmptyState;
