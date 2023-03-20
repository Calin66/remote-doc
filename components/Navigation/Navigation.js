import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function Navigation() {
  return <Sidebar />;
}

// return (
//   <>

//     {/* <Link href="/" className=" text-2xl font-bold">
//         <span className=" font-normal">Remote</span>{" "}
//         <span className=" text-c2 ">Doc</span>
//       </Link> */}
//     {/* {role === "medic" && (
//         <>
//           <div className="md:flex justify-center items-center hidden">
//             {linksMedic.map((link, i) => (
//               <Link key={i} className="px-4" href={link.href}>
//                 {link.title}
//               </Link>
//             ))}
//           </div>

//           <i
//             className="fa-solid fa-bars text-3xl md:hidden"
//             onClick={() => setOpenModal(true)}
//           ></i>
//         </>
//       )} */}
//     {/* {role === "pacient" && (
//         <>
//           <div className="md:flex justify-center items-center hidden">
//             {linksPacient.map((link, i) => (
//               <Link key={i} className="px-4" href={link.href}>
//                 {link.title}
//               </Link>
//             ))}
//           </div>

//           <i
//             className="fa-solid fa-bars text-3xl md:hidden"
//             onClick={() => setOpenModal(true)}
//           ></i>
//         </>
//       )} */}
//     {/* {!role && (
//         <div>
//           <div className=" hidden sm:block">
//             <Link
//               href="/register"
//               className="bg-c2 py-2 w-32 inline-block text-white rounded-lg text-xl text-center mr-8"
//             >
//               Signup
//             </Link>
//             <Link
//               href="/login"
//               className="border border-c2 py-2 w-32 inline-block text-c2 rounded-lg text-xl text-center"
//             >
//               Login
//             </Link>
//           </div>
//           <i
//             className="fa-solid fa-bars text-3xl sm:hidden"
//             onClick={() => setOpenModal(true)}
//           ></i>
//         </div>
//       )}
//       {role && (
//         <div className="hidden md:inline-block">
//           <button
//             onClick={() => {
//               logout();
//               router.push("/");
//               setOpenModal(false);
//             }}
//             className="bg-red-600 py-1 w-28 text-white rounded-lg text-lg font-medium rounded-tr-none text-center hidden md:inline-block hover:bg-red-700"
//           >
//             logout
//           </button>
//         </div>
//       )} */}
//     {/* {currentUser && (
//         <div className="md:hidden justify-center items-center  flex">
//           <i
//             className="fa-solid fa-bars text-3xl md:hidden"
//             onClick={() => setOpenModal(true)}
//           ></i>
//         </div>
//       )} */}
//   </>
// );
