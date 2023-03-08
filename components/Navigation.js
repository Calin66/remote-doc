import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Navigation() {
  
  const links=
  [
    {
      title:"Pacienti",
      href:"/pacienti"
    },
    {
      title:"Calendar",
      href:"/calendar"
    }
  ]
  
  return (
    <>
      <div className="sticky top-0 w-full left-0 bg-inherit flex items-center justify-between px-8 py-5 border-b border-solid border-black text-lg">
        
        <Link href="/">Remote Doc</Link>
        <div className="flex flex-row justify-left w-1/2">
        {
          links.map(link=><Link className="px-4" href={link.href} >{link.title}</Link>)
        }
        </div>
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
