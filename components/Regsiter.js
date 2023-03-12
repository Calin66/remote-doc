import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  return (
    <div className="w-full flex flex-col items-center md:w-1/2 self-center md:border border-c2 rounded-lg md:py-20">
      <h1 className="text-2xl font-medium">Signup</h1>
      <div className="flex flex-col w-5/6 md:flex-row ">
        <Link
          href="/register/medic"
          className="w-full  bg-c2 flex flex-col justify-center text-center py-20 md:py-24  mt-10 rounded-xl md:mr-10"
        >
          <i className="fa-solid fa-user-doctor text-white text-6xl"></i>
        </Link>
        <Link
          href="/register/pacient"
          className="w-full bg-c5 flex flex-col justify-center text-center py-20 md:py-24 mt-10 rounded-xl md:ml-10"
        >
          <i className="fa-solid fa-user text-white text-6xl"></i>
        </Link>
      </div>
      <Link href="/login" className="mt-10 text-lg">
        Ai deja cont? Login <span className="text-c2 font-semibold">aici</span>
      </Link>
    </div>
  );
}
