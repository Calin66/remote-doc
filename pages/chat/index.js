import Input from "@/components/Chat/Input";
import Message from "@/components/Chat/Message";
import Search from "@/components/Chat/Search";
import { db } from "@/firebase";
import useFetchForChat from "@/hooks/fetchForChat";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const index = () => {
  const { data, error, loading, combinedID, info } = useFetchForChat();
  const [combinedId, setCombinedId] = useState();
  const [messages, setMessages] = useState({});

  const auth = getAuth();
  const user = auth.currentUser;

  const role = Cookies.get("role");

  useEffect(() => {
    if (!loading && combinedID && role === "pacient") {
      const unsub = onSnapshot(doc(db, "chats", combinedID), (doc) => {
        setMessages(doc.data().messages);
      });
      return () => {
        unsub();
      };
    } else if (!loading && combinedId && role === "medic") {
      const unsub = onSnapshot(doc(db, "chats", combinedId), (doc) => {
        setMessages(doc.data().messages);
      });
      return () => {
        unsub();
      };
    }
  }, [loading, combinedId]);

  if (!loading)
    return (
      <>
        <Search
          info={info}
          setMessages={setMessages}
          setCombinedId={setCombinedId}
        />
        <div className=" bg-gray-100 rounded-xl w-full md:w-10/12 h-[78vh] max-w-3xl flex flex-col relative py-20 pb-10 px-[4vw] md:px-[2vw] overflow-y-scroll">
          {Object.values(messages).map((mesaj, i) => {
            console.log("mesaj", mesaj);
            return <Message message={mesaj} key={i} />;
          })}
        </div>
        <Input
          combinedId={role === "medic" ? combinedId : combinedID}
          comb
          messages={messages}
        />
      </>
    );
  else
    return (
      <>
        <h1 className="text-xl">LOADING ... </h1>
      </>
    );
};

export default index;
