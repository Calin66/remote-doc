import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import React, { useEffect, useRef } from "react";

const Message = ({ message }) => {
  const ref = useRef();
  const { currentUser } = useAuth();

  const role = Cookies.get("role");

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  // message ${message.senderId === currentUser.uid && "owner"}

  let dt = "";
  let data = new Date();
  let dataServer = message.date.toDate();
  let zile = Math.round((data - dataServer) / (1000 * 60 * 60 * 24));
  let ore = Math.round((data - dataServer) / (1000 * 60 * 60));
  let minute = Math.round((data - dataServer) / (1000 * 60));

  if (zile === 1) dt = "Ieri";
  else if (zile > 1) dt = `Acum ${zile} zile`;
  else if (ore === 1) dt = "Acum o oră";
  else if (ore > 1) dt = `Acum ${ore} ore`;
  else if (minute === 1) dt = "Un minut";
  else if (minute > 1) dt = `${minute} minute`;
  else if (minute < 1) dt = "Acum";

  return (
    <div
      ref={ref}
      className={
        message.senderId === currentUser.uid ? "flex flex-row-reverse" : "flex"
      }
    >
      <div
        className={
          role === "medic"
            ? message.senderId === currentUser.uid
              ? "flex flex-col my-5 float-right justify-end items-end"
              : "flex flex-col my-5 float-right justify-end"
            : message.senderId === currentUser.uid
            ? "flex flex-col my-5 float-right justify-end items-end"
            : "flex flex-col my-5 float-right justify-end"
        }
      >
        <div
          className={
            role === "medic"
              ? message.senderId === currentUser.uid
                ? "text-white p-2 px-5 rounded-xl rounded-br-none bg-c2"
                : "text-white p-2 px-5 rounded-xl rounded-bl-none bg-c5"
              : message.senderId === currentUser.uid
              ? "text-white p-2 px-5 rounded-xl rounded-br-none bg-c5"
              : "text-white p-2 px-5 rounded-xl rounded-bl-none bg-c2"
          }
        >
          <p>{message.text}</p>
          {/* {message.img && <img src={message.img} alt="" />} */}
        </div>
        <p>{dt}</p>
      </div>
    </div>
  );
};

export default Message;
