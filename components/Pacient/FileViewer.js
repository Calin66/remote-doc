import { db } from "@/firebase";
import { getAuth } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import IfViewer from "./IfViewer";

function FileViewer({ handlePage, files, handleDeleteFisierHelper }) {
  const router = useRouter();

  const auth = getAuth();
  const user = auth.currentUser;

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFile, setOpenFile] = useState({});

  const [clasa, setClasa] = useState(false);

  const handleClasa = async () => {
    if (clasa === true) {
      setIsSubmitting(true);
      //   setErrors(validateDatePacientInPacienti(valuesLocal));
    } else {
      setClasa(!clasa);
    }
  };
  const handleOpenFile = (file) => {
    if (file) setOpenFile(file);
    else setOpenFile({});
  };
  const handleBack = (file) => {
    if (file) {
      console.log("AICI AM INTRAT");
      handleDeleteFisierHelper(file);
    }
    setOpenFile({});
  };

  const handleDeleteFisier = (file) => {
    if (user.uid === file.from && file.id) {
      console.log("handleDELETE");
      const delet = async () => {
        await deleteDoc(doc(db, "fisiere", file.id));
        handleBack(file);
      };
      delet();
    }
  };

  if (Object.keys(openFile).length)
    return (
      <IfViewer
        openFile={openFile}
        handleBack={handleBack}
        handleDeleteFisier={handleDeleteFisier}
      />
    );
  else
    return (
      <div className=" min-h-hatz w-full">
        <div className="w-full flex flex-col mt-10">
          {Object.keys(files).length === 0 && (
            <div>
              <h1 className="text-2xl text-center">
                Momentan nu sunt fisiere de afisat.
              </h1>
            </div>
          )}
          {Object.keys(files).map((file, i) => {
            const fisier = files[file];

            let data = "";
            let dt;
            console.log("tuy", typeof fisier.data);
            if (typeof fisier.data === "string") {
              data = fisier.data;
            } else if (!fisier.data) {
              data = "Acum";
            } else {
              dt = fisier.data.toDate();
              data =
                dt.getFullYear() +
                "/" +
                (dt.getMonth() + 1) +
                "/" +
                dt.getDate();
            }

            return (
              <div
                className={
                  fisier.rol === "medic"
                    ? "w-full overflow-hidden relative px-5 min-h-fit h-28 border mb-10 rounded-2xl flex items-center pb-5 justify-between border-c2 text-base font-medium max-w-xl self-center cursor-pointer"
                    : "w-full overflow-hidden relative px-5 min-h-fit h-28 border mb-10 rounded-2xl flex items-center pb-5 justify-between border-c5 text-base font-medium max-w-xl self-center cursor-pointer"
                }
                key={i}
                onClick={() => handleOpenFile(fisier)}
              >
                <div>
                  {/* <div className=" bg-red-600 flex w-14 py-1 rounded-bl-2xl  absolute top-0 right-0">
                  <i className="fa-solid fa-xmark text-center w-full"></i>
                </div> */}
                  <p>{fisier.titlu}</p>
                  <p className="font-normal">Incarcat de {fisier.nume_from}</p>
                  <p
                    className={
                      fisier.rol === "medic"
                        ? "font-normal w-full bg-c2 text-white absolute left-0 bottom-0 text-center py-1"
                        : "font-normal w-full bg-c5  text-white absolute left-0 bottom-0 text-center py-1"
                    }
                  >
                    {data}
                  </p>
                </div>
                {fisier.type.includes("pdf") ? (
                  <i
                    className={
                      fisier.rol === "medic"
                        ? "fa-solid fa-file-pdf text-2xl text-c3"
                        : "fa-solid fa-file-pdf text-2xl text-orange-900 "
                    }
                  ></i>
                ) : (
                  <i
                    className={
                      fisier.rol === "medic"
                        ? "fa-solid fa-file-image text-2xl text-c3"
                        : "fa-solid fa-file-image text-2xl text-orange-900"
                    }
                  ></i>
                )}
              </div>
            );
          })}
        </div>
        <div className="fixed bottom-4 right-4 md:right-14 md:top-12 flex">
          <button
            onClick={() => handlePage(0)}
            className=" bg-c5 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white mr-3 hover:scale-110"
          >
            <i className="fa-solid fa-arrow-left self-center"></i>
          </button>

          <button
            onClick={() => handlePage(2)}
            className=" bg-c2 text-lg flex align-middle justify-center
          rounded-full w-12 h-12 center text-white hover:scale-110"
          >
            {clasa ? (
              <i className="fa-solid fa-check self-center"></i>
            ) : (
              <i className="fa-solid fa-cloud-arrow-up self-center"></i>
            )}
          </button>
        </div>
      </div>
    );
}

export default FileViewer;
