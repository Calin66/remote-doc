import React, { useState, useEffect, useRef } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import Cookies from "js-cookie";

export default function useFetchForMap() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coordinatesUser, setCoordinatesUser] = useState([]);
  const [markers, setMarkers] = useState([]);

  const role = Cookies.get("role");

  const auth = getAuth();
  const user = auth.currentUser;

  let colectie;
  if (role === "medic") colectie = "markers";
  else if (role === "pacient") colectie = "pacienti";

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const docRef = doc(db, colectie, user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.coordinates) setCoordinatesUser(data.coordinates);
            else setCoordinatesUser([]);

            if (role === "pacient") {
              const querySnapshot = await getDocs(collection(db, "markers"));
              const m = [];
              querySnapshot.forEach((doc) => {
                // console.log("m.push", doc.data());
                m.push(doc.data());
              });
              setMarkers(m);
            }
          } else {
            setCoordinatesUser([]);
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

  return { loading, error, coordinatesUser, setCoordinatesUser, markers };
}
