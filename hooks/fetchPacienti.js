import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

export default function useFetchPacienti() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pacienti, setPacienti] = useState([]);

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
