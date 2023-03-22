import { useFetchPacientinPacient } from "@/hooks/fetchDatePacient";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import FileUploader from "./Pacient/FileUploader";
import FileViewer from "./Pacient/FileViewer";
import Investigatii, { Investigatie } from "./Pacient/Investigatii";

function HomePagePacient() {
  const labels = {
    nume: "Nume complet doctor",
    telefon: "Nr. telefon doctor",
    email: "Email doctor",
    antecedente_heredocolaterale: "Antecedente heredocolaterale",
    antecedente_personale: "Antecedente personale",
    investigatii: "Consultații și investigații",
  };

  const [valuesLocal, setValuesLocal] = useState({
    doc_uid: "",
    nume: "",
    telefon: "",
    email: "",
    dovada: "",
    antecedente_heredocolaterale: "",
    antecedente_personale: "",
    investigatii: {},
  });

  const { date, date2, error, loading } = useFetchPacientinPacient(valuesLocal);

  const [files, setFiles] = useState([]);

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

  const handlePageF = (val) => {
    if (val) {
      const fi = files;
      fi.unshift(val);
      setFiles(fi);
      handlePage(1);
    }
  };

  const handleDeleteFisierHelper = (fisier) => {
    const index = files.indexOf(fisier);
    const fisiere = files;
    fisiere.splice(index, 1);
    setFiles(fisiere);
  };

  useEffect(() => {
    if (Object.keys(date).length) {
      // console.log("date", date);
      setValuesLocal(date);
      setFiles(date2);
    }
  }, [date, date2]);

  if (page === 1)
    return (
      <FileViewer
        handlePage={handlePage}
        files={files}
        handleDeleteFisierHelper={handleDeleteFisierHelper}
      />
    );

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
              } else if (val === "dovada" && valuesLocal.dovada) {
                return (
                  <div
                    key={i}
                    className="text-xl font-medium duration-300 text-black w-full mb-20 "
                  >
                    <p className="mb-4">Dovada doctorului</p>
                    <div className="relative h-52 rounded-lg overflow-hidden">
                      <Image
                        src={valuesLocal[val]}
                        fill
                        alt=""
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                );
              } else if (val !== "doc_uid")
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
                className=" bg-c5 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white mr-3 md:mr-0 hover:scale-110"
              >
                <i className="fa-solid fa-file self-center"></i>
              </button>
            </div>
          </div>
        )}

        {page === 2 && (
          <FileUploader
            nume_to={valuesLocal.nume}
            handlePage={handlePage}
            id={valuesLocal.doc_uid}
            handlePageF={handlePageF}
          />
        )}
        {page === 4 && pageCI && (
          <Investigatie investigatie={pageCI} handlePageCI={handlePageCI} />
        )}
      </div>
    );
  else return <div></div>;
}

export default HomePagePacient;
