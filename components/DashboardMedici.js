import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, deleteField, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import useFetchPacienti from "../hooks/fetchPacienti";
import { validateNewPacientInfo } from "@/pages/validateInfo";
import { v4 as uuid } from "uuid";
import PacientCard from "./PacientCard";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/router";

export default function DashboardMedici() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const [pas, setPas] = useState(false);
  const { pacienti, setPacienti, loading, error } = useFetchPacienti();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // console.log("pacienti,", pacienti);
  const [values, setValues] = useState({
    email: "",
    nume: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateNewPacientInfo(values));
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting && currentUser) {
      async function handleAddPacient() {
        const unique_id = uuid();
        const link = `http://localhost:3000/register/pacientnou/${unique_id}`;
        const newKey =
          Object.keys(pacienti).length === 0
            ? 1
            : Math.max(...Object.keys(pacienti)) + 1;
        setPacienti({
          ...pacienti,
          [newKey]: {
            link: unique_id,
            nume: values.nume,
            activate: false,
            email: values.email,
          },
        });

        const userRef = doc(db, "medici", currentUser.uid);
        await setDoc(
          userRef,
          {
            pacienti: {
              [newKey]: {
                link: unique_id,
                nume: values.nume,
                activate: false,
              },
            },
          },
          { merge: true }
        );
        const sendEmail = () => {
          emailjs
            .send(
              "service_dys0sja",
              "template_sz3udb8",
              {
                link: link,
                email: values.email,
                nume: currentUser.displayName,
              },
              "j-uAUT8IyQlZRAwWF"
            )
            .then(
              (result) => {
                console.log("Emailul s-a trimis", result.text);
              },
              (error) => {
                console.log(error.text);
              }
            );
        };
        sendEmail();
      }
      handleAddPacient();
      setIsSubmitting(false);
      setPas(false);
      setValues({
        email: "",
        nume: "",
      });
    }
  }, [errors, isSubmitting]);

  const handlePas = () => {
    setPas(!pas);
  };

  const handleDelete = async (link) => {
    // console.log("pacienti", pacienti);
    // console.log("link", link);
    let index = 0;
    Object.keys(pacienti).findIndex((pacient) => {
      if (pacienti[pacient].link === link) {
        index = pacient;
        return true;
      } else return false;
    });
    try {
      const pacientRef = doc(db, "medici", currentUser.uid);

      await setDoc(
        pacientRef,
        {
          pacienti: { [index]: deleteField() },
        },
        { merge: true }
      );

      const copiePacienti = { ...pacienti };

      delete copiePacienti[index];
      console.log("copiePacienti", copiePacienti);

      setPacienti(copiePacienti);
    } catch (e) {
      console.log(e);
    }
  };
  let i;
  let j;

  return (
    <div className=" md:w-1/2 self-center  rounded-lg md:p-16 md:relative md:pb-20 w-full">
      {!loading && !pas && (
        <>
          <div>
            <h2 className="text-xl">Pacienti confirmati</h2>
            <div>
              {Object.keys(pacienti).map((pacient, i) => {
                // console.log("pp", pacienti[pacient]);
                if (pacienti[pacient].activate) {
                  i = true;
                  return (
                    <PacientCard
                      activate={pacienti[pacient].activate}
                      key={i}
                      id={pacienti[pacient].uid}
                    >
                      {pacienti[pacient]}
                    </PacientCard>
                  );
                } else return <div key={i}></div>;
              })}
              {!i && (
                <h1 className="mt-4">
                  Momentan nu ai nici un pacient confirmat.
                </h1>
              )}
            </div>
          </div>
          <div className="mt-16">
            <h2 className="text-xl">Pacienti neconfirmati</h2>
            <div>
              {Object.keys(pacienti).map((pacient, i) => {
                if (!pacienti[pacient].activate) {
                  j = true;
                  return (
                    <PacientCard
                      activate={pacienti[pacient].activate}
                      key={i}
                      handleDelete={handleDelete}
                      link={pacienti[pacient].link}
                      pacient={pacienti[pacient]}
                    >
                      {pacienti[pacient]}
                    </PacientCard>
                  );
                } else return <div key={i}></div>;
              })}
              {!j && (
                <h1 className="mt-4">
                  Momentan nu ai nici un pacient neconfirmat.
                </h1>
              )}
            </div>
          </div>
        </>
      )}
      {!loading && pas && (
        <div className="flex flex-col">
          <h1 className="mt-10 mb-10 text-2xl self-center">Invită pacienți</h1>
          <input
            type="text"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Adresa de email"
            className="mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg self-center"
          />

          {errors.email && (
            <p className=" text-base text-c2 w-full p-2 self-center max-w-lg">
              {errors.email}
            </p>
          )}
          <input
            type="text"
            name="nume"
            value={values.nume}
            onChange={handleChange}
            placeholder="Nume complet"
            className="mt-14 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg self-center"
          />
          {errors.nume && (
            <p className=" text-base text-c2 w-full p-2 self-center max-w-lg">
              {errors.nume}
            </p>
          )}
          <button
            className="text-center bg-c2 text-white font-medium py-3 rounded-lg mt-24 w-5/6 mb-5 self-center max-w-xs"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
      <div className="fixed bottom-4 right-4 md:right-14 md:top-12 flex">
        <button
          onClick={handlePas}
          className=" bg-c2 text-lg flex align-middle justify-center
            rounded-full w-12 h-12 center text-white"
        >
          {pas ? (
            <i className="fa-solid fa-check self-center"></i>
          ) : (
            <i className="fa-solid fa-plus self-center"></i>
          )}
        </button>
      </div>
    </div>
  );
}
