import Investigatii, {
  Investigatie,
  NewInvestigatie,
} from "@/components/Pacient/Investigatii";
import { db } from "@/firebase";
import useFetchPacient from "@/hooks/fetchDatePacient";
import { useFetchDatePacient } from "@/hooks/fetchDateSetari";
import { doc, getDoc } from "firebase/firestore";
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
    prenume: "Prenume",
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
    prenume: "",
    sexul: "",
    telefon: "",
    email: "",
    cnp: "",
    act_identitate: "",
    antecedente_heredocolaterale: "",
    antecedente_personale: "",
    investigatii: {},
  });

  const [valuesDb, setValuesDb] = useState({
    id: "",
    nume: "",
    prenume: "",
    sexul: "",
    telefon: "",
    email: "",
    cnp: "",
    act_identitate: "",
    antecedente_heredocolaterale: "",
    antecedente_personale: "",
    investigatii: {},
  });
  // a se exclude in Object.keys return input type text
  // sexul, act_identitate, antecedente_heredocolaterale, antecedente_personale investigatii

  const { date, handleEditDate, error, loading } = useFetchPacient(
    valuesLocal,
    id
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clasa, setClasa] = useState(false);

  // pt carusel
  const [page, setPage] = useState(0);
  const [fisier, setFisier] = useState(null);
  const [pageCI, setPageCI] = useState(null);

  const handleImageChange = (e) => {
    const fileU = e.target.files[0];
    setFisier(fileU);
    console.log("fileU", fileU);
  };

  // pt carusel

  const handlePage = (nr) => {
    setPage(nr);
  };
  const handleChangeSus = (valoriInv) => {
    const costel = valuesLocal;

    console.log("asistent", valoriInv);
    console.log("valuesLocal", valuesLocal);

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
      setPageCI(false);
      handlePage(2);
    } else {
      setPageCI(val);
      handlePage(4);
    }
  };

  useEffect(() => {
    if (Object.keys(date).length) {
      console.log("date", date);
      setValuesDb(date);
      setValuesLocal(date);
    }
  }, [date]);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      setIsSubmitting(false);
      setClasa(!clasa);
    }
    // console.log("errors in [id].js", errors);
  }, [errors, isSubmitting]);

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
                      id={id}
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
                            "outline-none w-full max-w-lg mt-4 bg-blue-100 border-c3 h-28 border-b-2 p-2 font-normal text-base"
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
                          className="outline-none w-full max-w-lg mt-4 bg-blue-50 border-c2 h-28 border-b-2 p-2 font-normal text-base"
                        />
                      )}
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
                        className="outline-none w-full max-w-lg font-normal mt-4 border-c4 border-b-2 p-2"
                      />
                    </label>
                  </div>
                );
              else return <div className="hidden" key={i}></div>;
            })}
            <div className="fixed bottom-4 right-4 md:right-14 md:top-12 flex">
              <button
                onClick={() => router.push("/pacienti")}
                className=" bg-c5 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white mr-3"
              >
                <i className="fa-solid fa-arrow-left self-center"></i>
              </button>
              <button
                onClick={() => setPage(1)}
                className=" bg-c4 text-lg flex align-middle justify-center
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
        {page === 4 && pageCI && <Investigatie investigatie={pageCI} id={id} />}
      </div>
    );
  else return <div></div>;
};

export default index;
