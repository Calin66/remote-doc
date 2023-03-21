import React from "react";
import Link from "next/link";

function CalendarDay(programari) {
  const hours = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];
  const hour_pixel_per_minute = 2.6666666;

  return (
    <div>
      <table className="relative w-full">
        {hours.map((hour) => (
          <tr className="h-40 border-y-2">
            <td className="w-12 border-l-2 px-2 text-center pb-24">{hour}</td>
            <td className="border-x-2 w-96"></td>
          </tr>
        ))}
        {programari.map((programare) => (
          <Link
            key={programare.id}
            href={"/programari"}
            style={{
              top:
                Math.floor(programare.start_minute * hour_pixel_per_minute) +
                "px",
              height:
                Math.floor(
                  (programare.end_minute - programare.start_minute) *
                    hour_pixel_per_minute
                ) + "px",
            }}
            className={
              "text-lg absolute w-96 left-12 bg-lime-700 rounded-lg px-4 py-2 text-white flex border-white border-2 " +
              (isLongForTwoRows(programare) ? "flex-col" : "flex-row")
            }
          >
            {programare.name}
            <p
              className={
                "text-sm " + (isLongForTwoRows(programare) ? "" : "pt-1.5 pl-4")
              }
            >
              {formatTime(programare.start_minute) +
                "-" +
                formatTime(programare.end_minute)}
            </p>
          </Link>
        ))}
      </table>
    </div>
  );
}

let formatTime = (minute) =>
  toTwoDigits(Math.floor(minute / 60)) + ":" + toTwoDigits(minute % 60);
let toTwoDigits = (value) => (value < 10 ? "0" : "") + value.toString();
let isLongForTwoRows = (programare) =>
  programare.end_minute - programare.start_minute > 30;

export default CalendarDay;
