import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";

export default function Navigation() {
  const [openModal, setOpenModal] = useState(false);
  const { currentUser, logout } = useAuth();

  const router = useRouter();

  const role = Cookies.get("role");

  const links = [
    {
      title: "Pacienti",
      href: "/pacienti",
    },
    {
      title: "Calendar",
      href: "/calendar",
    },
    {
      title: "Harta",
      href: "/harta",
    },
    {
      title: "Setari",
      href: "/setari",
    },
  ];
  const pacientLinks = [];

  return (
    <>
      {openModal && (
        <Modal
          setOpenModal={setOpenModal}
          links={links}
          pacientLinks={pacientLinks}
        />
      )}

      <div className="sticky top-0 w-full left-0 bg-inherit flex items-center justify-between px-10 py-5 border-b border-solid border-c2 text-lg">
        <Link href="/" className=" text-xl font-semibold">
          Remote Doc
        </Link>
        {role === "medic" && (
          <>
            <div className="md:flex justify-center items-center hidden">
              {links.map((link, i) => (
                <Link key={i} className="px-4" href={link.href}>
                  {link.title}
                </Link>
              ))}
            </div>

            <i
              className="fa-solid fa-bars text-3xl md:hidden"
              onClick={() => setOpenModal(true)}
            ></i>
          </>
        )}
        {role === "pacient" && (
          <>
            <div className="md:flex justify-center items-center hidden">
              {pacientLinks.map((link, i) => (
                <Link key={i} className="px-4" href={link.href}>
                  {link.title}
                </Link>
              ))}
            </div>

            <i
              className="fa-solid fa-bars text-3xl md:hidden"
              onClick={() => setOpenModal(true)}
            ></i>
          </>
        )}
        {!role && (
          <div>
            <div className=" hidden sm:block">
              <Link
                href="/register"
                className="bg-c2 py-2 w-32 inline-block text-white rounded-lg text-xl text-center mr-8"
              >
                Signup
              </Link>
              <Link
                href="/login"
                className="border border-c2 py-2 w-32 inline-block text-c2 rounded-lg text-xl text-center"
              >
                Login
              </Link>
            </div>
            <i
              className="fa-solid fa-bars text-3xl sm:hidden"
              onClick={() => setOpenModal(true)}
            ></i>
          </div>
        )}
        {role && (
          <div className="hidden md:inline-block">
            <button
              onClick={() => {
                logout();
                router.push("/");
                setOpenModal(false);
              }}
              className="bg-red-600 py-2 w-32 text-white rounded-lg text-lg text-center hidden md:inline-block hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
        {/* {currentUser && (
          <div className="md:hidden justify-center items-center  flex">
            <i
              className="fa-solid fa-bars text-3xl md:hidden"
              onClick={() => setOpenModal(true)}
            ></i>
          </div>
        )} */}
      </div>
    </>
  );
}
