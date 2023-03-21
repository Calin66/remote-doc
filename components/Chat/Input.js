import React, { useContext, useState } from "react";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";

const Input = ({ combinedId, messages }) => {
  const [text, setText] = useState("");
  const { currentUser } = useAuth();

  const handleSend = async () => {
    if (combinedId) {
      const newKey =
        Object.keys(messages).length === 0
          ? 1
          : Math.max(...Object.keys(messages)) + 1;

      await setDoc(
        doc(db, "chats", combinedId),
        {
          messages: {
            [newKey]: {
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
            },
          },
        },
        { merge: true }
      );
      setText("");
    } else console.log("nu avem combinedId");
  };
  return (
    <div className="fixed bottom-0 flex bg-gray-200 self-center items-center px-6 py-1 md:py-2 w-10/12 md:w-4/12  rounded-3xl mb-5 overflow-hidden">
      <input
        className=" bg-inherit w-10/12 py-1 outline-none"
        type="text"
        placeholder="Scrie ceva ... "
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        value={text}
      />
      <button
        onClick={handleSend}
        className="bg-c6 text-white md:w-2/12 max-w-xs w-14 h-full ml-10 rounded-3xl py-1 absolute right-0"
      >
        <i className="fa-sharp fa-solid fa-paper-plane"></i>
      </button>
    </div>
  );
};

export default Input;
