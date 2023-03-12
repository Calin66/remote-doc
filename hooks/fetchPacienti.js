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

  return { loading, error, pacienti, setPacienti };
}

export function useFetchAllPacienti(idpn) {
  const [allLoading, setAllLoading] = useState(true);
  const [allError, setAllError] = useState(null);

  const [statuss, setStatuss] = useState(false);
  const [doc_uid, setDoc_uid] = useState();
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log("idpn", idpn);

    async function fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, "medici"));

        querySnapshot.forEach((doc) => {
          const pacienti = doc.data().pacienti;
          Object.keys(pacienti).map((pacient, i) => {
            console.log("pacient in fetchPacients", pacienti[pacient]);
            console.log("link in fetchPacients", idpn);
            if (pacienti[pacient].link == idpn) {
              setStatuss(true);
              setDoc_uid(doc.data().uid);
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
        setAllError("Failed to load pacients");
        console.log(err);
      } finally {
        setAllLoading(false);
      }
    }
    if (idpn) {
      fetchData();
      console.log("fetchData");
    }
  }, []);
  console.log("STATUSS AICI", statuss);

  return { allLoading, allError, statuss, doc_uid };
}
