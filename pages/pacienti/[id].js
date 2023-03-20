import FileUploader from "@/components/Pacient/FileUploader";
import FileViewer from "@/components/Pacient/FileViewer";
import Investigatii, {
  Investigatie,
  NewInvestigatie,
} from "@/components/Pacient/Investigatii";
import { db } from "@/firebase";
import useFetchPacient from "@/hooks/fetchDatePacient";
import { useFetchDatePacient } from "@/hooks/fetchDateSetari";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { validateDatePacientInPacienti } from "../validateInfo";

const index = (req) => {
  const router = useRouter();
  const [id, setId] = useState();

  useEffect(() => {
    const { id } = router.query;
    setId(id);
  }, [router]);

  const labels = {
    uid: "Id-ul utilizatorului",
    nume: "Nume",
    sexul: "Sexul",
    telefon: "Nr. telefon",
    email: "Adresă email",
    cnp: "CNP",
    uid: "Id utilizator",
    doc_uid: "Id medic",
    antecedente_heredocolaterale: "Antecedente heredocolaterale",
    antecedente_personale: "Antecedente personale",
    investigatii: "Consultații și investigații",
  };

  const [valuesLocal, setValuesLocal] = useState({
    uid: "",
    nume: "",
    sexul: "",
    telefon: "",
    email: "",
    cnp: "",
    actIdentitate: "",
    antecedente_heredocolaterale: "",
    antecedente_personale: "",
    investigatii: {},
  });

  const [valuesDb, setValuesDb] = useState({
    id: "",
    nume: "",
    sexul: "",
    telefon: "",
    email: "",
    cnp: "",
    actIdentitate: "",
    antecedente_heredocolaterale: "",
    antecedente_personale: "",
    investigatii: {},
  });
  // a se exclude in Object.keys return input type text
  // sexul, act_identitate, antecedente_heredocolaterale, antecedente_personale investigatii

  const { date, date2, handleEditDate, error, loading } = useFetchPacient(
    valuesLocal,
    id
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clasa, setClasa] = useState(false);

  const [files, setFiles] = useState([]);

  const [page, setPage] = useState(0);
  const [pageCI, setPageCI] = useState(null);

  const handlePage = (nr) => {
    setPage(nr);
  };

  const handleChangeSus = (valoriInv) => {
    const costel = valuesLocal;

    // console.log("asistent", valoriInv);
    // console.log("valuesLocal", valuesLocal);

    const newKey =
      Object.keys(valuesLocal.investigatii).length === 0
        ? 1
        : Math.max(...Object.keys(valuesLocal.investigatii)) + 1;

    costel.investigatii = {
      ...costel.investigatii,
      [newKey]: valoriInv,
    };

    setValuesLocal(costel);
    setValuesDb(costel);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValuesLocal({
      ...valuesLocal,
      [name]: value,
    });
  };

  const handleClasa = async () => {
    if (clasa === true) {
      setIsSubmitting(true);
      setErrors(validateDatePacientInPacienti(valuesLocal));
    } else {
      setClasa(!clasa);
    }
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
      setValuesDb(date);
      setValuesLocal(date);
      setFiles(date2);
    }
  }, [date, date2]);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      handleEditDate(valuesLocal, valuesDb);
      setIsSubmitting(false);
      setClasa(!clasa);
    }
    // console.log("errors in [id].js", errors);
  }, [errors, isSubmitting]);

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
                      {clasa ? (
                        <textarea
                          onChange={handleChange}
                          key={i}
                          type="text"
                          name={val}
                          value={valuesLocal[val]}
                          className={
                            "outline-none w-full max-w-lg mt-4 bg-blue-100 border-c2 h-28 border-b-2 p-2 font-normal text-base"
                          }
                        />
                      ) : (
                        <textarea
                          readOnly
                          onChange={handleChange}
                          key={i}
                          type="text"
                          name={val}
                          value={valuesLocal[val]}
                          className="outline-none w-full max-w-lg mt-4 bg-blue-50 border-c1 h-28 border-b-2 p-2 font-normal text-base"
                        />
                      )}
                    </label>
                  </div>
                );
              } else if (val === "actIdentitate" && valuesLocal[val]) {
                return (
                  <div
                    key={i}
                    className="text-xl font-medium duration-300 text-black w-full mb-20 "
                  >
                    <p className="mb-4">Act identitate pacient</p>
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
              } else
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
                        className="outline-none w-full max-w-lg font-normal mt-4 border-c4 border-b-2 p-2"
                      />
                    </label>
                  </div>
                );
            })}
            <div className="fixed bottom-4 right-4 md:right-14 md:top-12 flex">
              <button
                onClick={() => router.push("/pacienti")}
                className=" bg-c4 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white mr-3"
              >
                <i className="fa-solid fa-arrow-left self-center"></i>
              </button>
              <button
                onClick={() => setPage(1)}
                className=" bg-c5 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white mr-3 "
              >
                <i className="fa-solid fa-file self-center"></i>
              </button>
              <button
                onClick={handleClasa}
                className=" bg-c2 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white"
              >
                {clasa ? (
                  <i className="fa-solid fa-check self-center"></i>
                ) : (
                  <i className="fa-solid fa-pen self-center"></i>
                )}
              </button>
            </div>
          </div>
        )}
        {page === 2 && (
          <FileUploader
            nume_to={valuesLocal.nume}
            handlePage={handlePage}
            id={id}
            handlePageF={handlePageF}
          />
        )}
        {page === 3 && (
          <NewInvestigatie
            handlePage={handlePage}
            id={id}
            handleChangeSus={handleChangeSus}
            newKey={
              Object.keys(valuesLocal.investigatii).length === 0
                ? 1
                : Math.max(...Object.keys(valuesLocal.investigatii)) + 1
            }
          />
        )}
        {page === 4 && pageCI && (
          <Investigatie investigatie={pageCI} handlePageCI={handlePageCI} />
        )}
      </div>
    );
  else return <div></div>;
};

export default index;
