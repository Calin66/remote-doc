import { useEffect, useState } from "react";
import React from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import useFetchPacienti from "@/hooks/fetchPacienti";
import useFetchProgramari from "@/hooks/fetchProgramari";

function ViewAllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isMedic, setIsMedic] = useState(Cookies.get("role") == "medic");
  const { pacienti } = useFetchPacienti();
  const { appo } = useFetchProgramari();

  const [userToId, setUserToId] = useState(new Map());

  useEffect(() => {
    const mapPacients = () => {
      const p_uid = new Map();

      Object.keys(pacienti).map((p) => {
        const pc = pacienti[p];
        p_uid.set(pc.uid, pc.nume);
      });
      setUserToId(p_uid);
    };
    if (isMedic) mapPacients();
  }, [pacienti]);

  useEffect(() => {
    setAppointments(appo);
    console.log(appointments);
  }, [appo]);

  const getPriorityElement = (pr) => {
    let word, style;
    if (pr == 1) {
      word = "normal";
      style = "bg-c2 text-white";
    } else if (pr == 2) {
      word = "mediu";
      style = "bg-orange-400 text-white";
    } else if (pr == 3) {
      word = "ridicat";
      style = "bg-red-500 text-white";
    }
    return (
      <p className={style + " rounded-md px-2 py-1 w-fit text-center"}>
        {word}
      </p>
    );
  };

  return (
    <React.Fragment>
      {appointments.length == 0 && (
        <p className="text-xl">Nu aveți programări</p>
      )}
      {appointments.length != 0 && (
        <table className="text-xl text-left w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-3 text-md font-semibold tracking-wide">
                Nume {isMedic ? "pacient" : "medic"}
              </th>
              <th className="p-3 text-md font-semibold tracking-wide">Dată</th>
              <th className="p-3 text-md font-semibold tracking-wide">
                Oră început
              </th>
              <th className="p-3 text-md font-semibold tracking-wide">
                Oră final
              </th>
              {isMedic && (
                <th className="p-3 text-md font-semibold tracking-wide">
                  Prioritate
                </th>
              )}
              <th className="p-3 text-md font-semibold tracking-wide">Note</th>
              {isMedic && (
                <th className="p-3 text-md font-semibold tracking-wide">
                  Modifică
                </th>
              )}
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
                {isMedic && (
                  <td className="p-3 text-lg text-gray-700">
                    {getPriorityElement(ap.priority)}
                  </td>
                )}
                <td className="p-3 text-lg text-gray-700">{ap.notes}</td>
                {isMedic && (
                  <td className="p-3 text-lg text-gray-700 tracking-wider text-center">
                    <Link href="/" className="text-c2 hover:underline">
                      edit
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}

export default ViewAllAppointments;
