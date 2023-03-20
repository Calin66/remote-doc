import DashboardMedici from "@/components/DashboardMedici";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import Cookies from "js-cookie";

function index() {
  console.log("sunt in index.js pacienti");
  return (
    <div className="flex flex-col w-full min-h-hatz pt-10">
      <DashboardMedici />
    </div>
  );
}

export default index;
