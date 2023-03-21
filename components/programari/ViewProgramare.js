import React, { useEffect, useState, useRef } from "react";
import { getDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { db } from "@/firebase";
import { useRouter } from "next/router";
import { async } from "@firebase/util";

function ViewProgramare({ a }) {
  const [isMedic, setIsMedic] = useState(Cookies.get("role") == "medic");
  const [isEditing, setIsEditing] = useState(false);
  const [app, setApp] = useState(a);
  const [oldState, setOldState] = useState({});
  const router = useRouter();
  const didMount = useRef(false);

  const deleteProg = (id) => {
    const docRef = doc(db, "programari", id);
    deleteDoc(docRef).then(() => {
      router.reload();
    });
  };

  useEffect(() => {
    console.log(a);
    if (!isEditing) {
      if (oldState != app) {
        const updateProg = async () => {
          const { id } = app;
          const d = { ...app };
          delete d.id;

          const docRef = doc(db, "programari", id);
          await setDoc(docRef, d);
          router.reload();
        };
        updateProg();
      }
    } else if (isEditing) {
      setOldState(app);
    }
  }, [isEditing]);

  return (
    <div className="w-full h-fit p-4 bg-slate-100 rounded-tl-xl rounded-br-xl">
      {isMedic && (
        <React.Fragment>
          {!isEditing && (
            <React.Fragment>
              <p className="text-xl mb-4 mt-8">{app.numePacient}</p>
              <p className="text-md mb-4">{app.notes}</p>
              <p className="text-sm mb-4">
                Programare{" "}
                {app.priority == 1
                  ? "obișnuită"
                  : app.priority == 2
                  ? "prioritară"
                  : "urgentă"}
              </p>
              {app.adHoc && <p className="text-sm mb-4">Programare adHoc</p>}
            </React.Fragment>
          )}
          {isEditing && (
            <React.Fragment>
              <p className="mb-2">Grad de urgență</p>
              <select
                className="mb-2 w-full px-2"
                value={app.priority}
                onChange={(e) => {
                  const newState = { ...app };
                  newState.priority = e.target.value;
                  setApp(newState);
                }}
              >
                <option value="1">Normal</option>
                <option value="2">Ridicat</option>
                <option value="3">Urgent</option>
              </select>
              <p className="mb-2">Note</p>
              <input
                className="w-full px-2"
                type="text"
                value={app.notes}
                onChange={(e) => {
                  const newState = { ...app };
                  newState.notes = e.target.value;
                  setApp(newState);
                }}
              ></input>
            </React.Fragment>
          )}

          <div className="flex flex-row gap-2 relative left-16 mt-6 ">
            <div
              className="w-10 h-10 bg-c2 p-2 text-sm text-white rounded-full center flex align-middle justify-center"
              onClick={() => {
                setIsEditing(!isEditing);
              }}
            >
              <i
                className={
                  "fa-solid self-center fa-" +
                  (isEditing ? "check fa-doutone" : "pen")
                }
              ></i>
            </div>
            <div
              className="w-10 h-10 bg-red-700 p-2 text-sm text-white rounded-full center flex align-middle justify-center"
              onClick={() => {
                deleteProg(app.id);
              }}
            >
              <i className="fa-solid self-center fa-trash-can"></i>
            </div>
          </div>
        </React.Fragment>
      )}
      {!isMedic && (
        <React.Fragment>
          <p className="text-xl mb-4 mt-8">{app.numeMedic}</p>
          <p className="text-md mb-4">{app.notes}</p>
          <p className="text-sm mb-4">
            Programare{" "}
            {app.priority == 1
              ? "obișnuită"
              : app.priority == 2
              ? "prioritară"
              : "urgentă"}
          </p>
          <div
            className="h-fit w-1/2 mt-8 relative left-1/4 p-2 text-white text-sm rounded-md bg-red-700"
            onClick={() => {
              deleteProg(app.id);
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
