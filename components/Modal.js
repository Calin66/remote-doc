import Link from "next/link";
import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { useAuth } from "../context/AuthContext";

export default function Modal(props) {
  const { setOpenModal, links } = props;
  const [_document, set_document] = useState(null);
  const { logout } = useAuth();
  const { currentUser } = useAuth();

  useEffect(() => {
    set_document(document);
  }, []);

  if (!_document) {
    return null;
  }

  return ReactDom.createPortal(
    <div>
      {currentUser ? (
        <div className="fixed w-screen h-screen top-0 left-0 bg-white text-lg flex flex-col ">
          <div className="flex items-center justify-between  p-4 px-8 py-5 border-b border-solid border-c2">
            <h1 className="font-bold text-2xl select-none ">Meniu</h1>
            <i
              onClick={() => setOpenModal(false)}
              className="fa-solid fa-xmark duration-300 hover:rotate-90 cursor-pointer text-3xl"
            ></i>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {links.map((link, i) => (
              <Link
                key={i}
                className="px-4 text-2xl mt-10"
                href={link.href}
                onClick={() => setOpenModal(false)}
              >
                {link.title}
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                setOpenModal(false);
              }}
              className=" self-center bg-red-500 p-3 w-60 text-white rounded-xl font-bold text-xl mt-14"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed w-screen h-screen top-0 left-0 bg-white text-lg flex flex-col ">
          <div className="flex items-center justify-between  p-4 px-8 py-5 border-b border-solid border-c2">
            <h1 className="font-bold text-2xl select-none ">Meniu</h1>
            <i
              onClick={() => setOpenModal(false)}
              className="fa-solid fa-xmark duration-300 hover:rotate-90 cursor-pointer text-3xl"
            ></i>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => {
                setOpenModal(false);
              }}
              className=" self-center bg-c2 p-4 w-60 text-white rounded-xl font-bold text-xl mt-14 text-center"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => {
                setOpenModal(false);
              }}
              className=" self-center bg-c3 p-4 w-60 text-white rounded-xl font-bold text-xl mt-6 text-center"
            >
              Signup
            </Link>
          </div>
        </div>
      )}
    </div>,
    _document.getElementById("portal")
  );
}
