import { db } from "@/firebase";
import { validateDateConsultatie } from "@/pages/validateInfo";
import { doc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export function NewInvestigatie({ handlePage, id, newKey, handleChangeSus }) {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const labels = {
    data: "Data consultatiei",
    locul: "Unde a fost realizata consultatia",
    simptome: "Simptome",
    diagnostic: "Diagnostic",
    cod: "Cod consultatie",
    prescriptie: "Prescriptie / Recomandări",
    nr_zile_medical: "Nr. zile concediu medical",
  };

  const [values, setValues] = useState({
    data: "",
    locul: "",
    simptome: "",
    diagnostic: "",
    prescriptie: "",
    nr_zile_medical: 0,
    cod: "",
  });

  const handleClasa = async () => {
    setIsSubmitting(true);
    setErrors(validateDateConsultatie(values));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      const toDb = async () => {
        try {
          await setDoc(
            doc(db, "pacienti", id),
            {
              investigatii: {
                [newKey]: {
                  data: values.data,
                  locul: values.locul,
                  simptome: values.simptome,
                  diagnostic: values.diagnostic,
                  prescriptie: values.prescriptie,
                  nr_zile_medical: values.nr_zile_medical,
                  cod: values.cod,
                },
              },
            },
            { merge: true }
          );
          handleChangeSus(values);
          handlePage(0);
          console.log("Changes synced with db");
        } catch (error) {
          console.log("eroare in catch in fetchDateSetari", error);
        }
      };
      toDb();
    }
  }, [errors, isSubmitting]);

  return (
    <div className="w-full">
      {Object.keys(values).map((val, i) => {
        if (val === "nr_zile_medical") {
          return (
            <div key={i} className="w-full mb-20">
              <label className=" text-xl font-medium duration-300 text-black w-full">
                {labels[val]}
                <input
                  onChange={handleChange}
                  key={i}
                  type="number"
                  name={val}
                  value={values[val]}
                  className={
                    errors[val]
                      ? "outline-none w-full max-w-lg font-normal mt-4  border-c5 bg-blue-50 border-b-2 p-2"
                      : "outline-none w-full max-w-lg font-normal mt-4  border-c2 bg-blue-50 border-b-2 p-2"
                  }
                />
              </label>
            </div>
          );
        } else if (val === "data") {
          return (
            <div key={i} className="w-full mb-20">
              <label className=" text-xl font-medium duration-300 text-black w-full">
                {labels[val]}
                <input
                  onChange={handleChange}
                  key={i}
                  type="date"
                  name={val}
                  value={values[val]}
                  className={
                    errors[val]
                      ? "outline-none w-full max-w-lg font-normal mt-4  border-c5 bg-blue-50 border-b-2 p-2"
                      : "outline-none w-full max-w-lg font-normal mt-4  border-c2 bg-blue-50 border-b-2 p-2"
                  }
                />
              </label>
            </div>
          );
        } else if (
          val === "simptome" ||
          val === "diagnostic" ||
          val === "prescriptie"
        ) {
          return (
            <div key={i} className="w-full mb-20">
              <label className=" text-xl font-medium duration-300 text-black w-full">
                {labels[val]}
                <textarea
                  onChange={handleChange}
                  key={i}
                  type="text"
                  name={val}
                  value={values[val]}
                  className={
                    errors[val]
                      ? "outline-none w-full max-w-lg font-normal mt-4 h-28 text-base border-c5 bg-blue-50 border-b-2 p-2"
                      : "outline-none w-full max-w-lg font-normal mt-4 h-28 text-base border-c2 bg-blue-50 border-b-2 p-2"
                  }
                />
              </label>
            </div>
          );
        } else
          return (
            <div key={i} className="w-full mb-20">
              <label className=" text-xl font-medium duration-300 text-black w-full">
                {labels[val]}
                <input
                  onChange={handleChange}
                  key={i}
                  type="text"
                  name={val}
                  value={values[val]}
                  className={
                    errors[val]
                      ? "outline-none w-full max-w-lg font-normal mt-4  border-c5 bg-blue-50 border-b-2 p-2"
                      : "outline-none w-full max-w-lg font-normal mt-4  border-c2 bg-blue-50 border-b-2 p-2"
                  }
                />
              </label>
            </div>
          );
      })}
      <div className="fixed bottom-4 right-4 md:right-14 md:top-12 flex">
        <button
          onClick={() => handlePage(0)}
          className=" bg-c5 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white mr-3 hover:scale-110"
        >
          <i className="fa-solid fa-arrow-left self-center"></i>
        </button>
        {/* <button
          onClick={() => handlePage(2)}
          className=" bg-c4 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white mr-3 "
        >
          <i className="fa-solid fa-file self-center"></i>
        </button> */}
        <button
          onClick={handleClasa}
          className=" bg-c2 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white hover:scale-110"
        >
          <i className="fa-solid fa-check self-center"></i>
        </button>
      </div>
    </div>
  );
}

