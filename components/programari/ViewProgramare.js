import React, { useEffect, useState } from "react";
import { getDoc, doc, deleteDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { db } from "@/firebase";
import { useRouter } from "next/router";

function ViewProgramare({ a }) {
  const [isMedic, setIsMedic] = useState(Cookies.get("role") == "medic");
  const [app, setApp] = useState(a);
  const router = useRouter();

  const deleteProg = (id) => {
    const docRef = doc(db, "programari", id);
    deleteDoc(docRef).then(() => {
      router.reload();
    });
  };

  return (
    <div className="w-full h-fit p-4 bg-slate-100 rounded-tl-xl rounded-br-xl">
      {isMedic && (
        <React.Fragment>
          <p className="text-xl mb-4 mt-8">{a.numePacient}</p>
          <p className="text-md mb-4">{a.notes}</p>
          <p className="text-sm mb-4">
            Programare{" "}
            {a.priority == 1
              ? "obișnuită"
              : a.priority == 2
              ? "prioritară"
              : "urgentă"}
          </p>
          {a.adHoc && <p className="text-sm mb-4">Programare adHoc</p>}
          <div
            className="h-fit w-1/2 mt-8 relative left-1/4 p-2 text-white text-sm rounded-md bg-red-700"
            onClick={() => {
              deleteProg(a.id);
            }}
          >
            Șterge
          </div>
        </React.Fragment>
      )}
      {!isMedic && (
        <React.Fragment>
          <p className="text-xl mb-4 mt-8">{a.numeMedic}</p>
          <p className="text-md mb-4">{a.notes}</p>
          <p className="text-sm mb-4">
            Programare{" "}
            {a.priority == 1
              ? "obișnuită"
              : a.priority == 2
              ? "prioritară"
              : "urgentă"}
          </p>
          <div
            className="h-fit w-1/2 mt-8 relative left-1/4 p-2 text-white text-sm rounded-md bg-red-700"
            onClick={() => {
              deleteProg(a.id);
            }}
          >
            Șterge
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default ViewProgramare;
