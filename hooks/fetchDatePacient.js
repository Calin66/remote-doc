import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import Cookies from "js-cookie";
import _, { orderBy } from "lodash";
import { getAuth } from "firebase/auth";

export default function useFetchPacient(valuesLocal, id) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState({});
  const [date2, setDate2] = useState({});

  const role = Cookies.get("role");

  const auth = getAuth();
  const user = auth.currentUser;

  const handleEditDate = async (valoriLocal, valoriDb) => {
    if (_.isEqual(valoriDb, valoriLocal)) {
      console.log("Sunt egale nu am facut nimic");
    } else if (id && role === "medic") {
      try {
        await setDoc(
          doc(db, "pacienti", id),
          {
            antecedente_heredocolaterale:
              valoriLocal.antecedente_heredocolaterale,
            antecedente_personale: valoriLocal.antecedente_personale,
          },
          { merge: true }
        );
        console.log("Changes synced with db");
      } catch (error) {
        console.log("eroare in catch in fetchDateSetari", error);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      // console.log(id);
      if (Object.keys(date).length !== 0) {
        // console.log("date in fetch", date);
        setLoading(false);
      } else if (role === "medic" && id) {
        console.log("AM INTRAT IN SMECHERIe");
        // console.log("id", id);
        // console.log("valuesLocal", valuesLocal);

        try {
          const docRef = doc(db, "pacienti", id);
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
            // console.log("dateAici", dateAici);
            setDate(dateAici);
            // console.log("MERG FIX INATINTE DE FOR FILES");
            const forFiles = async () => {
              // console.log("SUNT IN FOR FILES");
              const q = query(
                collection(db, "fisiere"),
                orderBy("data", "desc")
              );
              const querySnapshot = await getDocs(q);
              const dateAici = {};
              let cheie = 1;
              querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                const data = doc.data();
                if (
                  data.from === id ||
                  data.to === id ||
                  data.from === user.uid ||
                  data.to === user.uid
                ) {
                  dateAici[cheie] = data;
                  cheie++;
                }
                console.log("fisssssiere", dateAici);
                setDate2(dateAici);
                // doc.data() is never undefined for query doc snapshots
              });
            };
            forFiles();
          } else {
            console.log("Schimb date la {}");
            setDate({});
          }
        } catch (err) {
          setError("Failed to load pacient data");
          console.log(err);
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);
  return { date, date2, handleEditDate, error, loading };
}

export function useFetchPacientinPacient(valuesLocal) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [date, setDate] = useState({});
  // const [date_medic, setDate_medic] = useState({});

  const role = Cookies.get("role");

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    async function fetchData() {
      if (Object.keys(date).length !== 0) {
        setLoading(false);
      } else if (role === "pacient" && user) {
        try {
          const docRef = doc(db, "pacienti", user.uid);
          const docSnap = await getDoc(docRef);

          const docRef2 = doc(db, "medici", docSnap.data().doc_uid);
          const docSnap2 = await getDoc(docRef2);

          if (docSnap.exists()) {
            const dat = docSnap.data();
            const dat2 = docSnap2.data();
            const dateAici = {};
            Object.keys(valuesLocal).map((cheie, i) => {
              if (dat2[cheie]) dateAici[cheie] = dat[cheie];
              else if (dat[cheie]) dateAici[cheie] = dat[cheie];
              else {
                dateAici[cheie] = valuesLocal[cheie];
              }
            });

            console.log("dateAici", dateAici);
            setDate(dateAici);
          } else {
            console.log("Schimb date la {}");
            setDate({});
          }
        } catch (err) {
          setError("Failed to load pacient data");
          console.log(err);
        }
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  return { date, error, loading };
}
