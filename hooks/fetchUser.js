import { db } from "@/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useState } from "react";

export async function GetUserData(type, id) {
  async function fetchData() {
    let docRef;
    if (type == "medic") docRef = doc(db, "medici", id);
    else docRef = doc(db, "pacienti", id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      else return {};
    } catch (err) {
      setError("Failed to fetch user");
      console.log(err);
    }
  }
  return fetchData();
}

function FetchUser() {
  return;
}

export default FetchUser;
