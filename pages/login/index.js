import Login from "@/components/Login";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";

function index() {
  return (
    <div className="w-full flex flex-col">
      <Login />
    </div>
  );
}

export default index;
