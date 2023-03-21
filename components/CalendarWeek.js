import React from "react";
import Link from "next/link";
import Calendar from "./Calendar";

const hour_pixel_per_minute = 1.6;
function CalendarWeek(programari) {
  const daysOfWeek = [
    "Luni",
    "Marți",
    "Miercuri",
    "Joi",
    "Vineri",
    "Sâmbătă",
    "Duminică",
  ];
  const hours = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];
  const pixel_per_day = 128;

  return (
    <div className="overflow-auto w-full justify-self-end">
      <div className="relative box-border">
        <table className="w-fit table-fixed">
          <thead>
            <tr className="h-8 border-y-2">
              <th className="w-[64px] border-l-2 px-2 text-center"></th>
              {daysOfWeek.map((day) => (
                <th key={day} className="border-x-2 w-[128px] text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr className="h-24 border-y-2">
                <td className="border-l-2 px-2 text-center pb-14">{hour}</td>
                {daysOfWeek.map((day) => (
                  <td key={day} className="border-x-2"></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {programari.map((programare) => (
          <Link
            key={programare.id}
            href={"view/" + programare.id}
            style={{
              top:
                Math.floor(programare.start_minute * hour_pixel_per_minute) +
                32 +
                "px",
              //height: getHeight(programare) + "px",
              left: 64 + (programare.day - 1) * pixel_per_day + "px",
            }}
            className="text-lg absolute w-[128px] duration-150 ease-inout hover:b hover:w-64 bg-c2 text-white rounded-lg px-4 py-2 flex flex-col overflow-y-hidden weekCard"
          >
            {programare.name}
            {
              /*isLongForTwoRows(programare) &&*/ <p
                className={"text-sm pt-1.5"}
              >
                {formatTime(programare.start_minute) +
                  "-" +
                  formatTime(programare.end_minute)}
              </p>
            }
          </Link>
        ))}
      </div>
    </div>
  );
}

let formatTime = (minute) =>
  toTwoDigits(Math.floor(minute / 60)) + ":" + toTwoDigits(minute % 60);
let toTwoDigits = (value) => (value < 10 ? "0" : "") + value.toString();
let isLongForTwoRows = (programare) =>
  programare.end_minute - programare.start_minute > 35;
let isLongForOneRow = (programare) =>
  programare.end_minute - programare.start_minute > 10;

let getHeight = (programare) => {
  console.log(
    Math.floor(
      (programare.end_minute - programare.start_minute) * hour_pixel_per_minute
    )
  );
  return Math.floor(
    (programare.end_minute - programare.start_minute) * hour_pixel_per_minute
  );
};

export default CalendarWeek;
