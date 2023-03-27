import useFetchProgramari from "@/hooks/fetchProgramari";
import { map } from "lodash";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatMinutes, getTimeDif } from "../utils";
import CreateAppointment from "./CreateAppointment";
import { useRouter } from "next/router";
import ViewProgramare from "./ViewProgramare";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { GetUserData } from "@/hooks/fetchUser";
import { convertTimeToMinutes } from "../utils";
import { async } from "@firebase/util";

function TimeSlots() {
  const [day, setDay] = useState("");
  const [userApp, setUserApp] = useState([]);
  const [startTimes, setStartTimes] = useState(new Map());
  const [opened, setOpened] = useState(new Map());
  const [isMedic] = useState(Cookies.get("role") == "medic");
  const [start_t, setStart_t] = useState(0);
  const [end_t, setEnd_t] = useState(0);
  const [active, setActive] = useState(0);
  const [appLen, setAppLen] = useState(0);
  const [len, setLen] = useState(0);
  const router = useRouter();
  const { currentUser } = useAuth();
  const [programMedic, setProgramMedic] = useState({});

  const { appo, docAppo } = useFetchProgramari();

  useEffect(() => {
    if (!currentUser) router.push("/");
    let programari;
    if (isMedic) programari = appo;
    else programari = docAppo;

    programari.sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
    programari = programari.filter((value) => value.date == day);

    if (programari.length > 0) {
      setLen(getTimeDif(programari[0].endTime, programari[0].startTime));
      const newStartTimes = new Map();
      programari.forEach((p) => {
        if (!isMedic) {
          p.isMine = p.idPacient == currentUser.uid;
        }
        newStartTimes.set(p.startTime, p);
      });
      setStartTimes(newStartTimes);
    } else {
      setStartTimes(new Map());
    }

    setUserApp(programari);
  }, [appo, day, docAppo]);

  useEffect(() => {
    async function getM() {
      if (!isMedic) pacient = await GetUserData("Pacient", currentUser.uid);
    }
    getM().then(() => {
      let medic;
      let id;
      if (isMedic) id = currentUser.uid;
      else id = pacient.doc_uid;

      async function f() {
        medic = await GetUserData("medic", id);
      }

      f().then(() => {
        const program = medic["program"];
        setProgramMedic(program);
        setAppLen(medic["durata_programare"]);
      });
    });
  }, []);

  useEffect(() => {
    if (userApp.length == 0) {
      setLen(+appLen);
    }
  }, [appLen, userApp]);

  useEffect(() => {
    let dayOfWeek = new Date(day).getDay();
    dayOfWeek--;
    if (dayOfWeek < 0) dayOfWeek = 6;
    const program = programMedic[dayOfWeek];
    if (program) {
      setActive(program.active);
      setStart_t(convertTimeToMinutes(program.start));
      setEnd_t(convertTimeToMinutes(program.end));
    }
  }, [programMedic, day]);

  const renderSlots = () => {
    const slots = [];
    for (let i = start_t; i + len <= end_t; i += len) {
      const fmi = formatMinutes(i);
      let cl = "c1";
      if (startTimes.has(formatMinutes(i))) {
        const { priority } = startTimes.get(formatMinutes(i));
        if (priority == 1) cl = "c2";
        else if (priority == 2) cl = "c4";
        else if (priority == 3) cl = "c5";
        if (!isMedic) {
          if (!startTimes.get(fmi).isMine) cl = "c2";
        }
      }
      slots.push(
        <div className="w-full" key={i}>
          <div className="flex flex-row gap-4 items-center">
            <div className={"p-4 rounded-md bg-" + cl}>
              {formatMinutes(i) + "-" + formatMinutes(i + len)}
            </div>
            {(isMedic ||
              !startTimes.has(fmi) ||
              startTimes.get(fmi).isMine == true) && (
              <div
                className="bg-c1 h-8 w-8 pt-[2px] rounded-md text-xl cursor-pointer"
                onClick={() => {
                  const newOpened = new Map(opened);
                  if (!newOpened.has(i)) newOpened.set(i, 1);
                  else newOpened.delete(i);
                  setOpened(newOpened);
                }}
              >
                <i
                  className={
                    "fa-xs fa-solid fa-" +
                    (opened.has(i)
                      ? "xmark"
                      : startTimes.has(formatMinutes(i))
                      ? "eye"
                      : "plus")
                  }
                ></i>
              </div>
            )}
          </div>
          {opened.has(i) && (
            <div className="my-2">
              {startTimes.has(formatMinutes(i)) ? (
                <ViewProgramare a={startTimes.get(formatMinutes(i))} />
              ) : (
                <CreateAppointment
                  day={day}
                  start_t={formatMinutes(i)}
                  end_t={formatMinutes(i + len)}
                />
              )}
            </div>
          )}
        </div>
      );
    }
    return slots;
  };

  return (
    <React.Fragment>
      <div className="flex flex-row">
        <p className="mr-4 mt-1 text-lg">Alege o dată:</p>
        <input
          className="border-2 border-c3 rounded-md py-1 px-2 mb-16"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDay(e.target.value)}
          value={day}
        ></input>
      </div>
      {day && active && (
        <div className="w-48 text-center flex flex-col gap-4">
          {renderSlots()}
        </div>
      )}
      {!active && day && <p>Medicul nu este disponibil în această zi</p>}
    </React.Fragment>
  );
}

export default TimeSlots;
