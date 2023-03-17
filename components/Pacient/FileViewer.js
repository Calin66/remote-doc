import { useRouter } from "next/router";
import React, { useRef, useState } from "react";

function FileViewer({ handlePage, files }) {
  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clasa, setClasa] = useState(false);

  const handleClasa = async () => {
    if (clasa === true) {
      setIsSubmitting(true);
      //   setErrors(validateDatePacientInPacienti(valuesLocal));
    } else {
      setClasa(!clasa);
    }
  };

  return (
    <div className=" min-h-hatz w-full">
      <div className="w-full flex flex-col mt-10">
        {Object.keys(files).map((file, i) => {
          const fisier = files[file];
          const dt = fisier.data.toString();

          let data = "";
          if (dt) {
            data = dt;
            // dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
          }

          return (
            <div
              className={
                fisier.rol === "medic"
                  ? "w-full overflow-hidden relative px-5 min-h-fit h-28 border mb-10 rounded-3xl flex items-center justify-between border-c2 text-base font-medium"
                  : "w-full overflow-hidden relative px-5 min-h-fit h-28 border mb-10 rounded-3xl flex items-center justify-between border-c5 text-base font-medium"
              }
              key={i}
            >
              <div>
                <p>{fisier.titlu}</p>
                <p className="font-normal">Incarcat de {fisier.nume_from}</p>
                <p
                  className={
                    fisier.rol === "medic"
                      ? "font-normal w-full bg-c1 text-white absolute left-0 bottom-0 text-center"
                      : "font-normal w-full bg-c4  text-white absolute left-0 bottom-0 text-center"
                  }
                >
                  {data}
                </p>
              </div>
              {fisier.type.includes("pdf") ? (
                <i className="fa-solid fa-file-pdf text-2xl"></i>
              ) : (
                <i className="fa-solid fa-file-image text-2xl"></i>
              )}
            </div>
          );
        })}
      </div>
      <div className="fixed bottom-4 right-4 md:right-14 md:top-12 flex">
        <button
          onClick={() => handlePage(0)}
          className=" bg-c5 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white mr-3"
        >
          <i className="fa-solid fa-arrow-left self-center"></i>
        </button>

        <button
          onClick={() => handlePage(2)}
          className=" bg-c2 text-lg flex align-middle justify-center
          rounded-full w-12 h-12 center text-white"
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
