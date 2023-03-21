import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { db } from "@/firebase";

const Search = ({ info, setCombinedId }) => {
  const [username, setUsername] = useState("");

  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const [vb, setVb] = useState("");

  const { currentUser } = useAuth();

  const role = Cookies.get("role");

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("");
  };

  useEffect(() => {
    if (vb) {
      console.log("vb", vb);

      const index = Object.keys(info.pacienti).find((ind) => {
        return info.pacienti[ind].nume === vb && info.pacienti[ind].activate;
      });

      const pacient = info.pacienti[index];

      const combinedId =
        currentUser.uid > pacient.uid
          ? currentUser.uid + pacient.uid
          : pacient.uid + currentUser.uid;

      setCombinedId(combinedId);
      console.log("CI", combinedId);
    }
  }, [vb]);

  return (
    <div className=" z-20 fixed top-5 bg-white border border-c6 w-6/12 max-w-lg self-center items-center px-2 md:px-20  rounded-2xl mb-5 flex flex-col">
      {role === "pacient" && (
        <div>
          <h1>Nume medic: {info.numeMedic}</h1>
        </div>
      )}
      {role === "medic" && (
        <div>
          <label>
            <select
              name="pacient"
              className="rounded-lg w-full py-2 px-4 outline-none"
              value={vb}
              onChange={(e) => setVb(e.target.value)}
            >
              <option></option>

              {Object.keys(info.pacienti).map((inf, i) => {
                console.log("inf", inf);
                console.log("info[inf]", info.pacienti[inf]);
                const pacient = info.pacienti[inf];
                if (pacient.activate)
                  return (
                    <option key={i} value={pacient.nume}>
                      {pacient.nume}
                    </option>
                  );
              })}
            </select>
          </label>
        </div>
      )}
    </div>
  );
};

export default Search;
