import { db } from "@/firebase";
import useFetchDateMedic from "@/hooks/fetchDateSetari";
import { getAuth } from "firebase/auth";
import { deleteField, doc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import _ from "lodash";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  validateDateMedic,
  validateEditAsistentInfo,
  validateNewAsistentInfo,
} from "../validateInfo";

function NewAsistent({ handlePas, valuesLocal }) {
  const [valoriAsistent, setValoriAsistent] = useState({
    nume: "",
    program_clinica: "",
    program_domiciliu: "",
  });
  const [errorsNewAsistent, setErrorsNewAsistent] = useState({});
  const [isSubmittingNA, setIsSubmittingNA] = useState(false);
  const handleNewAsistentChange = (e) => {
    const { name, value } = e.target;
    setValoriAsistent({
      ...valoriAsistent,
      [name]: value,
    });
  };
  const handleNewAsistent = () => {
    setErrorsNewAsistent(validateNewAsistentInfo(valoriAsistent));
    setIsSubmittingNA(true);
  };

  const upd = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    const newKey =
      Object.keys(valuesLocal.asistenti).length === 0
        ? 1
        : Math.max(...Object.keys(valuesLocal.asistenti)) + 1;
    await setDoc(
      doc(db, "medici", user.uid),
      {
        asistenti: {
          ...valuesLocal.asistenti,
          [newKey]: {
            nume: valoriAsistent.nume,
            program_clinica: valoriAsistent.program_clinica,
            program_domiciliu: valoriAsistent.program_domiciliu,
          },
        },
      },
      { merge: true }
    );
    handleChangeA();
    handlePas();

    console.log("Update done");
  };
  useEffect(() => {
    if (Object.keys(errorsNewAsistent).length === 0 && isSubmittingNA) {
      upd();
    }
  }, [errorsNewAsistent, isSubmittingNA]);

  return (
    <div className="w-full flex flex-col">
      <h1 className=" mb-10 text-2xl text-center">Adaugă asistent</h1>
      {/* <input
      id="avatar"
      name="avatar"
      type="file"
      accept="image/*"
      onChange={handleNewAsistentImageChange}
      className="mt-2 block w-full text-base rounded-sm cursor-pointer text-white bg-c2 border-c2"
    /> */}
      <input
        type="text"
        name="nume"
        value={valoriAsistent.nume}
        onChange={handleNewAsistentChange}
        placeholder="Nume complet"
        className="mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg self-center"
      />

      {errorsNewAsistent.nume && (
        <p className=" text-base text-c2 w-full p-2 self-center max-w-lg">
          {errorsNewAsistent.nume}
        </p>
      )}

      <input
        type="text"
        name="program_clinica"
        value={valoriAsistent.program_clinica}
        onChange={handleNewAsistentChange}
        placeholder="Program la clinica"
        className="mt-14 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg self-center"
      />

      {errorsNewAsistent.program_clinica && (
        <p className=" text-base text-c2 w-full p-2 self-center max-w-lg">
          {errorsNewAsistent.program_clinica}
        </p>
      )}

      <input
        type="text"
        name="program_domiciliu"
        value={valoriAsistent.program_domiciliu}
        onChange={handleNewAsistentChange}
        placeholder="Program la domiciliu"
        className="mt-14 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg self-center"
      />

      {errorsNewAsistent.program_domiciliu && (
        <p className=" text-base text-c2 w-full p-2 self-center max-w-lg">
          {errorsNewAsistent.program_domiciliu}
        </p>
      )}

      <button
        className="text-center bg-c2 text-white font-medium py-3 rounded-lg mt-24 w-5/6 mb-5 self-center max-w-xs"
        onClick={handleNewAsistent}
      >
        Submit
      </button>
      <button
        className="text-center text-red-500 font-medium py-3 rounded-lg w-5/6 mb-5 self-center max-w-xs border border-red-500"
        onClick={handlePas}
      >
        Cancel
      </button>
    </div>
  );
}

function AsistentCard({ asistent, handleSetPag, cheie }) {
  return (
    <div
      className="border-2 border-c1 px-3 py-2 mb-3 rounded-lg flex justify-between items-center"
      onClick={() => handleSetPag(asistent, cheie)}
    >
      {/* <Image
        width={10}
        height={10}
        alt="Avatar asistent"
        src={asistent.avatar}
      /> */}
      {/* <div className="bg-c3 text-white rounded-full flex items-center justify-center p-3 text-xl">
        <i className="fa-solid fa-user"></i>
      </div> */}
      <p className="font-medium">{asistent.nume}</p>
      <i className="fa-solid fa-user-pen"></i>
    </div>
  );
}

