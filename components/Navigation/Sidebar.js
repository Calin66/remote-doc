import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Modal from "../Modal";

function Sidebar({ links }) {
  const role = Cookies.get("role");
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);

  const { logout } = useAuth();

  const linksMedic = [
    {
      title: "Pacienti",
      href: "/pacienti",
    },
    {
      title: "Calendar",
      href: "/programari",
    },
    {
      title: "Setari",
      href: "/setari",
    },
  ];

  const linksPacient = [
    { title: "Acasa", href: "/" },
    { title: "Calendar", href: "/programari" },
    { title: "Harta", href: "/harta" },
    { title: "Setari", href: "/setari" },
  ];

  if (role === "pacient")
    return (
      <>
        {openModal && (
          <Modal
            setOpenModal={setOpenModal}
            linksMedic={linksMedic}
            linksPacient={linksPacient}
          />
        )}
        <div
          onClick={() => setOpenModal(true)}
          className="bg-white text-black w-12 h-12 rounded-br-xl p-2 flex flex-col items-center justify-center text-3xl ml-2 mt-2 shadow-4xl absolute  md:hidden z-40 cursor-pointer"
        >
          <i className="fa-solid fa-bars"></i>
        </div>
        <div className="flex-col items-center py-20 left-0 h-screen bg-white w-20 shadow-2xl z-50 fixed text-2xl justify-between hidden md:flex">
          <div>
            <div className=" bg-c5 w-14 h-14 flex flex-col items-center justify-center p-2 rounded-2xl text-white cursor-pointer mb-20 hover:scale-110">
              <Link href="/">
                <i className="fa-solid fa-notes-medical"></i>
              </Link>
            </div>
            <div className="flex flex-col items-center bg-c5 text-white w-14 py-10 rounded-2xl justify-around h-80">
              {/* <i className="fa-solid fa-stethoscope mb-10"></i> */}
              <Link href="/programari">
                <i className="fa-solid fa-calendar-days"></i>
              </Link>
              <Link href="/chat" className="hover:scale-110">
                <i className="fa-solid fa-comments"></i>
              </Link>
              <Link href="/harta" className="hover:scale-110">
                <i className="fa-solid fa-map-location-dot"></i>
              </Link>
              <Link href="/setari" className="hover:scale-110">
                <i className="fa-solid fa-gear"></i>
              </Link>
            </div>
          </div>

          <div
            className="bg-red-600 w-14 h-14 flex flex-col items-center justify-center p-2 rounded-2xl text-white cursor-pointer hover:scale-110"
            onClick={() => {
              console.log("logout");
              logout();
              router.reload();
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </div>

          {/* <div className=" absolute left-14 border bg-white  rounded-full text-black w-8 h-8 flex items-center justify-center shadow-4xl cursor-pointer">
          <i className="fa-solid fa-right"></i>
        </div> */}
        </div>
      </>
    );
  else if (role === "medic")
    return (
      <>
        {openModal && (
          <Modal
            setOpenModal={setOpenModal}
            linksMedic={linksMedic}
            linksPacient={linksPacient}
          />
        )}
        <div
          onClick={() => setOpenModal(true)}
          className="bg-white text-black w-12 h-12 rounded-br-xl p-2 flex flex-col items-center justify-center text-3xl ml-2 mt-2 shadow-3xl absolute  md:hidden z-40 cursor-pointer"
        >
          <i className="fa-solid fa-bars"></i>
        </div>
        <div className="flex-col items-center py-20 left-0 h-screen bg-white w-20 shadow-2xl z-50 fixed text-2xl justify-between hidden md:flex">
          <div>
            <div className=" bg-c2 w-14 h-14 flex flex-col items-center justify-center p-2 rounded-2xl text-white cursor-pointer mb-20 hover:scale-110">
              <Link href="/pacienti">
                <i className="fa-solid fa-notes-medical"></i>
              </Link>
            </div>
            <div className="flex flex-col items-center bg-c2 text-white w-14 py-10 rounded-2xl justify-around h-80">
              {/* <i className="fa-solid fa-stethoscope mb-10"></i> */}
              <Link href="/programari">
                <i className="fa-solid fa-calendar-days"></i>
              </Link>
              <Link href="/chat" className="hover:scale-110">
                <i className="fa-solid fa-comments"></i>
              </Link>
              <Link href="/qrcode" className="hover:scale-110">
                <i className="fa-solid fa-qrcode"></i>
              </Link>

              <Link href="/setari" className="hover:scale-110">
                <i className="fa-solid fa-gear"></i>
              </Link>
            </div>
          </div>
          <div
            className="bg-red-600 w-14 h-14 flex flex-col items-center justify-center p-2 rounded-2xl text-white cursor-pointer hover:scale-110"
            onClick={() => {
              console.log("logout");
              logout();
              router.push("/");
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </div>

          {/* <div className=" absolute left-14 border bg-white  rounded-full text-black w-8 h-8 flex items-center justify-center shadow-4xl cursor-pointer">
          <i className="fa-solid fa-right"></i>
        </div> */}
        </div>
      </>
    );
}

export default Sidebar;
