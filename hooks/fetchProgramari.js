import { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import Cookies from "js-cookie";

export default function useFetchProgramari() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appo, setAppo] = useState([]);
  const [docAppo, setDocAppo] = useState([]);
  const [isMedic] = useState(Cookies.get("role") == "medic");

  const { currentUser } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const app = [];
          const q = query(
            collection(db, "programari"),
            where(isMedic ? "idMedic" : "idPacient", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const el = doc.data();
            el.id = doc.id;
            app.push(el);
          });
          setAppo(app);

          if (!isMedic) {
            const ref = doc(db, "pacienti", currentUser.uid);
            const snap = await getDoc(ref);

            const app = [];
            const q = query(
              collection(db, "programari"),
              where("idMedic", "==", snap.data().doc_uid)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              const el = doc.data();
              el.id = doc.id;
              app.push(el);
            });
            setDocAppo(app);
          }
        } catch (err) {
          setError("Failed to load appointments");
          console.log(err);
        } finally {
          setLoading(false);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { loading, error, appo, setAppo, docAppo };
}
