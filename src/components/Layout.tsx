import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen">
      <div className="texture" />
      {children}
    </div>
  );
}