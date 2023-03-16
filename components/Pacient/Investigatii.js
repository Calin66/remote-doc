import { db } from "@/firebase";
import { validateDateConsultatie } from "@/pages/validateInfo";
import { doc, setDoc } from "firebase/firestore";
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
    prescriptie: "Prescriptie",
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
            rounded-full w-12 h-12 center text-white mr-3"
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
            rounded-full w-12 h-12 center text-white"
        >
          <i className="fa-solid fa-check self-center"></i>
        </button>
      </div>
    </div>
  );
}

export function Investigatie({ investigatie }) {
  const router = useRouter();

  return (
    <div className="w-full">
      <h1>PAAA</h1>
    </div>
  );
}

function Investigatii({ investigatii, handlePage, handlePageCI }) {
  const router = useRouter();
  console.log("investigatii", investigatii);
  if (investigatii) {
    return (
      <div className="">
        <button
          className=" bg-c1 p-2 mt-4 rounded-xl font-normal text-lg w-full"
          onClick={() => handlePage(3)}
        >
          Adauga investigatie / consultatie
        </button>
        {Object.keys(investigatii).map((val, i) => {
          return (
            <div
              onClick={() => handlePageCI(val)}
              className="w-full text-center border border-c1 mt-4 rounded-xl p-2"
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
