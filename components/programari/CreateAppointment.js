import { async } from "@firebase/util";
import { addDoc, doc, collection } from "firebase/firestore";
import { auth } from "@/firebase";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import React from "react";
import { useRouter } from "next/router";
import useFetchPacienti from "@/hooks/fetchPacienti";

function CreateAppointment() {
  const router = useRouter();
  const [idMedic, setIdMedic] = useState(
    Cookies.get("role") == "medic" ? auth.currentUser.uid : ""
  );
  const [idPacient, setIdPacient] = useState("");
  const [date, setDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [priority, setPriority] = useState("1");
  const [notes, setNotes] = useState("");
  const { pacienti } = useFetchPacienti();

  const handleSubmit = (e) => {
    e.preventDefault();
    let er;
    const appointment = {
      idMedic,
      idPacient,
      date,
      startTime,
      endTime,
      priority,
      notes,
    };
    const CreateAppointment = async (a) => {
      console.log(a);
      try {
        const newAppointmentRef = await addDoc(collection(db, "programari"), a);
      } catch (error) {
        alert(error);
        er = error;
      } finally {
        if (!er) {
          router.reload();
        }
      }
    };
    CreateAppointment(appointment);
  };

  const redirectToHomePage = () => {
    router.push("/");
  };

  const inputClassName = "border-2 border-c3";

  return (
    <React.Fragment>
      {idMedic != "" && (
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label>Pacient</label>
          <select
            required
            value={idPacient}
            onChange={(e) => setIdPacient(e.target.value)}
            className={inputClassName}
          >
            <option disabled selected value="">
              -- alege un pacient --
            </option>
            {Object.keys(pacienti).map((p) => {
              const pc = pacienti[p];
              return <option value={pc.uid}>{pc.nume}</option>;
            })}
          </select>
          <label>Dată</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClassName}
            min={new Date().toISOString().split("T")[0]}
          ></input>
          <label>Oră început</label>
          <input
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClassName}
          ></input>
          <label>Oră final</label>
          <input
            type="time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={inputClassName}
            min={String(startTime)}
          ></input>
          <label>Grad de prioritate</label>
          <select
            required
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={inputClassName}
          >
            <option value="1" selected>
              Normal
            </option>
            <option value="2">Ridicat</option>
            <option value="3">Urgent</option>
          </select>
          <label>Note</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={inputClassName}
          ></input>

          <button className="bg-c5 rounded-md mt-8 p-2 px-4 text-c3 text-lg font-medium">
            Crează programare
          </button>
        </form>
      )}
      {!idMedic && redirectToHomePage()}
    </React.Fragment>
  );
}

export default CreateAppointment;
