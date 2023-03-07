import React, { useState } from "react";

function index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nume, setNume] = useState("");
  const [pas, setPas] = useState(1);

  return (
    <div className=" border-l border-white flex flex-col justify-center">
      {pas === 1 && (
        <div>
          <input
            type="text"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
            placeholder="Nume complet"
            className="outline-none duration-300 border-b-2 border-solid border-white focus:border-cyan-300 text-slate-900 p-2 w-full max-w-[40ch]"
          />

          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresa email"
            className="outline-none duration-300 border-b-2 border-solid border-white focus:border-cyan-300 text-slate-900 p-2 w-full max-w-[40ch]"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid border-white focus:border-cyan-300"
          />

          <button onClick={() => setPas(pas + 1)}>Next</button>
        </div>
      )}
      {pas === 2 && <div></div>}
      {pas === 3 && <div></div>}
    </div>
  );
}

export default index;
