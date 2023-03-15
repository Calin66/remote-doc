import { auth } from "@/firebase";
import { async } from "@firebase/util";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import React from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import useFetchPacienti from "@/hooks/fetchPacienti";

function ViewAllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isMedic, setIsMedic] = useState(Cookies.get("role") == "medic");
  const [isAuth, setIsAuth] = useState(auth.currentUser);
  const { pacienti } = useFetchPacienti();
  const [userToId, setUserToId] = useState(new Map());

  useEffect(() => {
    const p_uid = new Map();
    console.log(Object.keys(pacienti));
    /*Object.keys(pacienti).map((p) => {
      const pc = pacienti[p];
      console.log(pc);
      p_uid.set(pc.uid.toString(), pc.nume);
    });
    console.log(p_uid);*/
    setUserToId(p_uid);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const app = [];
      const q = query(
        collection(db, "programari"),
        where(isMedic ? "idMedic" : "idPacient", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const el = doc.data();
        el.id = doc.id;
        app.push(el);
      });
      setAppointments(app);
    };
    if (isAuth) fetchData();
  }, []);

  return (
    <React.Fragment>
      {appointments.length == 0 && (
        <p className="text-xl">Nu aveți programări</p>
      )}
      {appointments.length != 0 && (
        <table className="text-xl text-left">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-3 text-md font-semibold tracking-wide">Nume</th>
              <th className="p-3 text-md font-semibold tracking-wide">Dată</th>
              <th className="p-3 text-md font-semibold tracking-wide">
                Oră început
              </th>
              <th className="p-3 text-md font-semibold tracking-wide">
                Oră final
              </th>
              <th className="p-3 text-md font-semibold tracking-wide"></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((ap) => (
              <tr key={ap.id} className="odd:bg-slate-100">
                <td className="p-3 text-lg text-gray-700">
                  {isMedic ? userToId.get(ap.idPacient) : ap.idMedic}
                </td>
                <td className="p-3 text-lg text-gray-700">
                  {ap.date[8] +
                    ap.date[9] +
                    "-" +
                    ap.date[5] +
                    ap.date[6] +
                    "-" +
                    ap.date[0] +
                    ap.date[1] +
                    ap.date[2] +
                    ap.date[3]}
                </td>
                <td className="p-3 text-lg text-gray-700">{ap.startTime}</td>
                <td className="p-3 text-lg text-gray-700">{ap.endTime}</td>
                <td className="p-3 text-lg text-gray-700 tracking-wider">
                  <Link href="/" className="text-c2 hover:underline">
                    edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}

export default ViewAllAppointments;
