import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import useFetchPacienti from "../hooks/fetchPacienti";

export default function DashboardMedici() {
  const { currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  const [pas, setPas] = useState(1);
  const { pacienti, setPacienti, loading, error } = useFetchPacienti();

  async function handleAddPacient() {
    const newKey =
      Object.keys(pacienti).length === 0
        ? 1
        : Math.max(...Object.keys(pacienti)) + 1;
    setPacienti({ ...pacienti, [newKey]: todo });
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(
      userRef,
      {
        todos: {
          [newKey]: todo,
        },
      },
      { merge: true }
    );
    setTodo("");
  }

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
      {!loading && pas === 1 && (
        <>
          {Object.keys(pacienti).map((pacient, i) => {
            return <TodoCard key={i}>{pacienti[pacient]}</TodoCard>;
          })}
        </>
      )}
      <button
        onClick={() => setPas(2)}
        className=" bg-c2 font-bold text-2xl flex align-middle justify-center
        rounded-full w-14 h-14 center text-white absolute bottom-10 right-10"
      >
        <i className="fa-solid fa-plus self-center"></i>
      </button>
    </div>
  );
}
