import DashboardMedici from "@/components/DashboardMedici";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import Cookies from "js-cookie";

function index() {
  return (
    <div className="flex flex-col">
      <DashboardMedici />
    </div>
  );
}

export default index;