export function Investigatie({ investigatie, handlePageCI }) {
  const router = useRouter();

  const labels = {
    data: "Data consultatiei",
    locul: "Unde a fost realizata consultatia",
    simptome: "Simptome",
    diagnostic: "Diagnostic",
    cod: "Cod consultatie",
    prescriptie: "Prescriptie / Recomandări",
    nr_zile_medical: "Nr. zile concediu medical",
  };
  const [values, setValues] = useState({
    data: investigatie.data,
    locul: investigatie.locul,
    simptome: investigatie.simptome,
    diagnostic: investigatie.diagnostic,
    prescriptie: investigatie.prescriptie,
    nr_zile_medical: investigatie.nr_zile_medical,
    cod: investigatie.cod,
  });
  // console.log("investigatie", investigatie);

  return (
    <div className="w-full">
      {Object.keys(values).map((val, i) => {
        if (val === "nr_zile_medical") {
          return (
            <div key={i} className="w-full mb-20">
              <label className=" text-xl font-medium duration-300 text-black w-full">
                {labels[val]}
                <input
                  readOnly
                  type="number"
                  name={val}
                  value={values[val]}
                  className="outline-none w-full max-w-lg font-normal mt-4  border-c4 border-b-2 p-2"
                />
              </label>
            </div>
          );
        } else if (val === "data") {
          return (
            <div key={i} className="w-full mb-20">
              <label className=" text-xl font-medium duration-300 text-black w-full">
                {labels[val]}
                <input
                  readOnly
                  type="date"
                  name={val}
                  value={values[val]}
                  className="outline-none w-full max-w-lg font-normal mt-4  border-c4 border-b-2 p-2"
                />
              </label>
            </div>
          );
        } else if (
          val === "simptome" ||
          val === "diagnostic" ||
          val === "prescriptie"
        ) {
          return (
            <div key={i} className="w-full mb-20">
              <label className=" text-xl font-medium duration-300 text-black w-full">
                {labels[val]}
                <textarea
                  readOnly
                  type="text"
                  name={val}
                  value={values[val]}
                  className="outline-none w-full max-w-lg font-normal mt-4 h-28 text-base border-c4 bg-orange-50 border-b-2 p-2"
                />
              </label>
            </div>
          );
        } else
          return (
            <div key={i} className="w-full mb-20">
              <label className=" text-xl font-medium duration-300 text-black w-full">
                {labels[val]}
                <input
                  readOnly
                  type="text"
                  name={val}
                  value={values[val]}
                  className="outline-none w-full max-w-lg font-normal mt-4  border-c4  border-b-2 p-2"
                />
              </label>
            </div>
          );
      })}
      <div className="fixed bottom-4 right-4 md:right-14 md:top-12 flex">
        <button
          onClick={() => handlePageCI()}
          className=" bg-c5 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white hover:scale-110"
        >
          <i className="fa-solid fa-arrow-left self-center"></i>
        </button>
        {/* <button
          onClick={() => handlePage(2)}
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
          <i className="fa-solid fa-check self-center"></i>
        </button> */}
      </div>
    </div>
  );
}

function Investigatii({ investigatii, handlePage, handlePageCI }) {
  const router = useRouter();
  // console.log("investigatii", investigatii);
  const role = Cookies.get("role");
  if (investigatii) {
    return (
      <div className="">
        {role === "medic" && (
          <button
            className=" bg-c1 p-2 mt-4 rounded-xl font-normal text-lg w-full hover:scale-110"
            onClick={() => handlePage(3)}
          >
            Adauga investigatie / consultatie
          </button>
        )}
        {Object.keys(investigatii).map((val, i) => {
          return (
            <div
              onClick={() => handlePageCI(investigatii[val])}
              className={
                role === "medic"
                  ? "w-full text-center border border-c1 mt-4 rounded-xl p-2 cursor-pointer"
                  : "w-full text-center border border-c4 mt-4 rounded-xl p-2 cursor-pointer"
              }
              key={i}
            >
              <p>{investigatii[val].data}</p>
            </div>
          );
        })}
      </div>
    );
  } else return <div></div>;
}

export default Investigatii;
