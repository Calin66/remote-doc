import React from "react";
import Link from "next/link";
import CalendarDay from "./CalendarDay";
import CalendarWeek from "./CalendarWeek";

function Calendar() {
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
      end_minute: 620,
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

  return CalendarWeek(programari);
}

export default Calendar;
