import React, { useState, useEffect, useRef } from "react";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import Cookies from "js-cookie";

export default function useFetchForChat(combinedId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const [info, setInfo] = useState({});
  const [combinedID, setCombinedID] = useState();

  const role = Cookies.get("role");

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    async function fetchData() {
      console.log("INCA UN FETCH");
      if (user) {
        try {
          if (role === "pacient") {
            // const collection = role === "pacient" ? "pacienti" : "medici";
            const docRef = doc(db, "pacienti", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const dat = docSnap.data();
              setInfo(dat);
              const combinedId =
                user.uid > dat.doc_uid
                  ? user.uid + dat.doc_uid
                  : dat.doc_uid + user.uid;

              setCombinedID(combinedId);

              const docRef2 = doc(db, "chats", combinedId);
              const docSnap2 = await getDoc(docRef2);

              console.log("combinedId", combinedId);

              if (docSnap2.exists()) {
                setData(docSnap2);
              } else {
                await setDoc(doc(db, "chats", combinedId), {
                  messages: {},
                });
              }
            }
          } else if (role === "medic") {
            const docRef = doc(db, "medici", user.uid);
            const docSnap = await getDoc(docRef);
            const dat = docSnap.data();
            setInfo(dat);

            if (docSnap.exists() && combinedId) {
              console.log("BAI TOTUSI AICI AJUNG");

              const docRef2 = doc(db, "chats", combinedId);
              const docSnap2 = await getDoc(docRef2);

              if (docSnap2.exists()) {
                setData(docSnap2);
              } else {
                await setDoc(doc(db, "chats", combinedId), {
                  messages: {},
                });
              }

              // const combinedId =
              //   user.uid > dat.doc_uid
              //     ? user.uid + dat.doc_uid
              //     : dat.doc_uid + user.uid;

              // setCombinedID(combinedId);

              // const docRef2 = doc(db, "chats", combinedId);
              // const docSnap2 = await getDoc(docRef2);

              // console.log("combinedId", combinedId);

              // if (docSnap2.exists()) {
              //   setData(docSnap2);
              // } else {
              //   await setDoc(doc(db, "chats", combinedId), {
              //     messages: {},
              //   });
              // }
            }
          }
        } catch (err) {
          setError("Failed to load pacient data");
          console.log(err);
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [user, combinedId]);
  return { data, error, loading, combinedID, info };
}
