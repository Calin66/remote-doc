import { NextResponse } from "next/server";
import React from "react";

function middleware(req) {
  let role = req.cookies.get("role")?.value;
  let url = req.url;
  if (role !== "medic" && url.includes("/pacienti"))
    return NextResponse.redirect("http://localhost:3000/");
  if (role && url.includes("/login"))
    return NextResponse.redirect("http://localhost:3000/");
  if (role && url.includes("/register"))
    return NextResponse.redirect("http://localhost:3000/");
}

export default middleware;
