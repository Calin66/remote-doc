import { getAuth } from "firebase/auth";
import Image from "next/image";
import React from "react";

function IfViewer({ openFile, handleBack, handleDeleteFisier }) {
  const auth = getAuth();
  const user = auth.currentUser;

  let data = "";
  let dt;
  console.log("tuy", typeof open.data);
  if (typeof openFile.data === "string") {
    data = openFile.data;
  } else if (!openFile.data) {
    data = "Acum";
  } else {
    dt = openFile.data.toDate();
    data =
      dt.toLocaleDateString("ro-RO") +
      "  " +
      padTo2Digits(dt.getHours()) +
      ":" +
      padTo2Digits(dt.getMinutes());
  }

  function padTo2Digits(num) {
    return String(num).padStart(2, "0");
  }

  return (
    <div className=" min-h-hatz w-full">
      <div className="w-full flex flex-col mt-10">
        <div className="relative h-96 rounded-md overflow-hidden">
          {openFile.type.includes("pdf") ? (
            <iframe
              src={`${openFile.fisier}#view=fitH`}
              className=" w-full h-full "
            ></iframe>
          ) : (
            <Image
              src={openFile.fisier}
              fill
              className=" content object-cover "
              alt=""
            />
          )}
        </div>
        <p className="mt-2 text-lg">{data}</p>
        <div className="w-full my-20 ">
          <label className=" text-xl font-medium duration-300 text-black w-full">
            Trimis de catre
            <input
              readOnly
              type="text"
              name="titlu"
              value={openFile.nume_from}
              className={
                openFile.rol === "medic"
                  ? "outline-none w-full max-w-lg font-normal mt-4 border-c2 border-b-2 p-2"
                  : "outline-none w-full max-w-lg font-normal mt-4 border-c4 border-b-2 p-2"
              }
            />
          </label>
        </div>
        <div className="w-full mb-20">
          <label className=" text-xl font-medium duration-300 text-black w-full">
            Titlu
            <input
              readOnly
              type="text"
              name="titlu"
              value={openFile.titlu}
              className={
                openFile.rol === "medic"
                  ? "outline-none w-full max-w-lg font-normal mt-4 border-c2 border-b-2 p-2"
                  : "outline-none w-full max-w-lg font-normal mt-4 border-c4 border-b-2 p-2"
              }
            />
          </label>
        </div>
        <div className="w-full mb-20">
          <label className=" text-xl font-medium duration-300 text-black w-full">
            Observatii
            <textarea
              readOnly
              type="text"
              name="observatii"
              value={openFile.observatii}
              className={
                openFile.rol === "medic"
                  ? "outline-none w-full max-w-lg mt-4 bg-blue-50 border-c2 h-28 border-b-2 p-2 font-normal text-base"
                  : "outline-none w-full max-w-lg mt-4 bg-orange-50 border-c4 h-28 border-b-2 p-2 font-normal text-base"
              }
            />
          </label>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 md:right-14 md:top-12 flex">
        <button
          onClick={() => handleBack()}
          className=" bg-c5 text-lg flex align-middle justify-center
  rounded-full w-12 h-12 center text-white mr-3"
        >
          <i className="fa-solid fa-arrow-left self-center"></i>
        </button>
        {user.uid === openFile.from && (
          <button
            onClick={() => handleDeleteFisier(openFile)}
            className=" bg-red-500 text-lg flex align-middle justify-center
        rounded-full w-12 h-12 center text-white"
          >
            <i className="fa-solid fa-trash self-center"></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default IfViewer;
