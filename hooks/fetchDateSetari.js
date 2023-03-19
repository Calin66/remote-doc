import React, { useState, useEffect, useRef } from "react";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import Cookies from "js-cookie";
import { getAuth } from "firebase/auth";
import _ from "lodash";

export default function useFetchDateMedic(valuesLocal) {
  const [loadingD, setLoadingD] = useState(true);
  const [errorD, setErrorD] = useState(null);
  const [date, setDate] = useState({});

  const auth = getAuth();
  const user = auth.currentUser;

  const handleEditDate = async (valoriLocal, valoriDb) => {
    if (_.isEqual(valoriDb, valoriLocal)) {
      console.log("Sunt egale nu am facut nimic");
    } else if (user.uid) {
      try {
        await setDoc(
          doc(db, "medici", user.uid),
          {
            nume: valoriLocal.nume,
            email: valoriLocal.email,
            program_clinica: valoriLocal.program_clinica,
            program_domiciliu: valoriLocal.program_domiciliu,
            asistenti: valoriLocal.asistenti,
          },
          { merge: true }
        );
        console.log("Changes synced with db");
      } catch (error) {
        console.log("eroare in catch in fetchDateSetari", error);
      }
    }
  };

  const { currentUser } = useAuth();
  const role = Cookies.get("role");
  useEffect(() => {
    async function fetchData() {
      if (Object.keys(date).length !== 0) {
        // console.log("date in fetch", date);
        setLoadingD(false);
      } else if (currentUser && role === "medic") {
        try {
          const docRef = doc(db, "medici", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const dat = docSnap.data();
            const dateAici = {};
            Object.keys(valuesLocal).map((cheie, i) => {
              if (dat[cheie]) dateAici[cheie] = dat[cheie];
              else {
                dateAici[cheie] = valuesLocal[cheie];
              }
            });
            setDate(dateAici);
          } else {
            console.log("Schimb date la {}");
            setDate({});
          }
        } catch (err) {
          setErrorD("Failed to load medic data");
          console.log(err);
        }
        setLoadingD(false);
      }
    }
    fetchData();
  }, []);
  return { loadingD, errorD, date, handleEditDate };
}

export function useFetchDatePacient(valuesLocal) {
  const [loadingP, setLoadingP] = useState(true);
  const [errorP, setErrorP] = useState(null);
  const [date, setDate] = useState({});

  const auth = getAuth();
  const user = auth.currentUser;

  const handleEditDate = async (valoriLocal, valoriDb) => {
    if (_.isEqual(valoriDb, valoriLocal)) {
      console.log("Sunt egale nu am facut nimic");
    } else if (user.uid) {
      try {
        await setDoc(
          doc(db, "pacienti", user.uid),
          {
            nume: valoriLocal.nume,
            email: valoriLocal.email,
            telefon: valoriLocal.telefon,
            cnp: valoriLocal.cnp,
          },
          { merge: true }
        );
        console.log("Changes synced with db");
      } catch (error) {
        console.log("eroare in catch in fetchDateSetari", error);
      }
    }
  };

  const { currentUser } = useAuth();
  const role = Cookies.get("role");
  useEffect(() => {
    async function fetchData() {
      if (Object.keys(date).length !== 0) {
        // console.log("date in fetch", date);
      } else if (currentUser && role === "pacient") {
        try {
          const docRef = doc(db, "pacienti", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const dat = docSnap.data();
            const dateAici = {};
            Object.keys(valuesLocal).map((cheie, i) => {
              if (dat[cheie]) dateAici[cheie] = dat[cheie];
              else {
                dateAici[cheie] = valuesLocal[cheie];
              }
            });
            setDate(dateAici);
          } else {
            console.log("Schimb date la {}");
            setDate({});
          }
        } catch (err) {
          setErrorP("Failed to load medic data");
          console.log(err);
        }
      }
    }
    fetchData();
    setLoadingP(false);
  }, []);
  return { loadingP, errorP, date, handleEditDate };
}
