import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Navigation() {
  return (
    <>
      <div className="sticky top-0 w-full left-0 bg-inherit flex items-center justify-between px-8 py-5 border-b border-solid border-black text-lg">
        <Link href="/">Remote Doc</Link>
        <Link
          href="/register"
          className=" bg-c5 text-white px-10 py-2 rounded-lg text-base"
        >
          Signup
        </Link>
      </div>
    </>
  );
}