const PaginaAsistent = ({ asistent, handleSetPag, valuesBig }) => {
  const labels = {
    nume: "Nume complet",
    program_clinica: "Program la clinică",
    program_domiciliu: "Program la domiciliu",
  };

  const [valuesLocal, setValuesLocal] = useState({
    nume: asistent.nume,
    program_clinica: asistent.program_clinica,
    program_domiciliu: asistent.program_domiciliu,
    cheie: asistent.cheie,
  });
  const valuesDB = {
    nume: asistent.nume,
    program_clinica: asistent.program_clinica,
    program_domiciliu: asistent.program_domiciliu,
    cheie: asistent.cheie,
  };
  const [clasa, setClasa] = useState(false);
  const [isSubmittingEditAsistent, setIsSubmittingEditAsistent] =
    useState(false);

  const [errorsEditAsistent, setErrorsEditAsistent] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValuesLocal({
      ...valuesLocal,
      [name]: value,
    });
  };

  const handleDateAsistent = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    await setDoc(
      doc(db, "medici", user.uid),
      {
        asistenti: {
          ...valuesBig.asistenti,
          [asistent.cheie]: {
            nume: valuesLocal.nume,
            program_clinica: valuesLocal.program_clinica,
            program_domiciliu: valuesLocal.program_domiciliu,
          },
        },
      },
      { merge: true }
    );
    handleSetPag(null, null, valuesLocal);
  };

  const handleClasa = async () => {
    if (clasa === true) {
      setIsSubmittingEditAsistent(true);
      setErrorsEditAsistent(validateEditAsistentInfo(valuesLocal));
    } else setClasa(!clasa);
  };

  const deleteAsistent = async () => {
    console.log("valuesLocal", valuesLocal);

    const auth = getAuth();
    const user = auth.currentUser;

    await setDoc(
      doc(db, "medici", user.uid),
      {
        asistenti: {
          ...valuesBig.asistenti,
          [asistent.cheie]: deleteField(),
        },
      },
      { merge: true }
    );

    handleSetPag(null, null, null, valuesLocal.cheie);
  };
  useEffect(() => {
    console.log(errorsEditAsistent);
    if (
      Object.keys(errorsEditAsistent).length === 0 &&
      isSubmittingEditAsistent
    ) {
      if (_.isEqual(valuesLocal, valuesDB)) {
        console.log("Sunt egale nu am facut nimic");
        handleSetPag();
      } else {
        handleDateAsistent();
      }
      setClasa(!clasa);
    }
  }, [errorsEditAsistent, isSubmittingEditAsistent]);

  if (asistent)
    return (
      <div className="w-full flex flex-col mt-14">
        <div className="w-full">
          {Object.keys(valuesLocal).map((val, i) => {
            console.log("val", val);
            if (val !== "cheie")
              return (
                <div key={i} className="flex w-full justify-between mb-20">
                  <label className=" text-xl font-medium duration-300 text-black self-center">
                    {labels[val]}
                    {clasa ? (
                      <input
                        key={i}
                        type="text"
                        name={val}
                        value={valuesLocal[val]}
                        onChange={handleChange}
                        className={
                          errorsEditAsistent[val]
                            ? "outline-none w-full max-w-lg font-normal mt-4  border-c5 bg-blue-100 border-b-2 p-2"
                            : "outline-none w-full max-w-lg font-normal mt-4  border-c2 bg-blue-100 border-b-2 p-2"
                        }
                      />
                    ) : (
                      <input
                        readOnly
                        key={i}
                        type="text"
                        name={val}
                        value={valuesLocal[val]}
                        className="outline-none w-full max-w-lg font-normal mt-4 border-c2 border-b-2 p-2"
                      />
                    )}
                  </label>
                </div>
              );
          })}
        </div>
        <div className="flex w-screen border-t border-c2 py-4 justify-center fixed bottom-0 left-0 text-lg bg-white">
          <button
            className="text-center text-red-500 rounded-full w-14 h-14 border border-red-500 mr-8"
            onClick={() => handleSetPag()}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button
            onClick={handleClasa}
            className=" text-center text-c2 rounded-full w-14 h-14 border border-c2 mr-8"
          >
            {clasa ? (
              <i className="fa-solid fa-check"></i>
            ) : (
              <i className="fa-solid fa-pen"></i>
            )}
          </button>

          <button
            onClick={deleteAsistent}
            className="text-center text-red-500 rounded-full w-14 h-14 border border-red-500"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    );
  else return <div className="hidden"></div>;
};

