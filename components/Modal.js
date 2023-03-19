import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { useAuth } from "../context/AuthContext";

export default function Modal(props) {
  const { setOpenModal, linksMedic, linksPacient } = props;
  const [_document, set_document] = useState(null);
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const role = Cookies.get("role");

  useEffect(() => {
    set_document(document);
  }, []);

  if (!_document) {
    return null;
  }
  return ReactDom.createPortal(
    <div>
      {role === "medic" && (
        <div className="fixed w-screen h-screen top-0 left-0 bg-white text-lg flex flex-col z-50">
          <div className="flex items-center justify-between  p-4 px-10 py-5 border-b border-solid border-c2">
            <Link
              href="/pacienti"
              className="font-semibold text-xl select-none "
            >
              Remote Doc
            </Link>
            <i
              onClick={() => setOpenModal(false)}
              className="fa-solid fa-xmark duration-300 hover:rotate-90 cursor-pointer text-3xl"
            ></i>
          </div>
          <div className="p-4 flex flex-col gap-3 text-center justify-around h-full">
            <div className="flex flex-col text-2xl mt-20">
              <Link
                href="/pacienti"
                className="flex flex-col mb-14 "
                onClick={() => setOpenModal(false)}
              >
                <i className="fa-solid fa-notes-medical text-c2 "></i>
                Pacienti
              </Link>
              {/* <i className="fa-solid fa-stethoscope mb-10"></i> */}
              <Link
                href="/calendar"
                className="flex flex-col mb-14"
                onClick={() => setOpenModal(false)}
              >
                <i className="fa-solid fa-calendar-days text-c2"></i>
                Calendar
              </Link>

              <Link
                href="/setari"
                className="flex flex-col mb-10 "
                onClick={() => setOpenModal(false)}
              >
                <i className="fa-solid fa-gear text-c2"></i>
                Setari
              </Link>
            </div>
            <div
              className="bg-red-600 flex flex-col w-1/2 py-2 self-center items-center justify-center rounded-2xl text-white cursor-pointer font-medium"
              onClick={() => {
                console.log("logout");
                logout();
                router.push("/");
              }}
            >
              Logout
            </div>
          </div>
        </div>
      )}
      {role === "pacient" && (
        <div className="fixed w-screen h-screen top-0 left-0 bg-white text-lg flex flex-col z-50">
          <div className="flex items-center justify-between  p-4 px-10 py-5 border-b border-solid border-c5">
            <Link href="/" className="font-semibold text-xl select-none ">
              Remote Doc
            </Link>
            <i
              onClick={() => setOpenModal(false)}
              className="fa-solid fa-xmark duration-300 hover:rotate-90 cursor-pointer text-3xl"
            ></i>
          </div>
          <div className="p-4 flex flex-col gap-3 text-center justify-around h-full">
            <div className="flex flex-col text-2xl mt-20">
              <Link
                href="/"
                className="flex flex-col mb-14 "
                onClick={() => setOpenModal(false)}
              >
                <i className="fa-solid fa-laptop-medical text-c5"></i>
                Acasa
              </Link>
              {/* <i className="fa-solid fa-stethoscope mb-10"></i> */}
              <Link
                href="/calendar"
                className="flex flex-col mb-14"
                onClick={() => setOpenModal(false)}
              >
                <i className="fa-solid fa-map-location-dot text-c5"></i>
                Calendar
              </Link>

              <Link
                href="/harta"
                className="flex flex-col mb-14"
                onClick={() => setOpenModal(false)}
              >
                <i className="fa-solid fa-calendar-days text-c5"></i>
                Harta
              </Link>

              <Link
                href="/setari"
                className="flex flex-col mb-10 "
                onClick={() => setOpenModal(false)}
              >
                <i className="fa-solid fa-gear text-c5"></i>
                Setari
              </Link>
            </div>
            <div
              className="bg-red-600 flex flex-col w-1/2 py-2 self-center items-center justify-center rounded-2xl text-white cursor-pointer font-medium"
              onClick={() => {
                console.log("logout");
                logout();
                router.push("/");
              }}
            >
              Logout
            </div>
          </div>
        </div>
      )}
    </div>,
    _document.getElementById("portal")
  );
}
