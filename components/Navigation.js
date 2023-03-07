import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Navigation() {
  return (
    <>
      <div className="sticky top-0 w-full left-0 bg-inherit flex items-center justify-between p-4 border-b border-solid border-white">
        <Link href="/">Remote Doc</Link>
        <Link href="/register">Register</Link>
      </div>
    </>
  );
}
