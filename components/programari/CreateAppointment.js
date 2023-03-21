import { async } from "@firebase/util";
import { addDoc, doc, collection } from "firebase/firestore";
import { auth } from "@/firebase";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import React from "react";
import { useRouter } from "next/router";
import useFetchPacienti from "@/hooks/fetchPacienti";
import { useAuth } from "@/context/AuthContext";
import { GetUserData } from "@/hooks/fetchUser";
import { formateDate } from "../utils";

function CreateAppointment({ day, start_t, end_t }) {
  const router = useRouter();
  const [isMedic, setIsMedic] = useState(Cookies.get("role") == "medic");
  const [idMedic, setIdMedic] = useState("");
  const [idPacient, setIdPacient] = useState("");
  const [date, setDate] = useState(day);
  const [startTime, setStartTime] = useState(start_t);
  const [endTime, setEndTime] = useState(end_t);
  const [priority, setPriority] = useState("1");
  const [notes, setNotes] = useState("");
  const [adHoc, setAdHoc] = useState(false);
  const { pacienti } = useFetchPacienti();
  const { currentUser } = useAuth();

  const [numeMedic, setNumeMedic] = useState("");
  const [numePacient, setNumePacient] = useState("");
  const [idToNume] = useState(new Map());

  useEffect(() => {
    if (isMedic) {
      setIdMedic(currentUser.uid);
      let medic;
      async function f() {
        medic = await GetUserData("medic", currentUser.uid);
        setNumeMedic(medic.nume);
      }
      f();
    } else {
      setIdPacient(currentUser.uid);
      let pacient;
      async function f() {
        pacient = await GetUserData("pacient", currentUser.uid);
      }
      f().then(() => {
        console.log(pacient);
        setNumeMedic(pacient.numeMedic);
        setNumePacient(pacient.nume);
        setIdMedic(pacient.doc_uid);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let er;

    let pacName;

    if (isMedic && !adHoc) {
      const pac = Object.keys(pacienti);
      pac.forEach((p) => {
        if (pacienti[p].uid == idPacient) {
          setNumePacient(pacienti[p].nume);
          pacName = pacienti[p].nume;
          //console.log(numePacient);
          return;
        }
      });
    }

    const appointment = {
      idMedic,
      numeMedic,
      idPacient,
      numePacient: isMedic && !adHoc ? pacName : numePacient,
      date,
      startTime,
      endTime,
      priority,
      notes,
      adHoc,
    };
    //console.log(appointment);
    const CreateAppointment = async (a) => {
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

  const inputClassName = "border-2 border-c3 mb-4 px-1";

  return (
    <React.Fragment>
      <form className="flex flex-col mt-4" onSubmit={handleSubmit}>
        {isMedic && (
          <React.Fragment>
            <div className="flex flex-row gap-4 mb-4">
              <label>Programare ad-hoc?</label>
              <input
                onChange={(e) => {
                  setAdHoc(e.target.checked);
                }}
                value={adHoc}
                type="checkbox"
              ></input>
            </div>
            <label>Pacient</label>
            {!adHoc && (
              <select
                required
                value={idPacient}
                onChange={(e) => {
                  setIdPacient(e.target.value);
                }}
                className={inputClassName}
                autoComplete
              >
                <option disabled value="">
                  -- alege un pacient --
                </option>
                {Object.keys(pacienti).map((p) => {
                  const pc = pacienti[p];
                  return (
                    <option value={pc.uid} key={pc.uid}>
                      {pc.nume}
                    </option>
                  );
                })}
              </select>
            )}
            {adHoc && (
              <input
                type="text"
                required
                value={numePacient}
                onChange={(e) => setNumePacient(e.target.value)}
                className={inputClassName}
              ></input>
            )}
            {/*<label>Dată</label>
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
          ></input>*/}
            <label>Grad de prioritate</label>
            <select
              required
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={inputClassName}
            >
              <option value="1">Normal</option>
              <option value="2">Ridicat</option>
              <option value="3">Urgent</option>
            </select>
          </React.Fragment>
        )}
        {!isMedic && (
          <p className="mb-4 text-lg leading-6">
            Programare la <span className="font-medium">{numeMedic}</span> în
            data de <span className="font-medium">{formateDate(date)}</span> de
            la ora <span className="font-medium">{startTime}</span> până la ora{" "}
            <span className="font-medium">{endTime}</span>
          </p>
        )}
        <label>Note</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClassName}
        ></input>

        <button className="bg-c5 rounded-md mt-4 p-2 px-4 text-c3 text-lg font-medium">
          Crează programare
        </button>
      </form>
    </React.Fragment>
  );
}

export default CreateAppointment;
