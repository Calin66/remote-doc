import useFetchDateMedic from "@/hooks/fetchDateSetari";
import Cookies from "js-cookie";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { validateNewAsistentInfo } from "../validateInfo";

function NewAsistent({ handlePas }) {
  const [valoriAsistent, setValoriAsistent] = useState({
    nume: "",
    program_clinica: "",
    program_domiciliu: "",
  });
  const [erorsNewAsistent, setErrorsNewAsistent] = useState({});

  const handleNewAsistentChange = (e) => {
    const { name, value } = e.target;
    setValoriAsistent({
      ...valoriAsistent,
      [name]: value,
    });
  };
  const handleNewAsistent = () => {
    setErrorsNewAsistent(validateNewAsistentInfo(valoriAsistent));
  };

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

      {erorsNewAsistent.nume && (
        <p className=" text-base text-c2 w-full p-2 self-center max-w-lg">
          {erorsNewAsistent.nume}
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

      <input
        type="text"
        name="program_domiciliu"
        value={valoriAsistent.program_domiciliu}
        onChange={handleNewAsistentChange}
        placeholder="Program la domiciliu"
        className="mt-14 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg self-center"
      />

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

function AsistentCard(asistent) {
  return (
    <div className="border border-c3 px-3 py-3 my-4 rounded-lg flex">
      {/* <Image
        width={10}
        height={10}
        alt="Avatar asistent"
        src={asistent.avatar}
      /> */}
      {/* <div className="bg-c3 text-white rounded-full flex items-center justify-center p-3 text-xl">
        <i className="fa-solid fa-user"></i>
      </div> */}
      <p>{asistent.nume}</p>
    </div>
  );
}

function index() {
  const [pas, setPas] = useState(true);
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
    asistenti: [],
  });
  const [valoriDb, setValoriDb] = useState({
    nume: "",
    email: "",
    nume_clinica: "",
    program_clinica: "",
    program_domiciliu: "",
    locatie_clinica: "",
    asistenti: [],
  });
  const { date, handleEditDate, errorD, loadingD } =
    useFetchDateMedic(valuesLocal);

  const [clasa, setClasa] = useState(false);

  const handlePas = () => {
    setPas(!pas);
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
      ("am intrat in handle clasa si in if");
      await handleEditDate(valuesLocal, valoriDb);
      setValoriDb(valuesLocal);
    }
    setClasa(!clasa);
  };

  //   const handleNewAsistentImageChange = () => {};
  useEffect(() => {
    // console.log("date in index.js", date);
    setValoriDb(date);
    setValuesLocal(date);
  }, [date]);

  if (!loadingD && role === "medic" && pas)
    return <NewAsistent handlePas={handlePas} />;
  return (
    <>
      {!loadingD && (
        <div className="mt-14 min-h-hatz">
          {role === "medic" && !pas && (
            <div className=" w-full">
              {Object.keys(valuesLocal).map((val, i) => {
                if (val !== "asistenti")
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
                            className="outline-none w-full max-w-lg font-normal mt-4  border-c2 bg-blue-100 border-b-2 p-2"
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
                <div className="flex flex-col">
                  {valuesLocal.asistenti?.map((asistent, i) => {
                    return <AsistentCard asistent={asistent} key={i} />;
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
          {role === "pacient" && <div>indexpacient</div>}{" "}
        </div>
      )}
    </>
  );
}

export default index;
