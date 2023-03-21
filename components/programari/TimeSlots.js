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

function TimeSlots() {
  const [day, setDay] = useState("");
  const [userApp, setUserApp] = useState([]);
  const [startTimes, setStartTimes] = useState(new Map());
  const [opened, setOpened] = useState(new Map());
  const [isMedic] = useState(Cookies.get("role") == "medic");
  const start_h = 8,
    start_m = 0,
    start_t = start_h * 60 + start_m;
  const end_h = 14,
    end_m = 0,
    end_t = end_h * 60 + end_m;
  const [len, setLen] = useState();
  const router = useRouter();
  const { currentUser } = useAuth();

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
    } else setLen(30);

    setUserApp(programari);
  }, [appo, day, docAppo]);

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
        <div key={i}>
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
      <input
        className="border-2 border-c3 rounded-md py-1 px-2 mb-16"
        type="date"
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) => setDay(e.target.value)}
        value={day}
      ></input>
      {day && (
        <div className="w-48 text-center flex flex-col gap-4">
          {renderSlots()}
        </div>
      )}
    </React.Fragment>
  );
}

export default TimeSlots;
