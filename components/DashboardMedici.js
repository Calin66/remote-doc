import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import useFetchPacienti from "../hooks/fetchPacienti";
import { validateNewPacientInfo } from "@/pages/validateInfo";
import { v4 as uuid } from "uuid";
import PacientCard from "./PacientCard";
import emailjs from "@emailjs/browser";

export default function DashboardMedici() {
  const { currentUser } = useAuth();
  const [pas, setPas] = useState(false);
  const { pacienti, setPacienti, loading, error } = useFetchPacienti();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [values, setValues] = useState({
    email: "",
    nume: "",
    activate: false,
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
          [newKey]: { link: link, nume: values.nume },
        });

        const userRef = doc(db, "medici", currentUser.uid);
        await setDoc(
          userRef,
          {
            pacienti: {
              [newKey]: { link: link, nume: values.nume },
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
                numemedic: currentUser.displayName,
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
        activate: false,
      });
    } else {
      console.log("errors", errors);
    }
  }, [errors, isSubmitting]);

  const handlePas = () => {
    setPas(!pas);
  };

  // async function handleEditTodo() {
  //   if (!edittedValue) {
  //     return;
  //   }
  //   const newKey = edit;
  //   setTodos({ ...todos, [newKey]: edittedValue });
  //   const userRef = doc(db, "users", currentUser.uid);
  //   await setDoc(
  //     userRef,
  //     {
  //       todos: {
  //         [newKey]: edittedValue,
  //       },
  //     },
  //     { merge: true }
  //   );
  //   setEdit(null);
  //   setEdittedValue("");
  // }

  // function handleAddEdit(todoKey) {
  //   return () => {
  //     console.log(todos[todoKey]);
  //     console.log("bannan");
  //     setEdit(todoKey);
  //     setEdittedValue(todos[todoKey]);
  //   };
  // }

  // function handleDelete(todoKey) {
  //   return async () => {
  //     const tempObj = { ...todos };
  //     delete tempObj[todoKey];

  //     setTodos(tempObj);
  //     const userRef = doc(db, "users", currentUser.uid);
  //     await setDoc(
  //       userRef,
  //       {
  //         todos: {
  //           [todoKey]: deleteField(),
  //         },
  //       },
  //       { merge: true }
  //     );
  //   };
  // }

  return (
    <div className="">
      {!loading && !pas && (
        <>
          <div>
            <h2>Pacienti confirmati</h2>
            <div>
              {Object.keys(pacienti).map((pacient, i) => {
                if (pacient.activate)
                  return (
                    <PacientCard activate={pacient.activate} key={i}>
                      {pacienti[pacient]}
                    </PacientCard>
                  );
                else return <div key={i}></div>;
              })}
            </div>
          </div>
          <div className="mt-10">
            <h2>Pacienti neconfirmati</h2>
            <div>
              {Object.keys(pacienti).map((pacient, i) => {
                if (!pacient.activate)
                  return (
                    <PacientCard activate={pacient.activate} key={i}>
                      {pacienti[pacient]}
                    </PacientCard>
                  );
                else return <div key={i}></div>;
              })}
            </div>
          </div>
        </>
      )}
      {!loading && pas && (
        <div className="flex flex-col px-8">
          <h1 className="mt-10 mb-10 text-2xl self-center">Invită pacienți</h1>
          <input
            type="text"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Adresa de email"
            className="mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c4 border-c5 text-slate-900 p-2 w-full max-w-[40ch]"
          />

          {errors.email && (
            <p className="mb-4 text-base text-c5 w-full p-2">{errors.email}</p>
          )}
          <input
            type="text"
            name="nume"
            value={values.nume}
            onChange={handleChange}
            placeholder="Nume complet"
            className="mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c4 border-c5 text-slate-900 p-2 w-full max-w-[40ch]"
          />
          {errors.nume && (
            <p className="mb-4 text-base text-c5 w-full p-2">{errors.nume}</p>
          )}
          <button
            className="text-center bg-c5 text-white font-medium py-3 rounded-lg mt-20 w-5/6 mb-5 self-center"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
      <button
        onClick={handlePas}
        className=" bg-c5 font-bold text-2xl flex align-middle justify-center
        rounded-full w-14 h-14 center text-white absolute bottom-10 right-10"
      >
        <i className="fa-solid fa-plus self-center"></i>
      </button>
    </div>
  );
}
