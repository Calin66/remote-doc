import { useFetchPacientinPacient } from "@/hooks/fetchDatePacient";
import React, { useEffect, useState } from "react";
import Investigatii, { Investigatie } from "./Pacient/Investigatii";

function HomePagePacient() {
  const labels = {
    nume: "Nume Doctor",
    prenume: "Prenume Doctor",
    telefon: "Nr. telefon doctor",
    email: "Email doctor",
    antecedente_heredocolaterale: "Antecedente heredocolaterale",
    antecedente_personale: "Antecedente personale",
    investigatii: "Consultații și investigații",
  };

  const [valuesLocal, setValuesLocal] = useState({
    nume: "",
    prenume: "",
    telefon: "",
    email: "",
    antecedente_heredocolaterale: "",
    antecedente_personale: "",
    investigatii: {},
  });

  const { date, handleEditDate, error, loading } =
    useFetchPacientinPacient(valuesLocal);
  const [page, setPage] = useState(0);
  const [pageCI, setPageCI] = useState(null);

  const handlePage = (nr) => {
    setPage(nr);
  };

  const handleImageChange = (e) => {
    const fileU = e.target.files[0];
    setFisier(fileU);
    // console.log("fileU", fileU);
  };

  const handlePageCI = (val) => {
    if (pageCI) {
      setPageCI(null);
      handlePage(0);
    } else {
      setPageCI(val);
      handlePage(4);
    }
  };
  useEffect(() => {
    if (Object.keys(date).length) {
      // console.log("date", date);
      setValuesLocal(date);
    }
  }, [date]);

  if (!loading)
    return (
      <div className="mt-14 min-h-hatz">
        {page === 0 && (
          <div className=" w-full flex flex-col ">
            {Object.keys(valuesLocal).map((val, i) => {
              if (val === "investigatii") {
                return (
                  <div key={i} className="w-full mb-20">
                    <p className=" text-xl font-medium duration-300 text-black w-full">
                      {labels[val]}
                    </p>
                    <Investigatii
                      investigatii={valuesLocal[val]}
                      handlePage={handlePage}
                      handlePageCI={handlePageCI}
                    />
                  </div>
                );
              } else if (
                val === "antecedente_heredocolaterale" ||
                val === "antecedente_personale"
              ) {
                return (
                  <div key={i} className="w-full mb-20">
                    <label className=" text-xl font-medium duration-300 text-black w-full">
                      {labels[val]}

                      <textarea
                        readOnly
                        key={i}
                        type="text"
                        name={val}
                        value={valuesLocal[val]}
                        className="outline-none w-full max-w-lg mt-4 bg-orange-50 border-c4 h-28 border-b-2 p-2 font-normal text-base"
                      />
                    </label>
                  </div>
                );
              } else if (val !== "act_identitate")
                return (
                  <div key={i} className="w-full mb-20">
                    <label className=" text-xl font-medium duration-300 text-black w-full">
                      {labels[val]}
                      <input
                        readOnly
                        key={i}
                        type="text"
                        name={val}
                        value={valuesLocal[val]}
                        className="outline-none w-full max-w-lg font-normal mt-4 border-c1 border-b-2 p-2"
                      />
                    </label>
                  </div>
                );
              else return <div className="hidden" key={i}></div>;
            })}
            <div className="fixed bottom-4 right-4 md:right-14 md:top-12 flex">
              <button
                onClick={() => setPage(1)}
                className=" bg-c4 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white mr-3 "
              >
                <i className="fa-solid fa-file self-center"></i>
              </button>
            </div>
          </div>
        )}
        {page === 1 && (
          <div className="w-full flex flex-col">
            <h1>HATZ HONUULE</h1>
            <div className="flex w-screen border-t border-c2 py-4 justify-center fixed bottom-0 left-0 text-xl bg-white">
              <button
                className="text-center text-c5 rounded-full w-14 h-14 border border-c5 mr-8"
                onClick={() => setPage(0)}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <button
                onClick={() => setPage(2)}
                className=" text-center text-c2 rounded-full w-14 h-14 border border-c2 mr-8"
              >
                <i className="fa-solid fa-file-arrow-up"></i>
              </button>
            </div>
          </div>
        )}
        {page === 2 && (
          <div className="w-full flex flex-col">
            <div className="relative group w-full h-64 flex justify-center items-center">
              <div className=" text-c2 font-medium text-lg absolute left-0 top-0 w-full h-full rounded-xl bg-white bg-opacity-80 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center content-center align-middle text-center  ">
                <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                <p className="text-center">Incarca un fisier</p>
              </div>
              <label className="relative z-20 cursor-pointer  hover:text-c3 w-full h-full ">
                <input
                  onChange={handleImageChange}
                  accept=".jpg, .jpeg .png, .svg, .webp .pdf"
                  className="relative z-10 opacity-0 h-full w-full cursor-pointer"
                  type="file"
                  name="document"
                  id="document"
                />
              </label>
            </div>
            <p></p>
          </div>
        )}
        {page === 4 && pageCI && (
          <Investigatie investigatie={pageCI} handlePageCI={handlePageCI} />
        )}
      </div>
    );
  else return <div></div>;
}

export default HomePagePacient;
