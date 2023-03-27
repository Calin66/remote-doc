import React, { useEffect, useState } from "react";
import Link from "next/link";
import CalendarDay from "./CalendarDay";
import CalendarWeek from "./CalendarWeek";
import useFetchProgramari from "@/hooks/fetchProgramari";
import { useAuth } from "@/context/AuthContext";
import { GetUserData } from "@/hooks/fetchUser";
import Cookies from "js-cookie";

function Calendar() {
  const [appointments, setAppointments] = useState([]);
  const [isMedic, setIsMedic] = useState(Cookies.get("role") == "medic");
  const { appo } = useFetchProgramari();
  const { currentUser } = useAuth();
  const [userToId, setUserToId] = useState(new Map());

  useEffect(() => {
    const prog = appo;
    prog.forEach(async (a) => {
      if (isMedic) {
        if (!userToId.has(a.idPacient)) {
          const pacientName = await GetUserData("pacient", a.idPacient).then(
            (v) => v.nume
          );
          const copy = userToId;
          copy.set(a.idPacient, pacientName);
          setUserToId(copy);
        }
        a.name = userToId.get(a.idPacient);
      }
      a.start_minute = convertTimeToMinutes(a.startTime);
      a.end_minute = convertTimeToMinutes(a.endTime);
    });
    setAppointments(appo);
  }, [appo, userToId]);

  const programari = [
    {
      start_minute: 900,
      end_minute: 945,
      name: "Ovidiu",
      day: 1,
      id: "1234",
    },
    {
      start_minute: 600,
      end_minute: 615,
      name: "Monica",
      day: 2,
      id: "124",
    },
    {
      start_minute: 300,
      end_minute: 330,
      day: 4,
      name: "Andrei",
      id: "123",
    },
  ];

  return CalendarDay(appointments);
}

const convertTimeToMinutes = (x) => {
  return (
    x.charAt(0) * 600 +
    x.charAt(1) * 60 +
    x.charAt(3) * 10 +
    x.charAt(4) * 1 -
    "0"
  );
};

export default Calendar;
