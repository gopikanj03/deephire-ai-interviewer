"use client";

import React from "react";
import Header from "./_components/Header";
import { usePathname } from "next/navigation";

function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Check if the current path is in the "proceed" folder
  const hideHeader = pathname.startsWith("app/dashboard/interview/[interviewid]/proceed");

  return (
    <div>
      {/* Render Header only if not in /proceed path */}
      {!hideHeader && <Header />}
      <div >{children}</div>
    </div>
  );
}

export default DashboardLayout;