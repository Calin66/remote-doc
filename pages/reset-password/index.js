import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";

function index() {
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (email) {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setPage(2);
        })
        .catch((error) => {
          console.log(error);
        });
      setPage(2);
    } else setError("Camp obligatoriu");
  };
  return (
    <div className="w-full flex flex-col items-center px-2 md:border border-c2 md:w-1/2 rounded-lg self-center md:py-20 md:px-14">
      {page === 1 && (
        <>
          <h1 className=" text-2xl font-semibold">Resetare parola</h1>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresa de email"
            className={
              error
                ? "mt-16 text-xl outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c5 text-slate-900 p-2 w-full max-w-lg"
                : "mt-16 text-xl outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg"
            }
          />
          <button
            className="bg-c2 rounded-lg py-3 w-full max-w-xs text-white font-medium mt-10"
            onClick={handleSubmit}
          >
            {" "}
            Trimite
          </button>
        </>
      )}
      {page === 2 && (
        <h1 className="text-center text-xl font-semibold">
          Cererea ta a fost trimisă. Vei primi un link pe email pe care îl vei
          putea folosi să îți resetezi parola.
        </h1>
      )}
    </div>
  );
}

export default index;
