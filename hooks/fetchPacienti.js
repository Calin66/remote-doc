import React, { useState, useEffect, useRef } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

export default function useFetchPacienti() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pacienti, setPacienti] = useState({});

  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchData() {
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
    fetchData();
  }, []);

  return { loading, error, pacienti, setPacienti };
}

export function useFetchAllPacienti(idpn) {
  const [allLoading, setAllLoading] = useState(true);
  const [allError, setAllError] = useState(null);

  const [statuss, setStatuss] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, "medici"));
        querySnapshot.forEach((doc) => {
          const pacienti = doc.data().pacienti;
          // console.log("docu.pacienti", docu.pacienti);

          Object.keys(pacienti).map((pacient, i) => {
            if (pacienti[pacient].link === idpn) {
              setStatuss(true);
            }
          });
        });
        // const docRef = doc(db, "medici", currentUser.uid);
        // const docSnap = await getDoc(docRef);
        // if (docSnap.exists()) {
        //   setPacienti(docSnap.data().pacienti);
        // } else {
        //   setPacienti({});
        // }
      } catch (err) {
        setAllError("Failed to load pacienti");
        console.log(err);
      } finally {
        setAllLoading(false);
      }
    }
    fetchData();
  }, []);

  return { allLoading, allError, statuss };
}
