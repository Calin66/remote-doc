import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import * as QRCode from "qrcode";

function index() {
  const [nume, setNume] = useState("");
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pacienti, setPacienti] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState("");

  const { currentUser } = useAuth();

  const handleSubmit = () => {
    setIsSubmitting(true);
    if (!nume) setErrors("Camp obligatoriu");
  };

  async function handleAddPacient() {
    if (pacienti) {
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
          nume: nume,
          activate: false,
        },
      });

      const userRef = doc(db, "medici", currentUser.uid);
      await setDoc(
        userRef,
        {
          pacienti: {
            [newKey]: {
              link: unique_id,
              nume: nume,
              activate: false,
            },
          },
        },
        { merge: true }
      );
      QRCode.toDataURL(link).then(setSrc);
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        try {
          const docRef = doc(db, "medici", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPacienti(docSnap.data().pacienti);
          } else {
            setPacienti({});
          }
        } catch (err) {
          setError("Failed to load pacienti");
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!errors && isSubmitting) {
      handleAddPacient();
    }
  }, [errors, isSubmitting]);
  return (
    <div className="md:border border-c2 rounded-xl p-10 flex flex-col items-center w-full max-w-lg">
      <input
        type="text"
        name="nume"
        value={nume}
        onChange={(e) => setNume(e.target.value)}
        placeholder="Nume complet pacient"
        className={
          errors
            ? "mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c5 text-slate-900 p-2 w-full max-w-lg self-center"
            : "mt-10 outline-none duration-300 border-b-2 border-solid  focus:border-c3 border-c2 text-slate-900 p-2 w-full max-w-lg self-center"
        }
      />
      <button
        onClick={handleSubmit}
        className="w-4/5 py-3 bg-c2 text-white rounded-xl mt-10"
      >
        Generează codul QR
      </button>
      {src && <img src={src} />}
    </div>
  );
}

export default index;
