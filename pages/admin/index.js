import { db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { async } from "@firebase/util";

function index() {
  const [medici, setMedici] = useState([]);
  const [isMedic] = useState(Cookies.get("role") == "medic");
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser || !isMedic) router.push("/");
    else {
      let data;
      const fetchCurrentUser = async () => {
        const doc_ref = doc(db, "medici", currentUser.uid);
        const snap = await getDoc(doc_ref);
        if (snap.exists()) data = snap.data();
      };
      fetchCurrentUser().then(() => {
        if (!data.admin) {
          router.push("/");
        } else {
          setIsAdmin(true);
          const ref = collection(db, "medici");
          let snapshot;
          const fetch = async () => {
            const newMedici = [];
            const q = query(ref, where("confirmed", "==", false));
            snapshot = await getDocs(q);
            snapshot = snapshot.forEach((d) => {
              newMedici.push(d.data());
            });
            setMedici(newMedici);
          };
          fetch();
        }
      });
    }
  }, []);

  const aprove = (m) => {
    const newState = [...medici];
    const index = newState.indexOf(m);
    newState.splice(index, 1);
    setMedici(newState);

    m.confirmed = true;
    const update = async () => await setDoc(doc(db, "medici", m.uid), m);
    update();
  };

  const deny = (m) => {
    const newState = [...medici];
    const index = newState.indexOf(m);
    newState.splice(index, 1);
    setMedici(newState);
  };

  return (
    <React.Fragment>
      {isAdmin && (
        <React.Fragment>
          <p className="mb-8 text-xl font-medium">
            Cererile de aprobare a contului de medic
          </p>
          <div className="flex flex-col gap-4">
            {medici.map((m) => {
              return (
                <div
                  key={m.uid}
                  className="flex flex-row items-center gap-4 text-lg"
                >
                  <div className="text-lg w-40">{m.nume}</div>
                  <a
                    className="text-blue-700 underline"
                    href={m.dovada}
                    target="_blank"
                  >
                    Dovadă
                  </a>
                  <button
                    className="bg-c2 rounded-md p-2 text-white hover:scale-105 hover:duration-75 hover:brightness-95 hover:ease-in-out w-20"
                    onClick={() => aprove(m)}
                  >
                    Aprobă
                  </button>
                  <button
                    className="bg-red-700 rounded-md p-2 text-white hover:scale-105 hover:duration-75 hover:brightness-95 w-20"
                    onClick={() => deny(m)}
                  >
                    Refuză
                  </button>
                </div>
              );
            })}
            {medici.length == 0 && (
              <p className="text-lg">
                Aici vor apărea cererile pentru aprobarea conturilor de medic
              </p>
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default index;
