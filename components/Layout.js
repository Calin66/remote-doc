import React from "react";
import Navigation from "./Navigation";

export default function Layout(props) {
  const { children } = props;
  return (
    <div className="flex flex-col min-h-screen relative bg-black text-white">
      <Navigation />
      <main className="flex-1 flex flex-col p-4">{children}</main>
    </div>
  );
}