function index() {
  const [pas, setPas] = useState(false);
  const role = Cookies.get("role");

  const labels = {
    nume: "Nume complet",
    email: "Adresa email",
    nume_clinica: "Nume clinică",
    program_clinica: "Program la clinică",
    program_domiciliu: "Program la domiciliu",
    locatie_clinica: "Adresa clinicii",
  };

  const [valuesLocal, setValuesLocal] = useState({
    nume: "",
    email: "",
    nume_clinica: "",
    program_clinica: "",
    program_domiciliu: "",
    locatie_clinica: "",
    asistenti: {},
  });

  const [pag, setPag] = useState({});
  const [valoriDb, setValoriDb] = useState({
    nume: "",
    email: "",
    nume_clinica: "",
    program_clinica: "",
    program_domiciliu: "",
    locatie_clinica: "",
    asistenti: {},
  });
  const { date, handleEditDate, errorD, loadingD } =
    useFetchDateMedic(valuesLocal);
  const [errors, setErrors] = useState({});
  const [clasa, setClasa] = useState(false);
  const [isSubmittingAici, setIsSubmittingAici] = useState(false);
  const handlePas = () => {
    setPas(!pas);
  };
  const handleSetPag = (asistent, cheie, valoriA, del) => {
    if (valoriA) {
      setValuesLocal({
        ...valuesLocal,
        asistenti: {
          ...valuesLocal.asistenti,
          [valoriA.cheie]: valoriA,
        },
      });
    } else if (del) {
      const copie = valuesLocal;
      delete copie.asistenti[del];
      console.log("copie", copie);
      console.log("del", del);
      setValuesLocal(copie);
    }
    if (asistent) {
      setPag({ ...asistent, cheie: cheie });
    } else setPag({});
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
      //AAAA
      setIsSubmittingAici(true);
      setErrors(validateDateMedic(valuesLocal));
    } else {
      setClasa(!clasa);
    }
  };

  const handleChangeA = (asistent) => {
    console.log("ACCI");
    setValuesLocal(valoriDb);
  };

  //   const handleNewAsistentImageChange = () => {};
  useEffect(() => {
    console.log("errors", errors);
    if (Object.keys(errors).length === 0 && isSubmittingAici) {
      console.log("AM INCEPUT");
      const asasdasda = async () => {
        await handleEditDate(valuesLocal, valoriDb);
        setValoriDb(valuesLocal);
      };
      asasdasda();
      setIsSubmittingAici(false);
      setClasa(!clasa);
    }
  }, [errors, isSubmittingAici]);

  useEffect(() => {
    setValoriDb(date);
    setValuesLocal(date);
  }, [date]);

  if (!loadingD && role === "medic" && pas)
    return (
      <NewAsistent
        handlePas={handlePas}
        handleChangeA={handleChangeA}
        valuesLocal={valuesLocal}
      />
    );
  if (role === "medic" && Object.keys(pag).length !== 0)
    return (
      <PaginaAsistent
        handleSetPag={handleSetPag}
        asistent={pag}
        valuesBig={valuesLocal}
      />
    );

  return (
    <>
      {!loadingD && (
        <div className="mt-14 min-h-hatz">
          {role === "medic" && Object.keys(pag).length === 0 && !pas && (
            <div className=" w-full">
              {Object.keys(valuesLocal).map((val, i) => {
                if (val !== "asistenti")
                  return (
                    <div key={i} className="w-full mb-20">
                      <label className=" text-xl font-medium duration-300 text-black w-full">
                        {labels[val]}
                        {clasa ? (
                          <input
                            key={i}
                            type="text"
                            name={val}
                            value={valuesLocal[val]}
                            onChange={handleChange}
                            className={
                              errors[val]
                                ? "outline-none w-full max-w-lg font-normal mt-4  border-c5 bg-blue-100 border-b-2 p-2"
                                : "outline-none w-full max-w-lg font-normal mt-4  border-c2 bg-blue-100 border-b-2 p-2"
                            }
                          />
                        ) : (
                          <input
                            readOnly
                            key={i}
                            type="text"
                            name={val}
                            value={valuesLocal[val]}
                            className="outline-none w-full max-w-lg font-normal mt-4 border-c2 border-b-2 p-2"
                          />
                        )}
                      </label>

                      {/* <i className="fa-solid fa-pen-to-square"></i> */}
                    </div>
                  );
              })}
              <div>
                <div className="flex flex-col text-xl font-medium">
                  <p>Asistenti</p>
                  <button
                    className=" bg-c1 p-2 px-6 mt-4 rounded-xl font-normal text-lg"
                    onClick={handlePas}
                  >
                    Adauga asistent
                  </button>
                </div>
                <div className="flex flex-col mt-4">
                  {valuesLocal.asistenti &&
                    Object.keys(valuesLocal.asistenti)?.map((asistent, i) => {
                      return (
                        <AsistentCard
                          handleSetPag={handleSetPag}
                          asistent={valuesLocal.asistenti[asistent]}
                          cheie={asistent}
                          key={i}
                        />
                      );
                    })}
                </div>
              </div>
              <button
                onClick={handleClasa}
                className=" bg-c2 font-bold text-2xl flex align-middle justify-center
            rounded-full w-16 h-16 center text-white fixed bottom-8 right-4 md:right-14 md:top-12"
              >
                {clasa ? (
                  <i className="fa-solid fa-check self-center text-2xl"></i>
                ) : (
                  <i className="fa-solid fa-pen self-center text-xl"></i>
                )}
              </button>
            </div>
          )}

          {role === "pacient" && <div>indexpacient</div>}
        </div>
      )}
    </>
  );
}

export default index;
